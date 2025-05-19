from flask import Flask, request, jsonify
from flask_cors import CORS
import networkx as nx

app = Flask(__name__)
CORS(app)

# Simple biosynthetic graph generator (mock example)
def generate_biosynthetic_network(glycans):
    G = nx.DiGraph()
    for i, glycan in enumerate(glycans):
        G.add_node(glycan)
        if i > 0:
            G.add_edge(glycans[i - 1], glycan)
    return G

@app.route("/api/network", methods=["POST"])
def biosynthetic_network():
    data = request.get_json()
    if not data or "glycans" not in data:
        return jsonify({"error": "Invalid input"}), 400

    glycans = data["glycans"]
    graph = generate_biosynthetic_network(glycans)
    
    elements = []
    for node in graph.nodes():
        elements.append({"data": {"id": node}})
    for source, target in graph.edges():
        elements.append({"data": {"source": source, "target": target}})
    
    return jsonify({"elements": elements})

if __name__ == "__main__":
    app.run(debug=True)
