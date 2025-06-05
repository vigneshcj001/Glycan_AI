import React, { useState } from "react";
import { FaMagic } from "react-icons/fa"; 

const DatasetDownloader = () => {
  const [species, setSpecies] = useState("");
  const [error, setError] = useState(null);

  const example = "Homo_sapiens";

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
      <div className="flex justify-center mb-4">
        <button
          onClick={() => {
            setSpecies(example); 
            setError(null);
          }}
          className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-200 transition"
        >
          <FaMagic />
          Try Homo sapiens
        </button>
      </div>

      <button
        onClick={handleDownload}
        className="w-full bg-blue-600 text-white py-3 rounded-md text-base font-medium hover:bg-blue-700 transition"
      >
        Download CSV
      </button>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default DatasetDownloader;
