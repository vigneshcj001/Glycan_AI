from flask import Flask, request, jsonify
from flask_cors import CORS
from glycowork.motif.processing import canonicalize_iupac, IUPAC_to_SMILES
from glypy.io import iupac, glycoct, wurcs

app = Flask(__name__)
CORS(app)

LOADERS = {
    'glycoct': glycoct.loads,
    'wurcs': wurcs.loads,
    'iupac': None  # special handling
}

DUMPERS = {
    'glycoct': glycoct.dumps,
    'wurcs': wurcs.dumps,
    'iupac': iupac.dumps
}

@app.route('/convert', methods=['POST'])
def convert():
    data = request.json or {}
    glycan_seq = data.get('glycan', '').strip()
    input_fmt = data.get('input_format', '').lower()

    if not glycan_seq:
        return jsonify({'error': 'Glycan sequence is empty.'}), 400

    try:
        if input_fmt == 'iupac':
            # Canonicalize IUPAC and get SMILES
            canonical = canonicalize_iupac(glycan_seq)
            smiles_list = IUPAC_to_SMILES([canonical])
            smiles_str = smiles_list[0]

            return jsonify({
                'iupac': canonical,
                'smiles': smiles_str,
                'glycoct': 'Conversion from IUPAC to GlycoCT not supported.',
                'wurcs': 'Conversion from IUPAC to WURCS not supported.'
            })

        elif input_fmt in ['glycoct', 'wurcs']:
            # Load glycan structure
            structure = LOADERS[input_fmt](glycan_seq)

            # Dump to all formats
            iupac_str = iupac.dumps(structure)
            glycoct_str = glycoct.dumps(structure)
            wurcs_str = wurcs.dumps(structure)

            # Convert IUPAC to canonical + SMILES
            try:
                canonical_iupac = canonicalize_iupac(iupac_str)
                smiles_list = IUPAC_to_SMILES([canonical_iupac])
                smiles_str = smiles_list[0]
            except Exception as e:
                smiles_str = f'SMILES conversion failed: {str(e)}'

            return jsonify({
                'iupac': iupac_str,
                'glycoct': glycoct_str,
                'wurcs': wurcs_str,
                'smiles': smiles_str
            })

        else:
            return jsonify({'error': f'Unsupported input format: {input_fmt}'}), 400

    except Exception as e:
        return jsonify({'error': f'Conversion failed: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True)
