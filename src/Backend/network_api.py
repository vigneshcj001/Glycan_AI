from flask import Flask, Blueprint, request, jsonify
from flask_cors import CORS  # Import CORS
from glycowork.network.biosynthesis import construct_network
from glycowork.glycan_data.loader import lib
import traceback # For detailed error logging

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes, adjust for production if needed

# --- Blueprint for API routes ---
network_api = Blueprint('network_api', __name__, url_prefix='/api') # Added url_prefix

# Get all unique PTMs from the library for frontend options
# This might be extensive, so you might want to curate a smaller default list for performance
# or provide a more targeted list relevant to common biosynthetic pathways.
try:
    ALL_AVAILABLE_PTMS = sorted(list(set(lib.ptm_dict.keys()))) # Ensure uniqueness and sort
except AttributeError: # Fallback if lib.ptm_dict is not as expected
    print("Warning: lib.ptm_dict not found or structured as expected. Using empty PTM list.")
    ALL_AVAILABLE_PTMS = []
    
DEFAULT_PTMS = {'4Ac', '1P', 'OAc', '6S', '3P', 'OS', '6P', '3S'}
DEFAULT_ROOTS = ['Gal(b1-4)GlcNAc-ol', 'Gal(b1-4)Glc-ol']
AVAILABLE_EDGE_TYPES = ['monolink', 'full_reaction', 'enzyme'] # Common glycowork options

@network_api.route("/network-parameters", methods=["GET"])
def get_network_parameters():
    """Returns available parameters for network construction."""
    return jsonify({
        "available_ptms": ALL_AVAILABLE_PTMS,
        "default_ptms": list(DEFAULT_PTMS),
        "default_roots": DEFAULT_ROOTS,
        "available_edge_types": AVAILABLE_EDGE_TYPES
    })

@network_api.route("/network", methods=["POST"])
def generate_network_enhanced():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
        
    data = request.get_json()
    glycans_input = data.get("glycans", [])
    
    allowed_ptms_req = data.get("allowed_ptms")
    permitted_roots_req = data.get("permitted_roots")
    edge_type_req = data.get("edge_type")

    # Validate and set allowed_ptms
    if allowed_ptms_req is None or not isinstance(allowed_ptms_req, list):
        allowed_ptms = DEFAULT_PTMS
    else:
        # Filter against all available PTMs to prevent arbitrary input if desired, though glycowork might handle invalid ones.
        allowed_ptms = set(ptm for ptm in allowed_ptms_req if ptm in ALL_AVAILABLE_PTMS or ptm in DEFAULT_PTMS) # Or be more strict
        if not allowed_ptms and allowed_ptms_req: # If user provided some PTMs but none were valid
             allowed_ptms = set() # Allow empty PTM set if user explicitly sends empty or invalid ones

    # Validate and set permitted_roots
    if permitted_roots_req is None or not isinstance(permitted_roots_req, list) or not permitted_roots_req:
        # If user sends an empty list, or it's not provided, use defaults.
        permitted_roots = set(DEFAULT_ROOTS)
    else:
        # Filter for non-empty strings
        permitted_roots = set(p for p in permitted_roots_req if isinstance(p, str) and p.strip())
        if not permitted_roots: # If after filtering, the list is empty (e.g., user sent list of empty strings)
            # Decide behavior: error out, or use defaults. For now, let's use defaults.
            # This means if the user explicitly wants NO roots, they can't easily achieve it with this logic.
            # To allow NO roots, you'd let permitted_roots be an empty set here.
            # However, glycowork's construct_network might require roots.
            permitted_roots = set(DEFAULT_ROOTS) 
            # Alternative: return jsonify({"error": "Permitted roots cannot be an empty list of valid strings."}), 400


    # Validate and set edge_type
    if edge_type_req is None or edge_type_req not in AVAILABLE_EDGE_TYPES:
        edge_type = 'monolink' # Default to monolink if invalid or not provided
    else:
        edge_type = edge_type_req

    if not glycans_input or not isinstance(glycans_input, list) or not all(isinstance(g, str) for g in glycans_input):
        return jsonify({"error": "Glycans must be a non-empty list of strings."}), 400
    
    # Filter empty strings from glycans_input
    glycans_input_filtered = [g.strip() for g in glycans_input if g.strip()]
    if not glycans_input_filtered:
        return jsonify({"error": "No valid glycan strings provided after filtering."}), 400

    # Crucial check: construct_network requires permitted_roots. If it became empty, handle it.
    # The logic above tries to ensure it defaults, but as a safeguard:
    if not permitted_roots:
        # This case implies the user might have tried to send an empty permitted_roots list,
        # and your logic above didn't default it.
        # For glycowork, it's often better to have default roots than none.
        print("Warning: Permitted roots became empty. Reverting to default roots.")
        permitted_roots = set(DEFAULT_ROOTS)


    try:
        print(f"Constructing network with: glycans={len(glycans_input_filtered)}, ptms={allowed_ptms}, roots={permitted_roots}, edge_type='{edge_type}'")
        network = construct_network(
            glycans=glycans_input_filtered,
            allowed_ptms=allowed_ptms, # Must be a set or list
            edge_type=edge_type,
            permitted_roots=list(permitted_roots) # construct_network might prefer a list
        )

        cy_elements = []
        input_glycan_set = set(glycans_input_filtered) # Use filtered list for input check

        for node_id in network.nodes(): # network.nodes is a NodeView, iterate directly
            node_data = {
                "id": node_id, 
                "is_input": node_id in input_glycan_set, 
                "is_root": node_id in permitted_roots
            }
            # Example: Add a special property if it's a specific known glycan
            if node_id == "Gal(b1-4)Glc-ol": # Your magic icon glycan
                node_data["special_type"] = "lactose_derivative"
            cy_elements.append({"data": node_data})
            
        for source, target, data in network.edges(data=True): # Get edge data if needed
            edge_data = {"source": source, "target": target}
            # if edge_type is 'enzyme' or 'full_reaction', 'data' might contain useful info
            # e.g., if 'enzyme_label' in data: edge_data['label'] = data['enzyme_label']
            cy_elements.append({"data": edge_data})
            
        # Add metadata about the network generation
        metadata = {
            "num_nodes": network.number_of_nodes(),
            "num_edges": network.number_of_edges(),
            "params_used": {
                "allowed_ptms": sorted(list(allowed_ptms)), # Sort for consistent output
                "permitted_roots": sorted(list(permitted_roots)), # Sort
                "edge_type": edge_type,
                "input_glycans_count": len(glycans_input_filtered)
            }
        }

        return jsonify({"elements": cy_elements, "metadata": metadata})

    except ValueError as ve:
        error_message = f"Invalid input for network construction: {str(ve)}"
        print(f"ValueError: {error_message}")
        traceback.print_exc()
        return jsonify({"error": error_message}), 400
    except Exception as e:
        # Log the full exception for debugging
        error_message = f"An internal error occurred during network generation."
        print(f"Error generating network: {e}") 
        traceback.print_exc()
        return jsonify({"error": error_message}), 500

# Register blueprint
app.register_blueprint(network_api)

