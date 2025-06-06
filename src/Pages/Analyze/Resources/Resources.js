import React from "react";
import { FaDownload, FaSearch, FaMicroscope } from "react-icons/fa";
import DatasetDownloader from "./DatasetDownloader";
import GlycanSearch from "./GlycanSearch";

const Resources = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-16 px-6 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-16 text-center drop-shadow-xl">
        🔬 Glycan Research Tools
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl">

        <div className="bg-white/80 backdrop-blur-md border border-blue-300 rounded-2xl p-8 shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center flex items-center justify-center gap-3">
            <FaDownload className="text-blue-500" /> Glycan Dataset Downloader
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Access curated glycan datasets for computational or wet-lab
            research.
          </p>
          <DatasetDownloader />
        </div>
      
        <div className="bg-white/80 backdrop-blur-md border border-blue-300 rounded-2xl p-8 shadow-2xl hover:scale-105 transition-transform duration-300 cursor-pointer">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 text-center flex items-center justify-center gap-3">
            <FaSearch className="text-blue-500" /> Glycan PDB Redirector
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Enter a PDB ID and quickly navigate to glycan-related ligand pages.
          </p>
          <GlycanSearch />
        </div>
      </div>
    </div>
  );
};

export default Resources;
