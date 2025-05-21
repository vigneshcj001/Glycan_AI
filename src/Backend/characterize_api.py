from flask import Blueprint, request, jsonify
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import io
import base64
from glycowork.motif.analysis import characterize_monosaccharide

characterize_api = Blueprint('characterize_api', __name__)

@characterize_api.route('/api/characterize', methods=['POST'])
def characterize():
    data = request.get_json()
    sugar = data.get('sugar')
    rank = data.get('rank')
    focus = data.get('focus')
    modifications = data.get('modifications', False)
    thresh = int(data.get('thresh', 10))

    try:
        plt.figure(figsize=(10, 6))
        characterize_monosaccharide(sugar, rank=rank, focus=focus, modifications=modifications, thresh=thresh)
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        image_base64 = base64.b64encode(buf.read()).decode('utf-8')
        plt.close()
        return jsonify({'image': image_base64})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

