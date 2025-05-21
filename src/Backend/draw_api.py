# draw_api.py
from flask import Blueprint, request, jsonify
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import io
import base64
import warnings
from glycowork.motif.draw import GlycoDraw

# Suppress interactive backend warning
warnings.filterwarnings("ignore", message=".*FigureCanvasAgg is non-interactive.*")

draw_api = Blueprint('draw_api', __name__)

@draw_api.route('/api/draw', methods=['POST'])
def draw_glycan():
    data = request.get_json()
    glycan = data.get('glycan', '').strip()
    motif = data.get('highlight_motif', None)

    if not glycan:
        return jsonify({'error': 'No glycan sequence provided.'}), 400

    try:
        GlycoDraw(draw_this=glycan, highlight_motif=motif)
        fig = plt.gcf()
        buf = io.BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight')
        plt.close(fig)

        buf.seek(0)
        encoded_img = base64.b64encode(buf.read()).decode('utf-8')
        return jsonify({'image': encoded_img})
    except Exception as e:
        return jsonify({'error': f'Failed to draw glycan. Details: {str(e)}'}), 500
