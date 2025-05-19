import React from "react";
import GlycanFormatConverter from "./GlycanFormatConverter";
import GlycanDrawer from "./GlycanDrawer";

const GlycanToolbox = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 font-sans flex gap-10">
      <div className="flex-1 bg-white shadow-md rounded-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-purple-700 flex items-center gap-2">
          🧬 Glycan Format Converter
        </h1>
        <GlycanFormatConverter />
      </div>

      <div className="flex-1 bg-white shadow-md rounded-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-purple-700 flex items-center gap-2">
          🖼️ GlycoDraw Viewer
        </h1>
        <GlycanDrawer />
      </div>
    </div>
  );
};

export default GlycanToolbox;
