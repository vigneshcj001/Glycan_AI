import React from "react";
import MotifChart from "./MotifChart";
import { FaDownload, FaSearch } from "react-icons/fa";
import DatasetDownloader from "./DatasetDownloader";
import GlycanSearch from "./GlycanSearch";

const Resources = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-blue-50 py-10 px-6">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-12 text-center drop-shadow-lg">
        Glycan Research Tools
      </h1>
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
            <FaDownload className="text-blue-500" /> Download Glycan Dataset
          </h2>
          <DatasetDownloader />
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
            <FaSearch className="text-blue-500" /> Glycan PDB ID Redirector
          </h2>
          <GlycanSearch />
        </div>
      </div>
      <div className="w-full max-w-4xl mt-10">
        <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
            <FaDownload className="text-blue-500" /> Glycan Data
          </h2>
          <MotifChart />
        </div>
      </div>
    </div>
  );
};

export default Resources;
