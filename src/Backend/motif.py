from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import base64
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from glycowork.motif.draw import GlycoDraw

app = Flask(__name__)
CORS(app)  # 👈 Important for allowing frontend to access backend

@app.route('/draw_glycan', methods=['POST'])
def draw_glycan():
    data = request.get_json()
    glycan = data.get('glycan', '')
    motif = data.get('highlight_motif', None)  # fix here to match frontend key

    try:
        GlycoDraw(draw_this=glycan, highlight_motif=motif)
        fig = plt.gcf()
        buf = io.BytesIO()
        fig.savefig(buf, format='png', bbox_inches='tight')
        plt.close(fig)

        buf.seek(0)
        encoded_img = "data:image/png;base64," + base64.b64encode(buf.read()).decode('utf-8')
        return jsonify({'image': encoded_img})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
