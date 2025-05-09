import React, { useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const glycanPDBMap = {
  "Galβ1-4GlcNAcβ1-3Galβ1-4Glc": "1G12",
  "Neu5Acα2-6Galβ1-4GlcNAcβ1-3Galβ1-4Glc": "1SFG",
  "Manα1-6(Manα1-3)Manβ1-4GlcNAcβ1-4GlcNAc": "3RY6",
};

const VisualizePage = () => {
  const viewerRef = useRef(null);
  const [glycanSeq, setGlycanSeq] = useState("");
  const [style, setStyle] = useState("stick");
  const [colorBy, setColorBy] = useState("element");
  const [showSurface, setShowSurface] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [visualized, setVisualized] = useState(false);

  const fetchPDBFromGlycanSeq = (seq) => {
    const normalized = seq.trim();
    return glycanPDBMap[normalized] || "1G12"; // fallback
  };

  const loadStructure = async () => {
    setLoading(true);
    setMessage("");
    const pdbId = fetchPDBFromGlycanSeq(glycanSeq);

    if (!pdbId) {
      setMessage("No Glycan Structure Found.");
      setLoading(false);
      return;
    }

    const container = document.getElementById("viewerContainer");
    if (!container) {
      setMessage("Failed to find viewer container.");
      setLoading(false);
      return;
    }

    // ✅ Check if 3Dmol.js is loaded
    if (!window.$3Dmol || typeof window.$3Dmol.createViewer !== "function") {
      setMessage("3Dmol.js is not available. Please check script loading.");
      setLoading(false);
      return;
    }

    container.innerHTML = ""; // Clear previous viewer
    const viewer = window.$3Dmol.createViewer(container, {
      backgroundColor: "white",
    });
    viewerRef.current = viewer;

    try {
      const res = await fetch(`https://files.rcsb.org/view/${pdbId}.pdb`);
      const pdbData = await res.text();

      viewer.addModel(pdbData, "pdb");

      const styleObj = {};
      styleObj[style] = { color: colorBy };
      viewer.setStyle({}, styleObj);

      if (showSurface) {
        viewer.addSurface(window.$3Dmol.SurfaceType.VDW, { opacity: 0.7 });
      }

      viewer.zoomTo();
      viewer.render();
      setVisualized(true);
    } catch (err) {
      console.error("Error loading PDB structure:", err);
      setMessage("Failed to load structure.");
    }

    setLoading(false);
  };

  const resetView = () => {
    if (viewerRef.current) {
      viewerRef.current.zoomTo();
      viewerRef.current.render();
    }
  };

  return (
    <>
      {/* Control Panel */}
      <div className="absolute top-0 left-0 z-10 w-full p-6 space-y-6 bg-white bg-opacity-80">
        <h1 className="text-3xl font-bold text-center text-blue-700">
          Glycan 3D Visualizer
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            value={glycanSeq}
            onChange={(e) => setGlycanSeq(e.target.value)}
            placeholder="Enter Glycan Sequence"
            className="border p-4 rounded w-full text-lg"
          />

          {message && <p className="text-red-600 text-center">{message}</p>}

          <div className="flex flex-wrap gap-4 justify-center">
            <label>
              Style:
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="ml-2 border p-2 rounded"
              >
                <option value="stick">Stick</option>
                <option value="sphere">Sphere</option>
                <option value="cartoon">Cartoon</option>
                <option value="line">Line</option>
              </select>
            </label>

            <label>
              Color By:
              <select
                value={colorBy}
                onChange={(e) => setColorBy(e.target.value)}
                className="ml-2 border p-2 rounded"
              >
                <option value="element">Element</option>
                <option value="spectrum">Spectrum</option>
                <option value="chain">Chain</option>
              </select>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showSurface}
                onChange={(e) => setShowSurface(e.target.checked)}
                className="mr-2"
              />
              Show Surface
            </label>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={loadStructure}
            disabled={loading}
            className={`px-6 py-2 rounded text-white text-lg ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Visualize 3D Glycan"
            )}
          </button>

          <button
            onClick={resetView}
            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded text-lg"
          >
            Reset View
          </button>
        </div>
      </div>

      {/* 3D Viewer Area */}
      <div
        id="viewerContainer"
        style={{
          width: "100vw",
          height: "calc(100vh - 300px)",
          position: "absolute",
          top: "100px",
          left: 0,
          zIndex: 0,
          backgroundColor: "#f9f9f9",
        }}
      />
    </>
  );
};

export default VisualizePage;
