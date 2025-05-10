import React, { useState } from "react";
import { FaMagic } from "react-icons/fa";

const GlycanSearch = () => {
  const [pdbId, setPdbId] = useState("");
  const example = "1GNY"; // Example PDB ID

  const handleRedirect = () => {
    const trimmedId = pdbId.trim().toUpperCase();
    if (trimmedId) {
      window.open(`https://www.rcsb.org/structure/${trimmedId}`, "_blank");
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full sm:w-96">
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Glycan PDB ID Redirector
      </h2>
      <input
        type="text"
        value={pdbId}
        onChange={(e) => setPdbId(e.target.value)}
        placeholder="Enter PDB ID (e.g., 1GNY)"
        className="w-full p-3 border border-gray-300 rounded-md mb-4 text-base"
      />

      <div className="flex justify-center mb-4">
        <button
          onClick={() => setPdbId(example)} 
          className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-200 transition"
        >
          <FaMagic />
          1GNY
        </button>
      </div>

      <button
        onClick={handleRedirect}
        className="w-full bg-green-600 text-white py-3 rounded-md text-base font-medium hover:bg-green-700 transition"
      >
        View on RCSB
      </button>
    </div>
  );
};

export default GlycanSearch;
