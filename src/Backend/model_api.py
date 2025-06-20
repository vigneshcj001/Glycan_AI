import os
import json
import re
import torch
import torch.nn as nn
import torch.nn.functional as F
from flask import Flask, request, jsonify
from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS

from torch_geometric.data import Data, Batch
from torch_geometric.nn import MessagePassing, global_mean_pool
from torch_geometric.utils import add_self_loops


# ============================== Glycan Helpers ==============================

def motif_find(s):
    b = s.split('(')
    b = [k.split(')') for k in b]
    b = [item for sublist in b for item in sublist]
    b = [k.strip('[]') for k in b]
    b = ['*'.join(b[i:i+5]) for i in range(0, len(b)-4, 2)]
    return b

def process_glycans(glycan_list):
    glycan_motifs = [motif_find(k) for k in glycan_list]
    glycan_motifs = [[i.split('*') for i in k] for k in glycan_motifs]
    return [item for sublist in glycan_motifs for item in sublist]

def character_to_label(character, libr):
    return libr.index(character)

def string_to_labels(glycoword_list, libr):
    return [character_to_label(word, libr) for word in glycoword_list]

def sequence_to_graph(seq_tokens, label=0):
    if not seq_tokens:
        return None
    x = torch.tensor(seq_tokens, dtype=torch.long).view(-1, 1)
    edge_indices = [[i, i + 1] for i in range(len(seq_tokens) - 1)]
    edge_indices += [[i + 1, i] for i in range(len(seq_tokens) - 1)]
    edge_index = torch.tensor(edge_indices, dtype=torch.long).t().contiguous() if edge_indices else torch.empty((2, 0), dtype=torch.long)
    y = torch.tensor([label], dtype=torch.float)
    return Data(x=x, edge_index=edge_index, y=y)

def detect_known_motifs(sequence):
    motifs = {
        "Gal(a1-3)Gal": "AlphaGal",
        "Neu5Gc": "NonHumanSialicAcid",
        "Man(b1-4)GlcNAc(b1-4)": "ComplexNGlycan"
    }
    detected = [name for pattern, name in motifs.items() if pattern in sequence]
    return detected

# =========================== Model Definition ==============================

class MPNNLayer(MessagePassing):
    def __init__(self, in_dim, out_dim):
        super(MPNNLayer, self).__init__(aggr='add')
        self.lin = nn.Linear(in_dim, out_dim)

    def forward(self, x, edge_index):
        edge_index, _ = add_self_loops(edge_index, num_nodes=x.size(0))
        return self.propagate(edge_index, x=x)

    def message(self, x_j):
        return x_j

    def update(self, aggr_out):
        return self.lin(aggr_out)

class MPNNClassifier(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim, output_dim, dropout=0.5):
        super(MPNNClassifier, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.mpnn1 = MPNNLayer(embed_dim, hidden_dim)
        self.bn1 = nn.BatchNorm1d(hidden_dim)
        self.mpnn2 = MPNNLayer(hidden_dim, hidden_dim)
        self.bn2 = nn.BatchNorm1d(hidden_dim)
        self.lin1 = nn.Linear(hidden_dim, hidden_dim // 2)
        self.dropout = nn.Dropout(dropout)
        self.lin2 = nn.Linear(hidden_dim // 2, output_dim)

    def forward(self, x, edge_index, batch):
        x = self.embedding(x.squeeze(1))
        x = F.relu(self.bn1(self.mpnn1(x, edge_index)))
        x = F.relu(self.bn2(self.mpnn2(x, edge_index)))
        x = global_mean_pool(x, batch)
        x = F.relu(self.lin1(x))
        x = self.dropout(x)
        x = self.lin2(x)
        return x

# ============================ Load Model ===================================

try:
    with open('glycoword_vocab.json', 'r') as f:
        VOCAB = json.load(f)
except FileNotFoundError:
    print("FATAL ERROR: glycoword_vocab.json not found.")
    exit()

VOCAB_SIZE = len(VOCAB) + 1
EMBED_DIM = 64
HIDDEN_DIM = 64
OUTPUT_DIM = 1
DROPOUT = 0.5
MODEL_PATH = 'Models_MPNN_immunoClassifier_final.pt'

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

model = MPNNClassifier(
    vocab_size=VOCAB_SIZE,
    embed_dim=EMBED_DIM,
    hidden_dim=HIDDEN_DIM,
    output_dim=OUTPUT_DIM,
    dropout=DROPOUT
)

try:
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    model.to(device)
    model.eval()
    print("Model loaded successfully.")
except FileNotFoundError:
    print(f"FATAL ERROR: Model file not found at {MODEL_PATH}")
    exit()

# =========================== API Endpoints =================================
model_api = Blueprint('model_api',__name__)
@model_api.route('/validate', methods=['POST'])
def validate_sequence():
    data = request.get_json()
    sequence = data.get('sequence', '')
    if not sequence:
        return jsonify({"valid": False, "reason": "Sequence is empty."}), 400

    try:
        glycowords = process_glycans([sequence])
        if not glycowords:
            return jsonify({"valid": False, "reason": "Too short or invalid glycan structure."})
        string_to_labels(glycowords, VOCAB)
    except ValueError:
        return jsonify({"valid": False, "reason": "Unknown glycowords in the sequence."})
    except Exception as e:
        return jsonify({"valid": False, "reason": str(e)}), 500

    return jsonify({"valid": True})

@model_api.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    sequence = data.get('sequence', '')
    if not sequence:
        return jsonify({"error": "No sequence provided"}), 400

    try:
        glycowords = process_glycans([sequence])
        if not glycowords:
            return jsonify({"error": "Invalid glycan structure or too short to analyze."}), 400

        tokens = string_to_labels(glycowords, VOCAB)
        graph = sequence_to_graph(tokens)
        if graph is None:
            return jsonify({"error": "Could not create a graph from the sequence."}), 400

        batch = Batch.from_data_list([graph]).to(device)
        with torch.no_grad():
            output_logits = model(batch.x, batch.edge_index, batch.batch)
        score = torch.sigmoid(output_logits).item()
        prediction_label = "Immunogenic" if score >= 0.5 else "Non-Immunogenic"

        motifs = detect_known_motifs(sequence)
     

        return jsonify({
            "prediction": prediction_label,
            "score": score,
            "motifs_detected": motifs
        })

    except ValueError:
        return jsonify({"error": "Prediction failed due to unknown glycowords."}), 400
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": "An internal error occurred."}), 500
