from flask import Blueprint, request, jsonify
from glycowork.network.biosynthesis import construct_network

network_api = Blueprint('network_api', __name__)

@network_api.route("/api/network", methods=["POST"])
def generate_network():
    data = request.get_json()
    glycans = data.get("glycans", [])

    try:
        network = construct_network(
            glycans=glycans,
            allowed_ptms={'4Ac', '1P', 'OAc', '6S', '3P', 'OS', '6P', '3S'},
            edge_type='monolink',
            permitted_roots={'Gal(b1-4)GlcNAc-ol', 'Gal(b1-4)Glc-ol'}
        )

        cy_elements = [{"data": {"id": node}} for node in network.nodes]
        cy_elements += [
            {"data": {"source": source, "target": target}}
            for source, target in network.edges
        ]

        return jsonify({"elements": cy_elements})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
