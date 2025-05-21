// GlycanDrawer.js
import React, { useState } from "react";
import { FaMagic } from "react-icons/fa";

const GlycanDrawer = () => {
  const [glycan, setGlycan] = useState("");
  const [highlight, setHighlight] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);

  const exampleSeq =
    "Neu5Ac(a2-3)Gal(b1-4)[Fuc(a1-3)]GlcNAc(b1-2)Man(a1-3)[Neu5Gc(a2-6)Gal(b1-4)GlcNAc(b1-2)Man(a1-6)][GlcNAc(b1-4)]Man(b1-4)GlcNAc(b1-4)[Fuc(a1-6)]GlcNAc";

  const autofillExample = () => {
    setGlycan(exampleSeq);
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
    <div className="p-6 max-w-xl mx-auto relative">
      <h2 className="text-xl font-bold mb-4">🧬 Glycan Drawer</h2>
      <button
        onClick={autofillExample}
        className="absolute top-2 right-2 text-purple-600 hover:text-purple-800"
        title="Fill with sample glycans"
        type="button"
      >
        <FaMagic size={20} />
      </button>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter glycan string"
          className="w-full p-2 border rounded"
          value={glycan}
          onChange={(e) => setGlycan(e.target.value)}
        />
        <input
          type="text"
          placeholder="Highlight motif (optional)"
          className="w-full p-2 border rounded"
          value={highlight}
          onChange={(e) => setHighlight(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {loading ? "Drawing..." : "Draw Glycan"}
        </button>
      </form>

      {loading && (
        <p className="mt-4 text-gray-500 text-center">Rendering image...</p>
      )}

      {imageSrc && (
        <div className="mt-6 text-center">
          <img src={imageSrc} alt="Glycan structure" className="mx-auto" />
          <a
            href={imageSrc}
            download="glycan.png"
            className="mt-2 inline-block text-blue-500 underline"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
};

export default GlycanDrawer;
