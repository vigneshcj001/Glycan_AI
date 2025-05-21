from flask import Blueprint, request, jsonify
import networkx as nx

network_api = Blueprint('network_api', __name__)

def generate_biosynthetic_network(glycans):
    G = nx.DiGraph()
    for i, glycan in enumerate(glycans):
        G.add_node(glycan)
        if i > 0:
            G.add_edge(glycans[i - 1], glycan)
    return G

@network_api.route("/api/network", methods=["POST"])
def biosynthetic_network():
    data = request.get_json()
    if not data or "glycans" not in data:
        return jsonify({"error": "Invalid input"}), 400

    glycans = data["glycans"]
    graph = generate_biosynthetic_network(glycans)

    elements = [{"data": {"id": node}} for node in graph.nodes()]
    elements += [{"data": {"source": src, "target": tgt}} for src, tgt in graph.edges()]
    return jsonify({"elements": elements})
