from flask import Flask
from flask_cors import CORS

# Import all your Blueprints
from species_api import species_api
from network_api import network_api
from characterize_api import characterize_api
from convert_api import convert_api
from motif_api import motif_api
from draw_api import draw_api
from descriptor_api import descriptor_api
from seq_align_api import seq_align_api
app = Flask(__name__)
CORS(app)

# Register Blueprints
app.register_blueprint(species_api)
app.register_blueprint(network_api)
app.register_blueprint(characterize_api)
app.register_blueprint(convert_api)
app.register_blueprint(motif_api)
app.register_blueprint(draw_api)
app.register_blueprint(descriptor_api)
app.register_blueprint(seq_align_api)

if __name__ == "__main__":
    app.run(debug=True)