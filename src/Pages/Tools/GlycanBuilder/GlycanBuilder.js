import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import * as $3Dmol from "3dmol"; // Ensure 3dmol.js is available
import {
  FaSpinner,
  FaUndoAlt,
  FaCamera,
  FaDownload,
  FaExclamationCircle,
} from "react-icons/fa"; // Added react-icons

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

// 3Dmol Style Definitions
const styleDefinitions3D = {
  ballAndStick: {
    label: "Ball and Stick",
    config: {
      stick: { radius: 0.08, colorscheme: "elem" },
      sphere: { scale: 0.25, colorscheme: "elem" },
    },
  },
  spacefill: {
    label: "Spacefill (CPK)",
    config: {
      sphere: { colorscheme: "elem" },
    },
  },
  wireframe: {
    label: "Wireframe",
    config: {
      line: { linewidth: 1.5, colorscheme: "elem" },
    },
  },
  stickFigure: {
    label: "Stick Figure",
    config: {
      stick: { radius: 0.1, colorscheme: "elem" },
    },
  },
};

const initialStyles3DState = {
  ballAndStick: true,
  spacefill: false,
  wireframe: false,
  stickFigure: false,
};

const GlycanBuilder = () => {
  const [glycanSeq, setGlycanSeq] = useState([]);

  // SNFG State
  const [snfgImg, setSnfgImg] = useState(null);
  const [loadingSnfg, setLoadingSnfg] = useState(false);
  const [errorSnfg, setErrorSnfg] = useState(null);

  // Conversion State
  const [convertedFormats, setConvertedFormats] = useState(null);
  const [loadingConversion, setLoadingConversion] = useState(false);
  const [errorConversion, setErrorConversion] = useState(null);

  // 3D Visualization State
  const [molBlock3D, setMolBlock3D] = useState(null);
  const [viewer3D, setViewer3D] = useState(null);
  const [view3DLoaded, setView3DLoaded] = useState(false);
  const [styles3D, setStyles3D] = useState({ ...initialStyles3DState });
  const [loading3D, setLoading3D] = useState(false);
  const [error3D, setError3D] = useState(null);
  const containerRef3D = useRef(null);

  // General error for builder logic
  const [builderError, setBuilderError] = useState(null);
  const [processingGlycan, setProcessingGlycan] = useState(false);

  const lastItem = glycanSeq[glycanSeq.length - 1] || "";

  const isBond = (item) =>
    typeof item === "string" &&
    (item.startsWith("(a") || item.startsWith("(b"));
  const isSugar = (item) => sugars.includes(item);

  const canAddSugar =
    glycanSeq.length === 0 || isBond(lastItem) || symbols.includes(lastItem);
  const canAddBond = isSugar(lastItem) || lastItem === ")" || lastItem === "]";

  const handleAdd = (item) => {
    if (sugars.includes(item) && !canAddSugar) {
      setBuilderError(
        "You must add a bond or branching symbol before adding another sugar."
      );
      return;
    }

    if (bonds.includes(item.replace(/[()]/g, "")) && !canAddBond) {
      setBuilderError(
        "You must add a sugar or end a branch/group before adding a bond."
      );
      return;
    }

    // Logic for symbols like '(', ')', '[', ']' needs to be considered for enabling/disabling
    // For now, allowing symbols to be added more freely, parser will validate final sequence.
    // Example: ensure '(' is followed by sugar or bond, not ')'

    setGlycanSeq([...glycanSeq, item]);
    setBuilderError(null);
  };

  const handleClear = () => {
    setGlycanSeq([]);
    setSnfgImg(null);
    setErrorSnfg(null);
    setConvertedFormats(null);
    setErrorConversion(null);
    setMolBlock3D(null); // This will trigger useEffect to clear 3D view
    setError3D(null);
    setBuilderError(null);
    setView3DLoaded(false);
    if (viewer3D && containerRef3D.current) {
      containerRef3D.current.innerHTML = ""; // Clear 3Dmol viewer container
    }
    setViewer3D(null);
    setStyles3D({ ...initialStyles3DState });
    setProcessingGlycan(false);
  };

  const processGlycan = async () => {
    if (glycanSeq.length === 0) {
      setBuilderError("Please build a glycan sequence first.");
      return;
    }

    const glycanStr = glycanSeq.join("");
    setProcessingGlycan(true);
    setBuilderError(null);

    // Reset previous results
    setSnfgImg(null);
    setErrorSnfg(null);
    setLoadingSnfg(true);
    setConvertedFormats(null);
    setErrorConversion(null);
    setLoadingConversion(true);
    setMolBlock3D(null);
    setError3D(null);
    setLoading3D(true);
    if (viewer3D && containerRef3D.current)
      containerRef3D.current.innerHTML = "";
    setView3DLoaded(false);
    setViewer3D(null);

    // --- SNFG Call ---
    try {
      const res = await axios.post("http://localhost:5000/api/draw", {
        glycan: glycanStr,
      });
      if (res.data.error) {
        setErrorSnfg(res.data.error);
      } else {
        setSnfgImg(`data:image/png;base64,${res.data.image}`);
      }
    } catch (err) {
      setErrorSnfg("SNFG: Could not connect to backend or rendering failed.");
    } finally {
      setLoadingSnfg(false);
    }

    // --- Conversion Call ---
    try {
      const res = await axios.post("http://localhost:5000/convert", {
        glycan: glycanStr,
        input_format: "iupac",
      });
      if (res.data.error) {
        setErrorConversion(res.data.error);
      } else {
        setConvertedFormats(res.data);
      }
    } catch (err) {
      setErrorConversion(
        "Conversion: Could not connect to backend or conversion failed."
      );
    } finally {
      setLoadingConversion(false);
    }

    // --- 3D Visualization Data Call ---
    try {
      const res = await axios.post("http://localhost:5000/visualize", {
        iupac: glycanStr,
      });
      if (res.data.error) {
        setError3D(res.data.error);
      } else {
        setMolBlock3D(res.data.molBlock); // useEffect will handle viewer creation
      }
    } catch (err) {
      setError3D(
        "3D Viz: Could not connect to backend or data fetching failed."
      );
    } finally {
      setLoading3D(false);
    }
    setProcessingGlycan(false);
  };

  // --- 3D Viewer Logic ---
  const get3DStyleObject = () => {
    const activeStyleKey = Object.keys(styles3D).find(
      (key) => styles3D[key] && styleDefinitions3D[key]
    );
    return activeStyleKey
      ? styleDefinitions3D[activeStyleKey].config
      : styleDefinitions3D.ballAndStick.config; // Default
  };

  useEffect(() => {
    if (molBlock3D && containerRef3D.current) {
      if (containerRef3D.current.innerHTML !== "" && viewer3D) {
        // If viewer exists, clear it before re-init
        viewer3D.clear(); // $3Dmol clear method
      }
      containerRef3D.current.innerHTML = ""; // Ensure container is empty

      const newViewer = new $3Dmol.GLViewer(containerRef3D.current, {
        backgroundColor: "lightgrey",
      });
      newViewer.addModel(molBlock3D, "mol");
      newViewer.setStyle({}, get3DStyleObject());
      // Simple surface for context, adjust as needed
      // newViewer.addSurface($3Dmol.SurfaceType.VDW, { opacity: 0.15, color: "white" });
      newViewer.zoomTo();
      newViewer.render();
      setViewer3D(newViewer);
      setView3DLoaded(true);
    } else if (!molBlock3D && viewer3D) {
      if (containerRef3D.current) containerRef3D.current.innerHTML = "";
      setViewer3D(null);
      setView3DLoaded(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [molBlock3D]); // Only re-run when molBlock3D changes

  useEffect(() => {
    if (viewer3D && view3DLoaded) {
      viewer3D.setStyle({}, get3DStyleObject());
      viewer3D.render();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styles3D, viewer3D, view3DLoaded]);

  const toggle3DStyle = (selectedStyleKey) => {
    const newStyles = {};
    for (const key in initialStyles3DState) {
      newStyles[key] = false;
    }
    newStyles[selectedStyleKey] = true;
    setStyles3D(newStyles);
  };

  const reset3DView = () => {
    if (viewer3D && view3DLoaded) {
      viewer3D.zoomTo();
      viewer3D.render();
    }
  };

  const save3DScreenshot = () => {
    if (viewer3D && view3DLoaded) {
      const imgData = viewer3D.pngURI();
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `glycan_3D_${
        glycanSeq.join("").replace(/\W/g, "_") || "structure"
      }_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-blue-200 to-purple-100 font-sans">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-800 drop-shadow">
        🧬 Glycan Analysis Suite
      </h1>

      {/* --- Builder Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <section>
          <h2 className="text-xl font-semibold mb-2 text-indigo-700">
            1. Sugars
          </h2>
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 bg-white rounded shadow border border-gray-200">
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
                title={
                  canAddSugar
                    ? `Add Sugar: ${sugar}`
                    : "A bond or branch symbol must precede a sugar."
                }
              >
                {sugar}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-green-700">
            2. Linkages
          </h2>
          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-2 bg-white rounded shadow border border-gray-200">
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
                title={
                  canAddBond
                    ? `Add Bond: ${bond}`
                    : "A sugar or end of branch/group must precede a bond."
                }
              >
                {bond}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2 text-yellow-700">
            3. Branching
          </h2>
          <div className="flex flex-wrap gap-2 p-2 bg-white rounded shadow border border-gray-200">
            {symbols.map((symbol) => (
              <button
                key={symbol}
                onClick={() => handleAdd(symbol)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-1 px-3 rounded shadow"
                title={`Add branching symbol: ${symbol}`}
              >
                {symbol}
              </button>
            ))}
          </div>
        </section>
      </div>

      {builderError && (
        <p className="text-red-600 text-center text-lg mb-4 p-2 bg-red-100 rounded border border-red-300">
          <FaExclamationCircle className="inline mr-2" />
          {builderError}
        </p>
      )}

      <div className="bg-white p-4 rounded shadow mb-6 border border-gray-200">
        <h2 className="font-semibold mb-2 text-gray-700">
          Current Glycan Sequence:
        </h2>
        {glycanSeq.length === 0 ? (
          <p className="text-gray-500">
            No sequence yet. Click buttons above to build.
          </p>
        ) : (
          <p className="text-lg font-mono break-words text-blue-900 bg-gray-50 p-2 rounded">
            {glycanSeq.join("")}
          </p>
        )}
      </div>

      <div className="flex gap-4 justify-center mb-8">
        <button
          onClick={processGlycan}
          disabled={processingGlycan || glycanSeq.length === 0}
          className={`bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded shadow text-lg flex items-center justify-center ${
            processingGlycan || glycanSeq.length === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {processingGlycan ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : null}
          {processingGlycan ? "Processing..." : "Process Glycan"}
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded shadow text-lg"
        >
          Clear All
        </button>
      </div>

      {/* --- Results Section --- */}
      <div className="space-y-8">
        {/* SNFG Image */}
        <section className="bg-white p-6 rounded shadow border border-gray-200">
          <h2 className="text-2xl font-semibold mb-3 text-indigo-700">
            SNFG Image
          </h2>
          {loadingSnfg && (
            <p className="text-blue-600 flex items-center">
              <FaSpinner className="animate-spin mr-2" />
              Loading SNFG...
            </p>
          )}
          {errorSnfg && (
            <p className="text-red-600 bg-red-50 p-3 rounded border border-red-200">
              <FaExclamationCircle className="inline mr-2" />
              Error: {errorSnfg}
            </p>
          )}
          {snfgImg && !errorSnfg && (
            <div className="text-center">
              <img
                src={snfgImg}
                alt="Glycan SNFG"
                className="mx-auto border border-gray-300 rounded shadow-md mb-4"
                style={{ maxWidth: "500px", maxHeight: "400px", height: "auto" }}
              />
              <a
                href={snfgImg}
                download="glycan_snfg.png"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded shadow transition"
              >
                <FaDownload className="mr-2" /> Download PNG
              </a>
            </div>
          )}
          {!loadingSnfg && !snfgImg && !errorSnfg && (
            <p className="text-gray-500">
              SNFG image will appear here after processing.
            </p>
          )}
        </section>

        {/* Converted Formats */}
        <section className="bg-white p-6 rounded shadow border border-gray-200">
          <h2 className="text-2xl font-semibold mb-3 text-green-700">
            Converted Formats
          </h2>
          {loadingConversion && (
            <p className="text-blue-600 flex items-center">
              <FaSpinner className="animate-spin mr-2" />
              Loading formats...
            </p>
          )}
          {errorConversion && (
            <p className="text-red-600 bg-red-50 p-3 rounded border border-red-200">
              <FaExclamationCircle className="inline mr-2" />
              Error: {errorConversion}
            </p>
          )}
          {convertedFormats && !errorConversion && (
            <div className="space-y-3">
              {Object.entries(convertedFormats).map(([format, value]) =>
                value &&
                typeof value === "string" &&
                !value.toLowerCase().includes("not supported") &&
                !value.toLowerCase().includes("failed") ? (
                  <div key={format}>
                    <h3 className="font-semibold text-gray-800">
                      {format.toUpperCase()}:
                    </h3>
                    <pre className="bg-gray-100 p-2 rounded text-sm font-mono break-all whitespace-pre-wrap">
                      {value}
                    </pre>
                  </div>
                ) : value &&
                  (value.toLowerCase().includes("not supported") ||
                    value.toLowerCase().includes("failed")) ? (
                  <div key={format}>
                    <h3 className="font-semibold text-gray-800">
                      {format.toUpperCase()}:
                    </h3>
                    <p className="text-orange-600 bg-orange-50 p-2 rounded border border-orange-200 text-sm">
                      {value}
                    </p>
                  </div>
                ) : null
              )}
            </div>
          )}
          {!loadingConversion && !convertedFormats && !errorConversion && (
            <p className="text-gray-500">
              Converted formats will appear here after processing.
            </p>
          )}
        </section>

        {/* 3D Visualization */}
        <section className="bg-white p-6 rounded shadow border border-gray-200">
          <h2 className="text-2xl font-semibold mb-3 text-yellow-700">
            3D Visualization
          </h2>
          {loading3D && !molBlock3D && (
            <p className="text-blue-600 flex items-center">
              <FaSpinner className="animate-spin mr-2" />
              Loading 3D data...
            </p>
          )}
          {error3D && (
            <p className="text-red-600 bg-red-50 p-3 rounded border border-red-200">
              <FaExclamationCircle className="inline mr-2" />
              Error: {error3D}
            </p>
          )}

          {view3DLoaded && molBlock3D && (
            <div className="my-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={reset3DView}
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 text-sm"
                title="Reset Zoom & View"
              >
                <FaUndoAlt /> Reset View
              </button>
              <button
                onClick={save3DScreenshot}
                className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 text-sm"
                title="Save Screenshot"
              >
                <FaCamera /> Save Image
              </button>
            </div>
          )}

          {molBlock3D && (
            <div className="mt-4 p-2 border rounded shadow-inner bg-gray-50 max-w-md mx-auto">
              <h3 className="text-md font-semibold mb-2 text-center text-gray-700">
                3D Styles
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {Object.keys(styleDefinitions3D).map((styleKey) => (
                  <label
                    key={styleKey}
                    className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded text-sm"
                  >
                    <input
                      type="radio" // Changed to radio for single selection
                      name="3dstyle"
                      checked={!!styles3D[styleKey]}
                      onChange={() => toggle3DStyle(styleKey)}
                      className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span>{styleDefinitions3D[styleKey].label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="w-full mt-4 flex justify-center">
            <div
              ref={containerRef3D}
              style={{
                width: "100%",
                maxWidth: "700px",
                height: "500px",
                position: "relative",
                backgroundColor: view3DLoaded ? "transparent" : "#f0f0f0", // Placeholder bg
              }}
              className="border rounded shadow"
            />
          </div>
          {!loading3D && !molBlock3D && !error3D && (
            <p className="text-gray-500 text-center mt-4">
              3D model will appear here after processing.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default GlycanBuilder;
