import React, { useState } from "react";

const DatasetDownloader = () => {
  const [species, setSpecies] = useState("");

  const handleDownload = () => {
    if (!species.trim()) {
      alert("Please enter a species name.");
      return;
    }

    const query = encodeURIComponent(species.trim());
    const downloadUrl = `http://localhost:5000/api/download?species=${query}`;

    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = `${species.replace(/\s+/g, "_")}_data.csv`;
    anchor.click();
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full sm:w-96">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Download Glycan Dataset
      </h2>
      <input
        type="text"
        value={species}
        onChange={(e) => setSpecies(e.target.value)}
        placeholder="Enter species (e.g., Homo sapiens)"
        className="w-full p-3 border border-gray-300 rounded-md mb-4 text-base"
      />
      <button
        onClick={handleDownload}
        className="w-full bg-blue-600 text-white py-3 rounded-md text-base font-medium hover:bg-blue-700 transition"
      >
        Download CSV
      </button>
    </div>
  );
};

export default DatasetDownloader;
