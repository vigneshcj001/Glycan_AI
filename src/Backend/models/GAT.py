import torch
import torch.nn as nn
from torch_geometric.nn import GATConv, global_mean_pool

class GATClassifier(nn.Module):
    def __init__(self, vocab_size, input_dim, hidden_dim, output_dim, heads=4, dropout=0.2):
        super(GATClassifier, self).__init__()
        self.encoder = nn.Embedding(vocab_size, input_dim)
        self.gat1 = GATConv(input_dim, hidden_dim, heads=heads, dropout=dropout)
        self.bn1 = nn.BatchNorm1d(hidden_dim * heads)
        self.act1 = nn.ELU()
        self.dropout1 = nn.Dropout(dropout)
        self.gat2 = GATConv(hidden_dim * heads, hidden_dim, heads=1, concat=True, dropout=dropout)
        self.bn2 = nn.BatchNorm1d(hidden_dim)
        self.act2 = nn.ELU()
        self.lin1 = nn.Linear(hidden_dim, hidden_dim)
        self.relu = nn.ReLU()
        self.dropout2 = nn.Dropout(dropout)
        self.lin2 = nn.Linear(hidden_dim, output_dim)

    def forward(self, x, edge_index, batch):
        x = self.encoder(x)
        x = self.gat1(x, edge_index)
        x = self.bn1(x)
        x = self.act1(x)
        x = self.dropout1(x)
        x = self.gat2(x, edge_index)
        x = self.bn2(x)
        x = self.act2(x)
        x = global_mean_pool(x, batch)
        x = self.lin1(x)
        x = self.relu(x)
        x = self.dropout2(x)
        x = self.lin2(x)
        return x
