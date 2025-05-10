from flask import Flask, request, jsonify
import torch
from torch_geometric.data import Data
from torch_geometric.loader import DataLoader
from sklearn.model_selection import train_test_split
from models import GATClassifier, SweetTalk_immunoClassifier_large  # Import your models
import pandas as pd
import torch.optim as optim
from torch_geometric.nn import GATConv, global_mean_pool
import random

app = Flask(__name__)

# Load models
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
immuno_model = torch.load('models/SweetTalk_immunoClassifier_large.pt', map_location=device)
immuno_model.eval()

# Define helper functions for glycan processing
def process_sequence(seq):
    # Your sequence processing logic here
    pass

def predict_immunogenicity(sequence):
    # Process the input sequence
    processed_seq = process_sequence(sequence)
    
    # Create graph object and DataLoader
    data_list = []
    for seq in processed_seq:
        edge_index = torch.tensor([(i, i + 1) for i in range(len(seq) - 1)] +
                                   [(i + 1, i) for i in range(len(seq) - 1)],
                                   dtype=torch.long).t().contiguous()

        data = Data(x=torch.tensor(seq, dtype=torch.long), y=torch.tensor([1], dtype=torch.float), edge_index=edge_index)
        data_list.append(data)
    
    train_loader = DataLoader(data_list, batch_size=32, shuffle=False)
    
    # Run prediction
    with torch.no_grad():
        for data in train_loader:
            data = data.to(device)
            output = immuno_model(data.x, data.edge_index, data.batch)
            prediction = torch.sigmoid(output).item()
    return prediction

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    sequence = data['glycan_sequence']
    
    # Predict immunogenicity
    prediction = predict_immunogenicity(sequence)
    
    # Return result
    return jsonify({'prediction': 1 if prediction >= 0.5 else 0})

if __name__ == "__main__":
    app.run(debug=True)
