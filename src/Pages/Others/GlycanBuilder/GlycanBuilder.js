import React, { useState } from "react";
import axios from "axios";

const sugars = [
  "Glc",
  "Man",
  "Gal",
  "Gul",
  "Alt",
  "All",
  "Tal",
  "Ido",
  "GlcNAc",
  "ManNAc",
  "GalNAc",
  "GulNAc",
  "AltNAc",
  "AllNAc",
  "TalNAc",
  "IdoNAc",
  "GlcN",
  "ManN",
  "GalN",
  "GulN",
  "AltN",
  "AllN",
  "TalN",
  "IdoN",
  "GlcA",
  "ManA",
  "GalA",
  "GulA",
  "AltA",
  "AllA",
  "TalA",
  "IdoA",
  "Qui",
  "Rha",
  "6dGul",
  "6dAlt",
  "6dTal",
  "Fuc",
  "QuiNAc",
  "RhaNAc",
  "6dAltNAc",
  "6dTalNAc",
  "FucNAc",
  "Oli",
  "Tyv",
  "Abe",
  "Par",
  "Dig",
  "Col",
  "Ara",
  "Lyx",
  "Xyl",
  "Rib",
  "Kdn",
  "Neu5Ac",
  "Neu5Gc",
  "Neu",
  "Sia",
  "Pse",
  "Leg",
  "Aci",
  "4eLeg",
  "Bac",
  "LDmanHep",
  "Kdo",
  "Dha",
  "DDmanHep",
  "MurNAc",
  "MurNGc",
  "Mur",
  "Api",
  "Fru",
  "Tag",
  "Sor",
  "Psi",
];

const bonds = [
  "a1-1",
  "a1-2",
  "a1-3",
  "a1-4",
  "a1-5",
  "a1-6",
  "a1-7",
  "a1-8",
  "a2-1",
  "a2-2",
  "a2-3",
  "a2-4",
  "a2-5",
  "a2-6",
  "a2-7",
  "a2-8",
  "a2-9",
  "b1-1",
  "b1-2",
  "b1-3",
  "b1-4",
  "b1-5",
  "b1-6",
  "b1-7",
  "b1-8",
  "b1-9",
  "b2-1",
  "b2-2",
  "b2-3",
  "b2-4",
  "b2-5",
  "b2-6",
  "b2-7",
  "b2-8",
];
const symbols = ["(", ")", "[", "]"];

const GlycanBuilder = () => {
  const [glycanSeq, setGlycanSeq] = useState([]);
  const [snfgImg, setSnfgImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const lastItem = glycanSeq[glycanSeq.length - 1] || "";

  const isBond = (item) => item.startsWith("(a") || item.startsWith("(b");
  const isSugar = (item) => sugars.includes(item);

  const canAddSugar =
    glycanSeq.length === 0 || isBond(lastItem) || symbols.includes(lastItem);
  const canAddBond = isSugar(lastItem) || lastItem === ")" || lastItem === "]";

  const handleAdd = (item) => {
    // Validation
    if (sugars.includes(item) && !canAddSugar) {
      setError("You must add a bond before adding another sugar.");
      return;
    }

    if (bonds.includes(item.replace(/[()]/g, "")) && !canAddBond) {
      setError("You must add a sugar before adding another bond.");
      return;
    }

    setGlycanSeq([...glycanSeq, item]);
    setError(null);
  };

  const handleClear = () => {
    setGlycanSeq([]);
    setSnfgImg(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (glycanSeq.length === 0) {
      setError("Please build a glycan sequence first.");
      return;
    }

    const glycanStr = glycanSeq.join("");
    setLoading(true);
    setError(null);
    setSnfgImg(null);

    try {
      const res = await axios.post("http://localhost:5000/api/draw", {
        glycan: glycanStr,
      });

      if (res.data.error) {
        setError(res.data.error);
      } else {
        setSnfgImg(`data:image/png;base64,${res.data.image}`);
      }
    } catch (err) {
      setError("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-blue-200 to-purple-100 font-sans">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-indigo-800 drop-shadow">
        🧬 Interactive Glycan Builder
      </h1>

      {/* Sugars */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-indigo-700">Sugars</h2>
        <div className="flex flex-wrap gap-2">
          {sugars.map((sugar) => (
            <button
              key={sugar}
              onClick={() => handleAdd(sugar)}
              className={`py-1 px-3 rounded shadow font-medium transition-all duration-150 ${
                canAddSugar
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!canAddSugar}
              title={canAddSugar ? "Add Sugar" : "You must add a bond next."}
            >
              {sugar}
            </button>
          ))}
        </div>
      </section>

      {/* Bonds */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-green-700">Linkages</h2>
        <div className="flex flex-wrap gap-2">
          {bonds.map((bond) => (
            <button
              key={bond}
              onClick={() => handleAdd(`(${bond})`)}
              className={`py-1 px-3 rounded shadow font-medium transition-all duration-150 ${
                canAddBond
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!canAddBond}
              title={canAddBond ? "Add Bond" : "You must add a sugar next."}
            >
              {bond}
            </button>
          ))}
        </div>
      </section>

      {/* Branching */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-yellow-700">
          Branching
        </h2>
        <div className="flex flex-wrap gap-2">
          {symbols.map((symbol) => (
            <button
              key={symbol}
              onClick={() => handleAdd(symbol)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-1 px-3 rounded shadow"
              title="Add branching symbol"
            >
              {symbol}
            </button>
          ))}
        </div>
      </section>

      {/* Display */}
      <div className="bg-white p-4 rounded shadow mb-6 border border-gray-200">
        <h2 className="font-semibold mb-2 text-gray-700">Glycan Sequence:</h2>
        {glycanSeq.length === 0 ? (
          <p className="text-gray-500">
            No sequence yet. Click buttons to build.
          </p>
        ) : (
          <p className="text-lg font-mono break-words text-blue-900">
            {glycanSeq.join("")}
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          {loading ? "Rendering..." : "Render SNFG"}
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded shadow"
        >
          Clear
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-600 text-center text-lg">{error}</p>}

      {/* Image */}
      {snfgImg && (
        <div className="text-center mt-8">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Rendered SNFG Image:
          </h3>
          <img
            src={snfgImg}
            alt="Glycan SNFG"
            className="mx-auto border border-gray-300 rounded shadow-md"
            style={{ maxWidth: "500px", height: "auto" }}
          />
          <div className="mt-4">
            <a
              href={snfgImg}
              download="glycan.png"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow transition"
            >
              ⬇️ Download PNG
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlycanBuilder;
