import React, { useRef, useState } from "react";
import { FaSpinner, FaMagic } from "react-icons/fa";

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [viewLoaded, setViewLoaded] = useState(false);

  const fetchPDBFromGlycanSeq = (seq) => glycanPDBMap[seq.trim()] || null;

  const loadStructure = async () => {
    setLoading(true);
    setMessage("");

    const pdbId = fetchPDBFromGlycanSeq(glycanSeq);
    if (!pdbId) {
      setMessage("No glycan structure found for the given sequence.");
      setLoading(false);
      return;
    }

    const container = containerRef.current;
    if (!container) {
      setMessage("Viewer container not available.");
      setLoading(false);
      return;
    }

    if (!window.$3Dmol || typeof window.$3Dmol.createViewer !== "function") {
      setMessage("3Dmol.js is not loaded. Check your script setup.");
      setLoading(false);
      return;
    }

    container.innerHTML = "";
    const viewer = window.$3Dmol.createViewer(container, {
      backgroundColor: "white",
    });
    viewerRef.current = viewer;

    try {
      const res = await fetch(`https://files.rcsb.org/view/${pdbId}.pdb`);
      const pdbData = await res.text();

      viewer.addModel(pdbData, "pdb");
      viewer.setStyle({}, { [style]: { color: colorBy } });

      if (showSurface) {
        viewer.addSurface(window.$3Dmol.SurfaceType.VDW, { opacity: 0.7 });
      }

      viewer.zoomTo();
      viewer.render();
      setViewLoaded(true);
    } catch (err) {
      console.error("Error loading structure:", err);
      setMessage("Failed to load structure.");
    }

    setLoading(false);
  };

  const handleBack = () => {
    if (viewerRef.current) {
      viewerRef.current.clear();
      viewerRef.current.render();
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    setGlycanSeq("");
    setStyle("stick");
    setColorBy("element");
    setShowSurface(false);
    setMessage("");
    setViewLoaded(false);
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-700">
        Glycan 3D Visualizer
      </h1>

      <div className="space-y-4 max-w-3xl mx-auto">
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
        </div>

        <div className="flex justify-center gap-4 mt-6 flex-wrap">
          {Object.keys(glycanPDBMap).map((example, idx) => (
            <button
              key={idx}
              onClick={() => {
                setGlycanSeq(example);
                setMessage("");
              }}
              className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-200 transition"
            >
              <FaMagic />
              Try: {example}
            </button>
          ))}
        </div>

        {/* 3D Viewer Display */}
        <div className="w-full mt-6 flex justify-center">
          <div
            ref={containerRef}
            style={{
              width: "700px",
              height: "500px",
              display: viewLoaded ? "block" : "none",
              position: "relative", // Add position styling here
            }}
            className="border rounded shadow"
          />
        </div>

        {viewLoaded && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleBack}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded text-lg"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizePage;
