from flask import Blueprint, request, send_file
import pandas as pd
import copy
from glycowork.glycan_data.loader import df_species

species_api = Blueprint('species_api', __name__)
species_df = pd.DataFrame(copy.deepcopy(df_species))
species_df.to_csv("species_data.csv", index=False)

@species_api.route("/api/download", methods=["GET"])
def download_species_data():
    species_name = request.args.get('species', '').strip()
    if species_name:
        filtered_df = species_df[species_df['Species'].str.contains(species_name, case=False, na=False)]
        filtered_file_path = f"filtered_{species_name.replace(' ', '_')}.csv"
        filtered_df.to_csv(filtered_file_path, index=False)
        return send_file(filtered_file_path, mimetype="text/csv", as_attachment=True, download_name=f"{species_name.replace(' ', '_')}_data.csv")
    return "Species name is required", 400
