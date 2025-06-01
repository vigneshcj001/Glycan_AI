import React, { useState, useRef, useEffect } from "react";
import { FaSpinner, FaMagic, FaCamera, FaUndoAlt } from "react-icons/fa";
import axios from "axios";
import * as $3Dmol from "3dmol";

const VisualizePage = () => {
  const [glycanSeq, setGlycanSeq] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewLoaded, setViewLoaded] = useState(false);
 
  const styleDefinitions = {
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
  
  const initialStylesState = {
    ballAndStick: true,
    spacefill: false,
    wireframe: false,
    stickFigure: false,
  };

  const [styles, setStyles] = useState({ ...initialStylesState }); 
  const [viewer, setViewer] = useState(null);
  const containerRef = useRef(null);

  const exampleGlycans = [
    "Gal(b1-4)GlcNAc",
    "Neu5Ac(a2-3)Gal(b1-4)[Fuc(a1-3)]GlcNAc",
  ];

  
  const getStyleObject = () => {
    const activeStyleKey = Object.keys(styles).find(
      (key) => styles[key] && styleDefinitions[key]
    );

    if (activeStyleKey) {
      return styleDefinitions[activeStyleKey].config;
    }
    return {};
  };

  const loadStructure = async () => {
    if (!glycanSeq.trim()) {
      setMessage("Please enter a glycan sequence.");
      return;
    }

    setLoading(true);
    setMessage("");
    setViewLoaded(false);

    if (viewer) {
      setViewer(null);
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    
    setStyles({ ...initialStylesState });

    try {
      const res = await axios.post("http://localhost:5000//visualize", {
        iupac: glycanSeq,
      });

      const { molBlock } = res.data;
      if (!containerRef.current) {
        console.error("Viewer container ref is not available.");
        setMessage("Failed to initialize viewer: container not found.");
        setLoading(false);
        return;
      }

      const newViewer = new $3Dmol.GLViewer(containerRef.current, {
        backgroundColor: "lightgrey",
      });

      newViewer.addModel(molBlock, "mol");
      const currentStyleConfig = getStyleObject();
      newViewer.setStyle({}, currentStyleConfig);

      newViewer.addSurface($3Dmol.SurfaceType.VDW, {
        opacity: 0.15,
        color: "white",
      });

      newViewer.zoomTo();
      newViewer.render();

      setViewer(newViewer);
      setViewLoaded(true);
    } catch (err) {
      setMessage(
        "Failed to visualize glycan. Try another input or check sequence format."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (viewer && viewLoaded) {
      viewer.setStyle({}, getStyleObject());
      viewer.render();
    }
  }, [styles, viewer, viewLoaded]);

  const handleBack = () => {
    setViewLoaded(false);
    setGlycanSeq("");
    setMessage("");
    setStyles({ ...initialStylesState });

    if (viewer) {
      setViewer(null);
    }
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }
  };

  
  const toggleStyle = (selectedStyleKey) => {
    const newStyles = {};
    for (const key in initialStylesState) {
      newStyles[key] = false;
    }
    newStyles[selectedStyleKey] = true;
    setStyles(newStyles);
  };

  const resetView = () => {
    if (viewer && viewLoaded) {
      viewer.zoomTo();
      viewer.render();
    }
  };

  const saveScreenshot = () => {
    if (viewer && viewLoaded) {
      const imgData = viewer.pngURI();
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `glycan_view_${
        glycanSeq.replace(/\W/g, "_") || "structure"
      }_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
          placeholder="Enter Glycan Sequence (IUPAC)"
          className="border p-4 rounded w-full text-lg"
        />

        {message && <p className="text-red-600 text-center py-2">{message}</p>}

        <div className="flex justify-center gap-4 mt-4 flex-wrap">
          <button
            onClick={loadStructure}
            disabled={loading}
            className={`px-6 py-2 rounded text-white text-lg flex items-center justify-center ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading && <FaSpinner className="animate-spin mr-2" />}
            {loading ? "Visualizing..." : "Visualize 3D Glycan"}
          </button>

          {viewLoaded && (
            <>
              <button
                onClick={resetView}
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                title="Reset Zoom & View"
              >
                <FaUndoAlt /> Reset View
              </button>

              <button
                onClick={saveScreenshot}
                className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                title="Save Screenshot"
              >
                <FaCamera /> Save Image
              </button>
            </>
          )}
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

        {viewLoaded && (
          <div className="mt-6 max-w-lg mx-auto border p-4 rounded shadow bg-gray-50">
            <h2 className="text-xl font-semibold mb-3 text-center">
              Visualization Styles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {Object.keys(styleDefinitions).map((styleKey) => (
                <label
                  key={styleKey}
                  className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded"
                >
                  <input
                    type="checkbox" 
                    checked={!!styles[styleKey]} 
                    onChange={() => toggleStyle(styleKey)} 
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>{styleDefinitions[styleKey].label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="w-full mt-6 flex justify-center">
          <div
            ref={containerRef}
            style={{
              width: "700px",
              height: "500px",
              position: "relative",
            }}
            className="border rounded shadow bg-gray-200"
          />
        </div>

        {viewLoaded && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleBack}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded text-lg"
            >
              Clear Visualization & Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizePage;
