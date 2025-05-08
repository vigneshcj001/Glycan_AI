import React from "react";
import DatasetDownloader from "./DatasetDownloader";
import GlycanSearch from "./GlycanSearch";

const Resources = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        Glycan Research Tools
      </h1>
      <div className="w-full max-w-4xl flex flex-col items-center gap-8">
        <DatasetDownloader />
        <GlycanSearch />
      </div>
    </div>
  );
};

export default Resources;
