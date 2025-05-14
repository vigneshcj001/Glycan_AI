from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import random
from collections import Counter

app = Flask(__name__)
CORS(app)

# Load monosaccharide list
df = pd.read_csv('monosaccharides_counts.csv')
all_sugars = df['Monosaccharide'].dropna().tolist()

all_bonds = [
    'a1-1', 'a1-2', 'a1-3', 'a1-4', 'a1-5', 'a1-6', 'a1-7', 'a1-8',
    'a2-1', 'a2-2', 'a2-3', 'a2-4', 'a2-5', 'a2-6', 'a2-7', 'a2-8',
    'a2-9', 'b1-1', 'b1-2', 'b1-3', 'b1-4', 'b1-5', 'b1-6', 'b1-7',
    'b1-8', 'b1-9', 'b2-1', 'b2-2', 'b2-3', 'b2-4', 'b2-5', 'b2-6',
    'b2-7', 'b2-8'
]

def motif_find(s):
    b = s.split('(')
    b = [k.split(')') for k in b]
    b = [item for sublist in b for item in sublist]
    b = [k.replace('[', '').replace(']', '') for k in b]
    b = ['*'.join(b[i:i+5]) for i in range(0, len(b)-4, 2)]
    return b

def small_motif_find(s):
    b = s.split('(')
    b = [k.split(')') for k in b]
    b = [item for sublist in b for item in sublist]
    b = [k.replace('[', '').replace(']', '') for k in b]
    b = '*'.join(b)
    return b

def motif_find_mutate(s, mutate=True, n_mut=1, mode='normal'):
    b = s.split('(')
    b = [k.split(')') for k in b]
    b = [item for sublist in b for item in sublist]
    b = [k.replace('[', '').replace(']', '') for k in b]

    if mutate:
        for _ in range(n_mut):
            idx = random.choice(range(len(b)))
            if idx % 2 == 0:
                b[idx] = random.choice(all_sugars)
            else:
                b[idx] = random.choice(all_bonds)

    b_label = '*'.join(b)
    b = ['*'.join(b[i:i+5]) for i in range(0, len(b)-4, 2)]
    return b, b_label

def process_mutated_glycans(glycan, n_mut=1, n=100, mode='normal'):
    wt, wt_label = motif_find_mutate(glycan, mutate=False)
    wt = [i.split('*') for i in wt]
    glycan_motifs, glycan_labels = zip(*[motif_find_mutate(glycan, n_mut=n_mut, mode=mode) for _ in range(n)])
    glycan_motifs = [[i.split('*') for i in k] for k in glycan_motifs]
    out = [wt] + list(glycan_motifs)
    out_labels = [wt_label] + list(glycan_labels)
    return out, out_labels

@app.route("/motif/mutate", methods=["POST"])
def mutate():
    data = request.get_json()
    sequence = data.get("sequence", "")
    if not sequence:
        return jsonify({"error": "No glycan sequence provided"}), 400

    n_mut = int(data.get("n_mut", 1))
    n = int(data.get("n", 100))
    mode = data.get("mode", "normal")

    motifs, labels = process_mutated_glycans(sequence, n_mut=n_mut, n=n, mode=mode)

    flat_motifs = [tuple(m) for sublist in motifs for m in sublist]
    motif_freq = Counter(flat_motifs)
    motif_freq_str = {"*".join(k): v for k, v in motif_freq.items()}

    return jsonify({
        "motif_frequencies": motif_freq_str,
        "mutated_sequences": labels
    })

@app.route("/motif/small", methods=["POST"])
def small_motif():
    data = request.get_json()
    sequence = data.get("sequence", "")
    result = small_motif_find(sequence)
    return jsonify({"small_motif": result})

@app.route("/motif/find", methods=["POST"])
def motif():
    data = request.get_json()
    sequence = data.get("sequence", "")
    result = motif_find(sequence)
    return jsonify({"motifs": result})

if __name__ == "__main__":
    app.run(debug=True, port=5000)