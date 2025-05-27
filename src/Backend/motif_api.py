from flask import Blueprint, request, jsonify
import pandas as pd
from collections import Counter
import random

motif_api = Blueprint('motif_api', __name__)

# Load monosaccharides list
df = pd.read_csv('monosaccharides_counts.csv')
all_sugars = df['Monosaccharide'].dropna().tolist()

all_bonds = ['a1-1', 'a1-2', 'a1-3', 'a1-4', 'a1-5', 'a1-6', 'a1-7', 'a1-8',
             'a2-1', 'a2-2', 'a2-3', 'a2-4', 'a2-5', 'a2-6', 'a2-7', 'a2-8', 'a2-9',
             'b1-1', 'b1-2', 'b1-3', 'b1-4', 'b1-5', 'b1-6', 'b1-7', 'b1-8', 'b1-9',
             'b2-1', 'b2-2', 'b2-3', 'b2-4', 'b2-5', 'b2-6', 'b2-7', 'b2-8']

def motif_find(s):
    b = [k.replace('[', '').replace(']', '') for k in sum([i.split(')') for i in s.split('(')], [])]
    return ['*'.join(b[i:i+5]) for i in range(0, len(b)-4, 2)]

def small_motif_find(s):
    b = [k.replace('[', '').replace(']', '') for k in sum([i.split(')') for i in s.split('(')], [])]
    return '*'.join(b)

def motif_find_mutate(s, mutate=True, n_mut=1, mode='normal'):
    b = [k.replace('[', '').replace(']', '') for k in sum([i.split(')') for i in s.split('(')], [])]
    if mutate:
        for _ in range(n_mut):
            idx = random.choice(range(len(b)))
            if idx % 2 == 0:
                b[idx] = random.choice(all_sugars)
            else:
                b[idx] = random.choice(all_bonds)
    b_label = '*'.join(b)
    b_motifs = ['*'.join(b[i:i+5]) for i in range(0, len(b)-4, 2)]
    return b_motifs, b_label

def process_mutated_glycans(glycan, n_mut=1, n=100, mode='normal'):
    wt, wt_label = motif_find_mutate(glycan, mutate=False)
    wt = [i.split('*') for i in wt]
    glycan_motifs, glycan_labels = zip(*[motif_find_mutate(glycan, n_mut=n_mut, mode=mode) for _ in range(n)])
    glycan_motifs = [[i.split('*') for i in k] for k in glycan_motifs]
    return [wt] + glycan_motifs, [wt_label] + list(glycan_labels)

@motif_api.route("/motif/mutate", methods=["POST"])
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
    return jsonify({
        "motif_frequencies": {"*".join(k): v for k, v in motif_freq.items()},
        "mutated_sequences": labels
    })

@motif_api.route("/motif/small", methods=["POST"])
def small_motif():
    data = request.get_json()
    sequence = data.get("sequence", "")
    return jsonify({"small_motif": small_motif_find(sequence)})

@motif_api.route("/motif/find", methods=["POST"])
def find_motif():
    data = request.get_json()
    sequence = data.get("sequence", "")
    return jsonify({"motifs": motif_find(sequence)})
