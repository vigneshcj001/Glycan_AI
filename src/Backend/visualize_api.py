from flask import Blueprint, request, jsonify
from glycowork.motif.processing import canonicalize_iupac, IUPAC_to_SMILES
from rdkit import Chem
from rdkit.Chem import AllChem


visualize_api = Blueprint('visualize_api', __name__)

@visualize_api.route("/visualize", methods=["POST"])
def convert_glycan():
    data = request.get_json()
    iupac_seq = data.get("iupac")
    
    if not iupac_seq:
        return jsonify({"error": "Missing glycan sequence"}), 400

    try:
        canonical_seq = canonicalize_iupac(iupac_seq.strip())
        smiles = IUPAC_to_SMILES([canonical_seq])[0]

        if not smiles:
            return jsonify({"error": "Failed to convert to SMILES"}), 400

        mol = Chem.MolFromSmiles(smiles)
        mol = Chem.AddHs(mol)

        if AllChem.EmbedMolecule(mol, randomSeed=0xf00d) != 0:
            return jsonify({"error": "3D embedding failed"}), 500

        AllChem.MMFFOptimizeMolecule(mol)
        mol_block = Chem.MolToMolBlock(mol)

        return jsonify({"molBlock": mol_block})

    except Exception as e:
        return jsonify({"error": str(e)}), 500