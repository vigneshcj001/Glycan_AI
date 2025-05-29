from flask import Blueprint, request, jsonify # Removed Flask here, not needed if app is separate
import requests
import urllib.parse
import logging # Import the standard logging module

pathway_api = Blueprint('pathway_api', __name__)

# Configure logging for this module/blueprint
# This will use the root logger or a logger specific to this module's name
# if you want more granular control.
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(module)s - %(message)s')
logger = logging.getLogger(__name__) # Get a logger specific to this module

# KEGG API Endpoints
KEGG_FIND_PATHWAY_URL = "http://rest.kegg.jp/find/pathway/{query}"
KEGG_REST_IMAGE_URL_PATTERN = "https://rest.kegg.jp/get/{kegg_id}/image"
KEGG_DIRECT_IMAGE_URL_PATTERN = "https://www.kegg.jp/kegg/pathway/{pathway_id_part}/{pathway_id_full}.png"


@pathway_api.route("/pathway")
def get_pathway_image_url():
    kegg_id_req = request.args.get("kegg_id")
    logger.info(f"Received /pathway request: kegg_id='{kegg_id_req}'") # logger is now from logging module

    if not kegg_id_req:
        logger.warning("Missing KEGG Pathway ID in request.")
        return jsonify({"error": "Missing KEGG Pathway ID"}), 400

    plain_img_url_to_try = KEGG_REST_IMAGE_URL_PATTERN.format(kegg_id=kegg_id_req)
    logger.info(f"Attempting plain image via KEGG REST API: {plain_img_url_to_try}")

    try:
        response = requests.get(plain_img_url_to_try, stream=True, timeout=15, allow_redirects=True)
        final_url = response.url
        content_type = response.headers.get('Content-Type', '').lower()

        logger.info(f"KEGG REST API image response: Status {response.status_code}, Content-Type '{content_type}', Final URL '{final_url}'")

        if response.status_code == 200 and 'image' in content_type:
            logger.info(f"Successfully identified plain image for '{kegg_id_req}' via REST API.")
            return jsonify({
                "img_url": final_url,
                "kegg_id_used": kegg_id_req,
            })
        else:
            logger.warning(f"KEGG REST API did not return a valid image for '{kegg_id_req}'. Status: {response.status_code}, Content-Type: {content_type}. Will try direct PNG link.")
    except requests.exceptions.Timeout:
        logger.error(f"Timeout requesting KEGG pathway via REST API for '{kegg_id_req}'. URL: {plain_img_url_to_try}")
    except requests.exceptions.RequestException as e:
        logger.error(f"RequestException for KEGG pathway via REST API '{kegg_id_req}': {e}. URL: {plain_img_url_to_try}")

    logger.info(f"Falling back to direct PNG link construction for '{kegg_id_req}'.")
    pathway_id_part = ""
    pathway_id_full = kegg_id_req

    if len(kegg_id_req) >= 3 and not kegg_id_req[:3].isdigit() and kegg_id_req[3:].isdigit():
        pathway_id_part = kegg_id_req[:3].lower()
    elif kegg_id_req.lower().startswith("map") and kegg_id_req[3:].isdigit():
        pathway_id_part = "map"
    elif kegg_id_req.isdigit() and len(kegg_id_req) == 5:
        pathway_id_part = "map"
        pathway_id_full = f"map{kegg_id_req}"
    else:
        logger.error(f"Cannot determine pathway prefix for direct PNG link for '{kegg_id_req}' after REST API attempt also failed.")
        return jsonify({"error": f"Could not find pathway image for '{kegg_id_req}'. Please check the ID format (e.g., map00010, hsa00010)."}), 404

    direct_img_url_to_try = KEGG_DIRECT_IMAGE_URL_PATTERN.format(pathway_id_part=pathway_id_part, pathway_id_full=pathway_id_full)
    logger.info(f"Attempting plain image via direct PNG link: {direct_img_url_to_try}")

    try:
        response = requests.head(direct_img_url_to_try, timeout=10)
        content_type = response.headers.get('Content-Type', '').lower()
        logger.info(f"Direct PNG HEAD response: Status {response.status_code}, Content-Type '{content_type}' for URL {direct_img_url_to_try}")

        if response.status_code == 200 and 'image' in content_type:
            logger.info(f"Successfully identified plain image for '{pathway_id_full}' via direct link.")
            return jsonify({
                "img_url": direct_img_url_to_try,
                "kegg_id_used": pathway_id_full,
            })
        else:
            error_detail = f"KEGG pathway image not found or invalid for ID '{kegg_id_req}'. Tried direct link: {direct_img_url_to_try}. Status: {response.status_code}, Content-Type: {content_type}."
            logger.warning(error_detail)
            return jsonify({"error": error_detail}), 404
    except requests.exceptions.Timeout:
        logger.error(f"Timeout requesting plain KEGG pathway (direct link) for '{kegg_id_req}'. URL: {direct_img_url_to_try}")
        return jsonify({"error": "Request to KEGG server for pathway image timed out (direct link attempt)"}), 504
    except requests.exceptions.RequestException as e:
        logger.error(f"RequestException for plain KEGG pathway (direct link) '{kegg_id_req}': {e}. URL: {direct_img_url_to_try}")
        return jsonify({"error": f"Error fetching pathway image from KEGG (direct link attempt): {str(e)}"}), 502
    except Exception as e:
        logger.error(f"An unexpected server error occurred while fetching plain image for '{kegg_id_req}': {str(e)}", exc_info=True)
        return jsonify({"error": f"An unexpected server error occurred: {str(e)}"}), 500


@pathway_api.route("/search_pathways")
def search_pathways():
    query = request.args.get("query")
    logger.info(f"Received /search_pathways request: query='{query}'") # logger is now from logging module
    if not query or len(query) < 3:
        logger.warning("Search query too short.")
        return jsonify({"error": "Query must be at least 3 characters long"}), 400

    try:
        search_url = KEGG_FIND_PATHWAY_URL.format(query=urllib.parse.quote(query))
        logger.info(f"Searching KEGG: {search_url}")
        response = requests.get(search_url, timeout=10)
        response.raise_for_status()

        pathways = []
        if response.text:
            lines = response.text.strip().split('\n')
            for line in lines:
                if not line.strip(): continue
                parts = line.split('\t')
                if len(parts) == 2:
                    path_id_full, name = parts
                    path_id = path_id_full.split(':')[1] if ':' in path_id_full else path_id_full
                    pathways.append({"id": path_id, "name": name})

        logger.info(f"Found {len(pathways)} pathways for query '{query}'.")
        return jsonify(pathways)

    except requests.exceptions.Timeout:
        logger.error(f"KEGG API search timed out for query '{query}'.")
        return jsonify({"error": "KEGG API request timed out"}), 504
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
             logger.info(f"No pathways found for query '{query}'.")
             return jsonify([])
        logger.error(f"KEGG API search HTTPError for query '{query}': {e.response.status_code} - {e.response.text}")
        return jsonify({"error": f"KEGG API error: {e.response.status_code}"}), e.response.status_code
    except requests.exceptions.RequestException as e:
        logger.error(f"Could not connect to KEGG API for search: {str(e)}")
        return jsonify({"error": f"Could not connect to KEGG API: {str(e)}"}), 502
    except Exception as e:
        logger.error(f"Unexpected error in pathway search: {str(e)}", exc_info=True)
        return jsonify({"error": f"An unexpected server error occurred: {str(e)}"}), 500