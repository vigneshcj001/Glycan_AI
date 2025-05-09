import React, { useRef, useState } from "react";
import * as $3Dmol from "3dmol";

const glycanPDBMap = {
  "Galβ1-4GlcNAcβ1-3Galβ1-4Glc": "1G12",
  "Neu5Acα2-6Galβ1-4GlcNAcβ1-3Galβ1-4Glc": "1SFG",
  "Manα1-6(Manα1-3)Manβ1-4GlcNAcβ1-4GlcNAc": "3RY6",
};

const VisualizePage = () => {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const [glycanSeq, setGlycanSeq] = useState("");
  const [style, setStyle] = useState("stick");
  const [colorBy, setColorBy] = useState("element");
  const [showSurface, setShowSurface] = useState(false);

  const fetchPDBFromGlycanSeq = async (seq) => {
    const normalized = seq.trim();
    return glycanPDBMap[normalized] || "1G12";
  };

  const loadStructure = async () => {
    const pdbId = await fetchPDBFromGlycanSeq(glycanSeq);
    const element = (viewerRef.current = $3Dmol.createViewer(containerRef.current, {
      backgroundColor: "white",
    }));

    fetch(`https://files.rcsb.org/view/${pdbId}.pdb`)
      .then((res) => res.text())
      .then((data) => {
        element.addModel(data, "pdb");

        const styleObj = {};
        styleObj[style] = { color: colorBy };

        element.setStyle({}, styleObj);

        if (showSurface) {
          element.addSurface($3Dmol.SurfaceType.VDW, { opacity: 0.7 });
        }

        element.zoomTo();
        element.render();
      });
  };

  const resetView = () => {
    if (viewerRef.current) {
      viewerRef.current.zoomTo();
      viewerRef.current.render();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <input
        type="text"
        value={glycanSeq}
        onChange={(e) => setGlycanSeq(e.target.value)}
        placeholder="Enter Glycan Sequence"
        className="border p-2 rounded w-full"
      />

      <div className="flex gap-4 flex-wrap">
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="stick">Stick</option>
          <option value="sphere">Sphere</option>
          <option value="cartoon">Cartoon</option>
          <option value="line">Line</option>
        </select>

        <select
          value={colorBy}
          onChange={(e) => setColorBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="element">Element</option>
          <option value="spectrum">Spectrum</option>
          <option value="chain">Chain</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showSurface}
            onChange={(e) => setShowSurface(e.target.checked)}
          />
          Show Surface
        </label>
      </div>

      <div className="flex gap-4">
        <button
          onClick={loadStructure}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Visualize 3D Glycan
        </button>

        <button
          onClick={resetView}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Reset View
        </button>
      </div>

      <div
        ref={containerRef}
        style={{ width: "100%", height: "500px", marginTop: "20px" }}
      />
    </div>
  );
};

export default VisualizePage;
