from flask import Flask, request, jsonify
from flask_cors import CORS
from glycowork.motif.processing import canonicalize_iupac, IUPAC_to_SMILES
from glypy.io import iupac, glycoct, wurcs

app = Flask(__name__)
CORS(app)

# glypy loaders/dumpers (non-IUPAC input)
LOADERS = {
    'glycoct': glycoct.loads,
    'wurcs': wurcs.loads
}

DUMPERS = {
    'glycoct': glycoct.dumps,
    'iupac': iupac.dumps,
    'wurcs': wurcs.dumps
}

@app.route('/convert', methods=['POST'])
def convert():
    data = request.json or {}
    glycan_seq = data.get('glycan', '').strip()
    input_format = data.get('input_format', '').lower()

    if not glycan_seq:
        return jsonify({'error': 'Glycan sequence is empty.'}), 400

    try:
        if input_format == 'iupac':
            # Use glycowork for IUPAC input
            canonical = canonicalize_iupac(glycan_seq)
            smiles_list = IUPAC_to_SMILES([canonical])
            return jsonify({
                'input_format': 'iupac',
                'canonical_iupac': canonical,
                'smiles': smiles_list[0]
            })

        elif input_format in LOADERS:
            # Use glypy for glycoct/wurcs input
            structure = LOADERS[input_format](glycan_seq)
            converted = {
                fmt: DUMPERS[fmt](structure) for fmt in DUMPERS
            }
            return jsonify({
                'input_format': input_format,
                'converted_formats': converted
            })

        else:
            return jsonify({'error': f'Unsupported input format: {input_format}'}), 400

    except Exception as e:
        return jsonify({'error': f'Conversion failed: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
