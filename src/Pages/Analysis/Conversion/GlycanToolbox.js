import React from "react";
import GlycanFormatConverter from "./GlycanFormatConverter";
import GlycanDrawer from "./GlycanDrawer";

const GlycanToolbox = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 mt-10 font-sans grid md:grid-cols-2 gap-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 border border-blue-100 transition-all duration-300 hover:shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-blue-600 flex items-center gap-2">
          🧬 Glycan Format Converter
        </h1>
        <GlycanFormatConverter />
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 border border-blue-100 transition-all duration-300 hover:shadow-xl">
        <h1 className="text-2xl font-bold mb-4 text-blue-600 flex items-center gap-2">
          🖼️ GlycoDraw Viewer
        </h1>
        <GlycanDrawer />
      </div>
    </div>
  );
};

export default GlycanToolbox;
