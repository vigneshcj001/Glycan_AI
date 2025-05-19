from flask import Flask, request, jsonify
from flask_cors import CORS
from glycowork.motif.processing import canonicalize_iupac, IUPAC_to_SMILES
from glypy.io import iupac, glycoct, wurcs

app = Flask(__name__)
CORS(app)

# Loaders support only GlycoCT and WURCS as input for glypy
LOADERS = {
    'glycoct': glycoct.loads,
    'wurcs': wurcs.loads,
    'iupac': None  # special handling for IUPAC input
}

# Dumpers for all output formats
DUMPERS = {
    'glycoct': glycoct.dumps,
    'iupac': iupac.dumps,
    'wurcs': wurcs.dumps
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
            # For IUPAC input:
            canonical = canonicalize_iupac(glycan_seq)
            smiles_list = IUPAC_to_SMILES([canonical])
            smiles_str = smiles_list[0]

            # We don't have glypy structure here to convert to GlycoCT/WURCS,
            # so fallback those as unsupported for IUPAC input.
            return jsonify({
                'iupac': canonical,
                'smiles': smiles_str,
                'glycoct': 'Conversion from IUPAC to GlycoCT not supported.',
                'wurcs': 'Conversion from IUPAC to WURCS not supported.'
            })

        elif input_fmt in LOADERS and LOADERS[input_fmt]:
            # For GlycoCT or WURCS input:
            structure = LOADERS[input_fmt](glycan_seq)

            iupac_str = iupac.dumps(structure)
            glycoct_str = glycoct.dumps(structure)
            wurcs_str = wurcs.dumps(structure)

            # Try to get SMILES via IUPAC + glycowork
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
