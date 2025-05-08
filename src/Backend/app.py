# Dataset downloader

from flask import Flask, send_file, request
from flask_cors import CORS
import pandas as pd
import copy
from glycowork.glycan_data.loader import df_species

app = Flask(__name__)
CORS(app)

# Save species data as CSV
species_df = pd.DataFrame(copy.deepcopy(df_species))
species_df.to_csv("species_data.csv", index=False)

@app.route("/api/download", methods=["GET"])
def download_species_data():
    species_name = request.args.get('species', '').strip()

    if species_name:
        # Filter the species dataset based on the species name
        filtered_df = species_df[species_df['Species'].str.contains(species_name, case=False, na=False)]

        # Save filtered data to a temporary CSV file
        filtered_file_path = f"filtered_{species_name.replace(' ', '_')}.csv"
        filtered_df.to_csv(filtered_file_path, index=False)

        return send_file(
            filtered_file_path,
            mimetype="text/csv",
            as_attachment=True,
            download_name=f"{species_name.replace(' ', '_')}_data.csv"
        )
    else:
        return "Species name is required", 400

if __name__ == "__main__":
    app.run(debug=True)
