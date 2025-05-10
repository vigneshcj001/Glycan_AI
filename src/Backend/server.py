import pandas as pd
import re
from Bio.Align import PairwiseAligner
from Bio.Align.substitution_matrices import Array
from flask import Flask, request, jsonify
from flask_cors import CORS
from difflib import get_close_matches

app = Flask(__name__)
CORS(app)

# Load glycan substitution matrix
try:
    print("\n🔹 Loading glycan substitution matrix...")
    # Assumes GLYSUM.xlsx is in the same folder as this script.
    df = pd.read_excel("GLYSUM.xlsx", index_col=0)
    substitution_scores = df.to_numpy()
    glycan_names = tuple(df.index.tolist())
    substitution_matrix = Array(glycan_names, data=substitution_scores)
    print("✅ The substitution matrix has been successfully loaded!\n")
except Exception as e:
    print("❌ Error loading GLYSUM.xlsx:", e)
    exit(1)

# Initialize aligner with the loaded substitution matrix
aligner = PairwiseAligner()
aligner.substitution_matrix = substitution_matrix
aligner.open_gap_score = -10
aligner.extend_gap_score = -0.5

linkage_codes = {}
linkage_counter = 999

def find_closest_glycan(word):
    """Find the closest match for a glycan name."""
    if word in glycan_names:
        return word
    matches = get_close_matches(word, glycan_names, n=1, cutoff=0.85)
    return matches[0] if matches else None

def parse_glycan_sequence(seq_str):
    """
    Parse the glycan sequence into a list of glycans and linkages.
    Linkages are cleaned (α → a, β → b) and assigned codes.
    """
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
                linkage_codes[linkage_clean] = f"link{linkage_counter}"
                linkage_counter += 1
            glycan_list.append(linkage_clean)

    return glycan_list

@app.route("/align", methods=["POST"])
def align_glycans():
    try:
        data = request.get_json()
        seq_str1 = data.get("sequence1", "")
        seq_str2 = data.get("sequence2", "")

        seq1 = parse_glycan_sequence(seq_str1)
        seq2 = parse_glycan_sequence(seq_str2)

        if not seq1 or not seq2:
            return jsonify({"error": "Invalid glycan sequences"}), 400

        alignments = aligner.align(seq1, seq2)
        best_alignment = alignments[0]
        best_score = alignments.score

        seq1_display = ""
        seq2_display = ""
        match_line = ""

        # Construct the alignment output with a match line
        for a, b in zip(best_alignment.sequences[0], best_alignment.sequences[1]):
            max_len = max(len(a), len(b))
            seq1_display += a.ljust(max_len + 2)
            seq2_display += b.ljust(max_len + 2)
            match_line += ("|" if a == b else " ").ljust(max_len + 2)

        result = {
            "seq1": seq1_display,
            "match_line": match_line,
            "seq2": seq2_display,
            "score": best_score
        }
        return jsonify({"alignment": result})

    except Exception as e:
        print(f"❌ Error during alignment: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Listen on all interfaces and on port 5000
    app.run(host="0.0.0.0", port=5000, debug=True)
