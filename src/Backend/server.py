import pandas as pd
import numpy as np
import re
from Bio.Align import PairwiseAligner
from Bio.Align.substitution_matrices import Array
from sklearn.preprocessing import LabelEncoder
from difflib import get_close_matches
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import flask-cors for CORS support

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load glycan substitution matrix
print("\n🔹 Loading glycan substitution matrix...")
df = pd.read_excel("GLYSUM.xlsx", index_col=0)  # Ensure GLYSUM.xlsx is in the same directory
substitution_scores = df.to_numpy()
glycan_names = tuple(df.index.tolist())
substitution_matrix = Array(glycan_names, data=substitution_scores)
print("✅ The substitution matrix has been successfully loaded!\n")

# Initialize PairwiseAligner with the glycan substitution matrix
aligner = PairwiseAligner()
aligner.substitution_matrix = substitution_matrix
aligner.open_gap_score = -10
aligner.extend_gap_score = -0.5

# Encoding glycans into numerical labels
encoder = LabelEncoder()
encoded_labels = encoder.fit_transform(list(glycan_names))
glycan_to_code = dict(zip(glycan_names, encoded_labels))
code_to_glycan = {v: k for k, v in glycan_to_code.items()}

# Assign unique codes for linkages
linkage_codes = {}
linkage_counter = 999

def find_closest_glycan(word):
    """Finds the closest glycan name using exact or fuzzy matching."""
    if word in glycan_names:
        return word
    matches = get_close_matches(word, glycan_names, n=1, cutoff=0.85)
    return matches[0] if matches else None

def parse_glycan_sequence(seq_str):
    """Extracts glycans and linkages while converting α to 'a' and β to 'b'."""
    global linkage_counter
    glycan_list = []
    pattern = r"([A-Za-z]+)(\([^\)]+\))?"
    matches = re.findall(pattern, seq_str)

    for glycan, linkage in matches:
        matched_glycan = find_closest_glycan(glycan)
        if matched_glycan:
            glycan_list.append(matched_glycan)
        else:
            print(f"⚠ Warning: Glycan '{glycan}' not found in dataset.")

        if linkage:
            linkage_clean = linkage.strip("()").replace("α", "a").replace("β", "b")
            if linkage_clean not in linkage_codes:
                linkage_codes[linkage_clean] = linkage_counter
                linkage_counter += 1
            glycan_list.append(linkage_clean)

    return glycan_list

@app.route('/align', methods=['POST'])
def align_glycans():
    try:
        data = request.get_json()
        seq_str1 = data.get("sequence1", "")
        seq_str2 = data.get("sequence2", "")

        # Parse sequences
        seq1 = parse_glycan_sequence(seq_str1)
        seq2 = parse_glycan_sequence(seq_str2)

        if seq1 and seq2:
            alignments = aligner.align(seq1, seq2)
            best_score = alignments.score

            for alignment in alignments:
                seq1_translated = alignment.sequences[0]
                seq2_translated = alignment.sequences[1]

                # Generate match line with correct spacing
                match_line = ""
                seq1_display = ""
                seq2_display = ""

                for a, b in zip(seq1_translated, seq2_translated):
                    max_length = max(len(a), len(b))
                    seq1_display += a.ljust(max_length + 2)
                    seq2_display += b.ljust(max_length + 2)
                    match_line += ("|" if a == b else "_").ljust(max_length + 2)

                # Return alignment result
                alignment_result = {
                    "seq1": seq1_display,
                    "match_line": match_line,
                    "seq2": seq2_display,
                    "score": best_score
                }

                return jsonify({
                    "alignment": alignment_result
                })

        else:
            return jsonify({"error": "Invalid glycan sequences"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
