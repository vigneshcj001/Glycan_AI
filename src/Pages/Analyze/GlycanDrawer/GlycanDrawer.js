import React, { useState } from "react";
import { FaMagic } from "react-icons/fa";

const exampleSeq =
  "Neu5Ac(a2-3)Gal(b1-4)[Fuc(a1-3)]GlcNAc(b1-2)Man(a1-3)[Neu5Gc(a2-6)Gal(b1-4)GlcNAc(b1-2)Man(a1-6)][GlcNAc(b1-4)]Man(b1-4)GlcNAc(b1-4)[Fuc(a1-6)]GlcNAc";
const exampleHighlight = "Fuc(a1-?)[Gal(b1-?)]GlcNAc";

const GlycanDrawer = () => {
  const [glycan, setGlycan] = useState("");
  const [highlight, setHighlight] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  const autofillExample = () => {
    setGlycan(exampleSeq);
    setHighlight(exampleHighlight);
    setImageSrc(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setImageSrc(null);
    try {
      const res = await fetch("http://localhost:5000/api/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ glycan, highlight_motif: highlight }),
      });
      const data = await res.json();
      if (res.ok) {
        setImageSrc("data:image/png;base64," + data.image);
      } else {
        alert(data.error || "Failed to draw glycan.");
      }
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-2xl space-y-6 bg-white shadow-lg rounded-2xl p-6 border border-blue-100 transition-all duration-300 hover:shadow-xl relative">
        <h1 className="text-2xl font-bold mb-2 text-blue-600 flex items-center gap-2">
          🖼️ GlycoDraw Viewer
        </h1>

        {/* Magic autofill */}
        <div className="flex justify-end">
          <button
            onClick={autofillExample}
            className="flex items-center gap-2 px-3 py-1 text-sm rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
            title="Try with example sequence"
            type="button"
          >
            <FaMagic className="animate-pulse" />
            Autofill Example
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter glycan string"
            className="w-full p-2 border border-blue-300 rounded"
            value={glycan}
            onChange={(e) => setGlycan(e.target.value)}
          />
          <input
            type="text"
            placeholder="Highlight motif (optional)"
            className="w-full p-2 border border-blue-300 rounded"
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition"
          >
            {loading ? "Drawing..." : "Draw Glycan"}
          </button>
        </form>

        {loading && (
          <p className="text-center text-gray-500">Rendering glycan image...</p>
        )}

        {imageSrc && (
          <div className="text-center mt-4">
            <img src={imageSrc} alt="Glycan structure" className="mx-auto" />
            <a
              href={imageSrc}
              download="glycan.png"
              className="mt-3 inline-block text-blue-600 underline"
            >
              Download Image
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlycanDrawer;