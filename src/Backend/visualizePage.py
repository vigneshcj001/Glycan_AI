from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

PDB_SEARCH_URL = "https://search.rcsb.org/rcsbsearch/v2/query"

@app.route('/search_glycan', methods=['GET'])
def search_glycan():
    glycan = request.args.get('glycan')
    if not glycan:
        return jsonify({'error': 'No glycan provided'}), 400

    query = {
        "query": {
            "type": "terminal",
            "service": "text",
            "parameters": {
                "value": glycan
            }
        },
        "return_type": "entry",
        "request_options": {
            "return_all_hits": True
        }
    }

    response = requests.post(PDB_SEARCH_URL, json=query)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch from PDB API'}), 500

    result = response.json()
    pdb_ids = [item["identifier"] for item in result.get("result_set", [])]
    return jsonify({'matches': pdb_ids})

if __name__ == "__main__":
    # Run on all interfaces, port 5000
    app.run(host="0.0.0.0", port=5000, debug=True)
