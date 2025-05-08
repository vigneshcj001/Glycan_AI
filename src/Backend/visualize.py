from flask import Flask, request, jsonify, send_from_directory
import os
import uuid
from glycowork.motif.draw import GlycoDraw

# Initialize Flask app
app = Flask(__name__)

# Path to store generated glycan images
IMAGE_DIR = os.path.join(os.getcwd(), 'static', 'glycan_images')

# Make sure the glycan images directory exists
os.makedirs(IMAGE_DIR, exist_ok=True)

@app.route('/api/visualize', methods=['POST'])
def visualize_glycan():
    data = request.get_json()
    glycan_code = data.get('glycanCode', '')

    if not glycan_code:
        return jsonify({"error": "No glycan code provided"}), 400

    try:
        # Generate a unique filename for the image
        image_filename = f"{uuid.uuid4().hex}.svg"
        image_path = os.path.join(IMAGE_DIR, image_filename)

        # Create the glycan visualization using GlycoDraw
        glyco_draw = GlycoDraw(glycan_code, compact=True)
        glyco_draw.draw(image_path)  # You can set other options as needed

        # Return the URL of the image
        image_url = f"/static/glycan_images/{image_filename}"
        return jsonify({"imageUrl": image_url})

    except Exception as e:
        print(f"Error generating glycan visualization: {str(e)}")  # Debugging log
        return jsonify({"error": f"Error generating glycan visualization: {str(e)}"}), 500

@app.route('/static/glycan_images/<filename>')
def serve_image(filename):
    # Serve the generated glycan images
    return send_from_directory(IMAGE_DIR, filename)

if __name__ == '__main__':
    app.run(debug=True)
