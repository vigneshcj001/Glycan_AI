from flask import Blueprint, request, jsonify
from glycowork.motif.processing import canonicalize_iupac, IUPAC_to_SMILES
from rdkit import Chem
from rdkit.Chem import Descriptors

descriptor_api = Blueprint('descriptor_api', __name__)

def calculate_descriptors(smiles):
    mol = Chem.MolFromSmiles(smiles)
    if not mol:
        return {"error": "Invalid SMILES"}

    return {
        "SMILES": smiles,
        "Molecular Weight": Descriptors.MolWt(mol),
        "Exact Molecular Weight": Descriptors.ExactMolWt(mol),
        "Heavy Atom Count": Descriptors.HeavyAtomCount(mol),
        "Heavy Atom Mol Weight": Descriptors.HeavyAtomMolWt(mol),
        "Num Valence Electrons": Descriptors.NumValenceElectrons(mol),
        "Num Rotatable Bonds": Descriptors.NumRotatableBonds(mol),
        "H-Bond Acceptors": Descriptors.NumHAcceptors(mol),
        "H-Bond Donors": Descriptors.NumHDonors(mol),
        "TPSA": Descriptors.TPSA(mol),
        "LogP": Descriptors.MolLogP(mol),
        "Fraction Csp3": Descriptors.FractionCSP3(mol),
        "Ring Count": Descriptors.RingCount(mol),
        "Aromatic Rings": Descriptors.NumAromaticRings(mol),
        "Aliphatic Rings": Descriptors.NumAliphaticRings(mol),
        "Saturated Rings": Descriptors.NumSaturatedRings(mol),
        "Num Heteroatoms": Descriptors.NumHeteroatoms(mol),
        "NHOH Count": Descriptors.NHOHCount(mol),
        "NO Count": Descriptors.NOCount(mol),
        "Molar Refractivity": Descriptors.MolMR(mol)
    }

@descriptor_api.route("/api/descriptor", methods=["POST"])
def analyze():
    data = request.get_json()
    fmt = data.get("format")
    content = data.get("data")

    if fmt != "IUPAC":
        return jsonify({"error": "Only IUPAC format supported"}), 400

    iupac = content.strip()
    if not iupac:
        return jsonify({"error": "Empty IUPAC input"}), 400

    try:
        canonical_iupac = canonicalize_iupac(iupac)
        smiles_list = IUPAC_to_SMILES([canonical_iupac])
        if not smiles_list or len(smiles_list) == 0:
            return jsonify({"error": "Conversion returned empty list"}), 400
        smiles = smiles_list[0]
    except Exception as e:
        return jsonify({"error": f"Failed to convert IUPAC to SMILES: {str(e)}"}), 400

    descriptors = calculate_descriptors(smiles)
    if "error" in descriptors:
        return jsonify({"error": descriptors["error"]}), 400

    return jsonify({
        "IUPAC": canonical_iupac,
        **descriptors
    })
