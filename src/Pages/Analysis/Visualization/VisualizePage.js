import React, { useRef, useState } from "react";
import { FaSpinner, FaMagic } from "react-icons/fa";

const VisualizePage = () => {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);

  const [glycanSeq, setGlycanSeq] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [viewLoaded, setViewLoaded] = useState(false);

  const loadStructure = async () => {
    setLoading(true);
    setMessage("");
    setViewLoaded(false);

    if (!glycanSeq.trim()) {
      setMessage("Please enter a glycan sequence.");
      setLoading(false);
      return;
    }

    if (!window.$3Dmol || typeof window.$3Dmol.createViewer !== "function") {
      setMessage("3Dmol.js not loaded.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/convert-smiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ iupac: glycanSeq.trim() }),
      });

      const data = await res.json();

      if (res.status !== 200) {
        setMessage(data.error || "Error fetching SMILES");
        setLoading(false);
        return;
      }

      const smiles = data.smiles;
      console.log("SMILES received:", smiles);

      const container = containerRef.current;
      container.innerHTML = "";

      const viewer = window.$3Dmol.createViewer(container, {
        backgroundColor: "white",
      });

      viewerRef.current = viewer;
      viewer.addModel(smiles, "smiles");
      viewer.setStyle({}, { stick: {} });
      viewer.zoomTo();
      viewer.render();

      setViewLoaded(true);
    } catch (err) {
      console.error("Fetch error:", err);
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
    setMessage("");
    setViewLoaded(false);
  };

  const exampleGlycans = [
    "Gal(b1-4)GlcNAc",
    "Neu5Ac(a2-3)Gal(b1-4)[Fuc(a1-3)]GlcNAc",
    "Man(a1-6)[Man(a1-3)]Man(a1-6)[Man(a1-3)]Man(b1-4)GlcNAc(b1-4)GlcNAc",
  ];

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
          placeholder="Enter Glycan Sequence (IUPAC)"
          className="border p-4 rounded w-full text-lg"
        />

        {message && <p className="text-red-600 text-center">{message}</p>}

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
          {exampleGlycans.map((example, idx) => (
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

        <div className="w-full mt-6 flex justify-center">
          <div
            ref={containerRef}
            style={{
              width: "700px",
              height: "500px",
              display: "block", // Always show for debugging
              position: "relative",
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
