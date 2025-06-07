from flask import Blueprint, request, jsonify
from glycowork.motif.query import get_insight, glytoucan_to_glycan
import io
import sys
import traceback

insight_api = Blueprint('insight_api', __name__)

@insight_api.route('/api/glycan_insight', methods=['POST', 'OPTIONS'])
def glycan_insight():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200
    user_input = request.json.get('userInput')
    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    glycan_sequence = ""
    user_input = user_input.strip()

    try:
        if user_input.startswith('G') and '(' not in user_input:
            print(f"Detected GlyTouCan ID: {user_input}. Converting to sequence...")
            result_list = glytoucan_to_glycan([user_input])
            if result_list and result_list[0]:
                glycan_sequence = result_list[0]
            else:
                return jsonify({"error": f"Could not find a glycan sequence for ID: {user_input}"}), 404
        else:
            glycan_sequence = user_input
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": f"Failed during input processing. Details: {str(e)}"}), 500

    original_stdout = sys.stdout
    buffer = io.StringIO()
    sys.stdout = buffer

    try:
        get_insight(glycan_sequence)
    except Exception as e:
        sys.stdout = original_stdout 
        print(traceback.format_exc())
        return jsonify({"error": f"An error occurred within the glycowork library. The sequence may be invalid. Details: {str(e)}"}), 500
    finally:
        sys.stdout = original_stdout

    output = buffer.getvalue()
    data = {
        "original_input": user_input,
        "analyzed_glycan_sequence": glycan_sequence,
        "species": [],
        "phyla": [],
        "motifs": [],
        "glytoucan_id": "Not Found",
        "cell_lines": [],
        "diseases": []
    }

    for line in output.splitlines():
        try:
            if "This glycan occurs in the following species:" in line:
                data["species"] = eval(line.split(":", 1)[1].strip())
            elif "Here are the phyla" in line:
                data["phyla"] = eval(line.split(":", 1)[1].strip())
            elif "This glycan contains the following motifs:" in line:
                data["motifs"] = eval(line.split(":", 1)[1].strip())
            elif "This is the GlyTouCan ID for this glycan:" in line:
                data["glytoucan_id"] = line.split(":")[-1].strip()
            elif "This glycan has been reported to be expressed in:" in line:
                data["cell_lines"] = eval(line.split(":", 1)[1].strip())
            elif "This glycan has been reported to be dysregulated in" in line:
                disease_data = eval(line.split(":", 1)[1].strip())
                data["diseases"] = [entry for entry in disease_data if any(entry)]
        except (SyntaxError, IndexError):
            # If any line fails to parse, just skip it and continue
            continue
            
    return jsonify(data)