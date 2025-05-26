from flask import Blueprint, request, jsonify
from glycowork.motif.processing import canonicalize_iupac, IUPAC_to_SMILES
from glypy.io import iupac, glycoct, wurcs
import logging  # Import logging to fix the error

# Initialize Blueprint
convert_api = Blueprint('convert_api', __name__)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Loaders and dumpers for different formats
LOADERS = {'glycoct': glycoct.loads, 'wurcs': wurcs.loads, 'iupac': None}
DUMPERS = {'glycoct': glycoct.dumps, 'wurcs': wurcs.dumps, 'iupac': iupac.dumps}

@convert_api.route('/convert', methods=['POST'])
def convert():
    data = request.json or {}
    glycan_seq = data.get('glycan', '').strip()
    input_fmt = data.get('input_format', '').lower()

    if not glycan_seq:
        return jsonify({'error': 'Glycan sequence is empty.'}), 400

    try:
        if input_fmt == 'iupac':
            # Convert IUPAC to canonical form and SMILES
            canonical = canonicalize_iupac(glycan_seq)
            smiles_list = IUPAC_to_SMILES([canonical])
            return jsonify({
                'iupac': canonical,
                'smiles': smiles_list[0],
                'glycoct': 'Conversion from IUPAC to GlycoCT not supported.',
                'wurcs': 'Conversion from IUPAC to WURCS not supported.'
            })

        elif input_fmt in ['glycoct', 'wurcs']:
            # Convert GlycoCT or WURCS to IUPAC, GlycoCT, WURCS, SMILES
            structure = LOADERS[input_fmt](glycan_seq)
            iupac_str = iupac.dumps(structure)
            glycoct_str = glycoct.dumps(structure)
            wurcs_str = wurcs.dumps(structure)
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
        logging.exception("Conversion error:")
        return jsonify({'error': f'Conversion failed: {str(e)}'}), 500
