import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";

// Import local components
import AppHeader from "./AppHeader";
import ControlsColumn from "./ControlsColumn";
import GraphVisualization from "./GraphVisualization";

// Constants can be moved to a separate file if they grow, or kept here for simplicity
const magicIconDataUri =
  "data:image/svg+xml,%3csvg fill='%237c3aed' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath d='M10 2v2H8v2H6v2H4v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h-2V6h-2V4h-2V2h-2zm1 7h2v5h-2v-5z' /%3e%3c/svg%3e";

const exampleGlycanSets = [
 
  {
    name: "Complex N-Glycans - Biantennary (Alditols)",
    glycans: [
      "GlcNAc(b1-2)Man(a1-3)[GlcNAc(b1-2)Man(a1-6)]Man(b1-4)GlcNAc(b1-4)GlcNAc-ol", // Core N-acetylglucosaminylated
      "Gal(b1-4)GlcNAc(b1-2)Man(a1-3)[GlcNAc(b1-2)Man(a1-6)]Man(b1-4)GlcNAc(b1-4)GlcNAc-ol", // One arm galactosylated
      "Gal(b1-4)GlcNAc(b1-2)Man(a1-3)[Gal(b1-4)GlcNAc(b1-2)Man(a1-6)]Man(b1-4)GlcNAc(b1-4)GlcNAc-ol", // Bi-antennary galactosylated
      "Neu5Ac(a2-6)Gal(b1-4)GlcNAc(b1-2)Man(a1-3)[Gal(b1-4)GlcNAc(b1-2)Man(a1-6)]Man(b1-4)GlcNAc(b1-4)GlcNAc-ol", // Sialylated on one arm
    ].join("\n"),
  },
  {
    name: "Fucosylated & Sialylated Oligosaccharides (Default Roots)",
    glycans: [
      "Fuc(a1-2)Gal(b1-4)Glc-ol", // 2'-Fucosyllactose
      "Gal(b1-4)[Fuc(a1-3)]GlcNAc(b1-3)Gal(b1-4)Glc-ol", // Lewis X on Lacto-N-tetraose core
      "Neu5Ac(a2-3)Gal(b1-3)GalNAc-ol", // Sialyl Tn antigen (O-glycan)
      "Neu5Ac(a2-3)Gal(b1-4)GlcNAc(b1-6)[Neu5Ac(a2-3)Gal(b1-3)]GalNAc-ol", // Di-sialylated O-glycan core 1
    ].join("\n"),
  },
  {
    name: "Glycosphingolipid (GSL) Cores (Alditols)", // Assuming -ol for visualization, actual GSLs have ceramide
    glycans: [
      "Glc-ol", // Glucosylceramide analog
      "Gal(b1-4)Glc-ol", // Lactosylceramide analog (Lactose alditol)
      "GalNAc(b1-4)Gal(b1-4)Glc-ol", // GA2 analog
      "Gal(b1-3)GalNAc(b1-4)Gal(b1-4)Glc-ol", // GB4 (globoside) analog
    ].join("\n"),
  },
  {
    name: "Sulfated & Phosphorylated Glycans (Default Roots)",
    glycans: [
      "Gal(b1-4)GlcNAc(6S)-ol", // 6-sulfo LacNAc alditol
      "Man(6P)(a1-2)Man(a1-3)Man-ol", // Simplified mannose-6-phosphate structure
      "GlcNAc(OS)", // O-sulfated GlcNAc (hypothetical, for PTM demo)
      "GalNAc(4S)(b1-4)GlcUA(b1-3)GalNAc(4S)(b1-4)GlcUA-ol", // Chondroitin sulfate disaccharide analog (simplified)
    ].join("\n"),
  },
];

const BiosyntheticNetworks = () => {
  const [glycansInput, setGlycansInput] = useState("");
  const [elements, setElements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [networkGenerated, setNetworkGenerated] = useState(false);
  const [activeExample, setActiveExample] = useState(null);
  const cyRef = useRef(null);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [networkMetadata, setNetworkMetadata] = useState(null);

  // Network Parameters
  const [availablePTMs, setAvailablePTMs] = useState([]);
  const [selectedPTMs, setSelectedPTMs] = useState([]);
  const [permittedRootsInput, setPermittedRootsInput] = useState(
    "Gal(b1-4)GlcNAc-ol, Gal(b1-4)Glc-ol"
  );
  const [availableEdgeTypes, setAvailableEdgeTypes] = useState([]);
  const [selectedEdgeType, setSelectedEdgeType] = useState("monolink");

  // UI State
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/network-parameters`)
      .then((res) => {
        setAvailablePTMs(res.data.available_ptms || []);
        setSelectedPTMs(res.data.default_ptms || []);
        setPermittedRootsInput((res.data.default_roots || []).join(", "));
        const edgeTypes = res.data.available_edge_types || ["monolink"];
        setAvailableEdgeTypes(edgeTypes);
        setSelectedEdgeType(
          edgeTypes.includes("monolink") ? "monolink" : edgeTypes[0] || ""
        );
      })
      .catch((err) => {
        console.error("Failed to fetch network parameters:", err);
        setError("Could not load network configuration options from server.");
      });
  }, [backendUrl]);

  const handleResetLayout = useCallback(
    (fit = true) => {
      if (cyRef.current && cyRef.current.nodes().length > 0) {
        const rootNodes = elements
          .filter((el) => el.data.is_root)
          .map((el) => `#${el.data.id.replace(/[^\w\s-]/gi, "\\$&")}`);

        const layoutOptions = {
          name: "breadthfirst",
          directed: true,
          spacingFactor: 1.5,
          padding: 30,
          animate: true,
          animationDuration: 500,
          avoidOverlap: true,
          fit: fit,
          ...(rootNodes.length > 0 && { roots: rootNodes }),
        };
        const layout = cyRef.current.layout(layoutOptions);
        layout.run();
      }
    },
    [elements]
  );

  // Debounced search effect
  useEffect(() => {
    if (cyRef.current && cyRef.current.nodes().length > 0) {
      cyRef.current.elements().removeClass("highlighted searched");
      if (searchTerm) {
        const searchResults = cyRef.current.nodes(`[id @*= "${searchTerm}"]`);
        searchResults.addClass("searched");
        if (searchResults.length > 0) {
          cyRef.current.animate(
            {
              fit: { eles: searchResults, padding: 50 },
            },
            { duration: 500 }
          );
        }
      }
    }
  }, [searchTerm]);

  const handleInputChange = (e) => {
    setGlycansInput(e.target.value);
    setActiveExample(null);
    if (e.target.value.trim() === "") {
      setError("");
      setWarning("");
    }
  };

  const handleGenerateNetwork = async () => {
    const glycanList = glycansInput
      .split("\n")
      .map((g) => g.trim())
      .filter((g) => g.length > 0);
    if (glycanList.length === 0) {
      setError(
        "Please enter at least one glycan structure or select an example."
      );
      setElements([]);
      setNetworkGenerated(false);
      setNetworkMetadata(null);
      return;
    }
    setIsLoading(true);
    setError("");
    setWarning("");
    setNetworkGenerated(false);
    if (cyRef.current) {
      cyRef.current.scratch("_layoutAppliedForCurrentElements", false);
    }
    setSelectedNodeInfo(null);
    setNetworkMetadata(null);
    const rootsList = permittedRootsInput
      .split(",")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    try {
      const res = await axios.post(`${backendUrl}/api/network`, {
        glycans: glycanList,
        allowed_ptms: selectedPTMs,
        permitted_roots: rootsList,
        edge_type: selectedEdgeType,
      });
      const rawElements = res.data.elements || [];
      const elementsWithIcons = rawElements.map((el) => {
        if (el.data && el.data.special_type === "lactose_derivative") {
          return { ...el, data: { ...el.data, image: magicIconDataUri } };
        }
        return el;
      });
      setElements(elementsWithIcons);
      setNetworkGenerated(true);
      setNetworkMetadata(res.data.metadata || null);
      if (elementsWithIcons.length === 0) {
        setWarning(
          "Network generation successful, but no connections or elements were found for the provided glycans with current settings."
        );
      } else if (res.data.metadata && res.data.metadata.num_nodes === 0) {
        setWarning(
          "Network generated, but it's empty. Try different parameters or input glycans."
        );
      }
    } catch (err) {
      setNetworkGenerated(false);
      setElements([]);
      setNetworkMetadata(null);
      if (err.response?.data?.error) {
        setError(`Failed to generate network: ${err.response.data.error}`);
      } else if (err.request) {
        setError(
          "Failed to generate network: No response from server. Is the backend running?"
        );
      } else {
        setError(`Failed to generate network: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (exampleSet, index) => {
    setGlycansInput(exampleSet.glycans);
    setActiveExample(index);
    setError("");
    setWarning("");
  };

  const handleExportPNG = () => {
    if (cyRef.current && elements.length > 0) {
      try {
        const pngData = cyRef.current.png({
          output: "base64uri",
          full: true,
          scale: 2,
          bg: isDarkMode ? "#1f2937" : "white",
        });
        const link = document.createElement("a");
        link.href = pngData;
        link.download = "glycan-network.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        setError("Failed to export PNG: " + err.message);
      }
    } else {
      setWarning("No graph available to export.");
    }
  };

  const cytoscapeStylesheet = [
    {
      selector: "node",
      style: {
        backgroundColor: isDarkMode ? "#4f46e5" : "#6366f1",
        label: "data(id)",
        color: isDarkMode ? "#e0e0e0" : "#ffffff",
        textValign: "center",
        textHalign: "center",
        fontSize: 10,
        textOutlineColor: isDarkMode ? "#111827" : "#4338ca",
        textOutlineWidth: 1,
        shape: "round-rectangle",
        width: "label",
        height: "label",
        padding: "10px",
        "text-wrap": "wrap",
        "text-max-width": "90px",
        "corner-radius": "15px",
        "background-image": "data(image)",
        "background-fit": "contain",
        "background-clip": "node",
        "background-opacity": 0.9,
        borderWidth: 2,
        borderColor: isDarkMode ? "#3730a3" : "#4f46e5",
        transitionProperty: "background-color, border-color",
        transitionDuration: "0.3s",
      },
    },
    {
      selector: "node[?is_input]",
      style: {
        shape: "ellipse",
        backgroundColor: isDarkMode ? "#059669" : "#10b981",
        borderColor: isDarkMode ? "#047857" : "#059669",
        textOutlineColor: isDarkMode ? "#065f46" : "#047857",
        padding: "12px",
      },
    },
    {
      selector: "node[?is_root]",
      style: {
        borderWidth: 3,
        borderStyle: "double",
        borderColor: isDarkMode ? "#f59e0b" : "#f97316",
      },
    },
    {
      selector: "edge",
      style: {
        width: 2,
        lineColor: isDarkMode ? "#6b7280" : "#9ca3af",
        targetArrowColor: isDarkMode ? "#6b7280" : "#9ca3af",
        targetArrowShape: "triangle",
        curveStyle: "bezier",
        "arrow-scale": 1,
        transitionProperty: "line-color, target-arrow-color, width",
        transitionDuration: "0.3s",
      },
    },
    {
      selector: "node:selected",
      style: {
        borderWidth: 4,
        borderColor: isDarkMode ? "#ec4899" : "#db2777",
        backgroundColor: isDarkMode ? "#be185d" : "#ec4899",
      },
    },
    {
      selector: "edge:selected",
      style: {
        lineColor: isDarkMode ? "#ec4899" : "#db2777",
        targetArrowColor: isDarkMode ? "#ec4899" : "#db2777",
        width: 3.5,
      },
    },
    {
      selector: ".highlighted",
      style: {
        backgroundColor: isDarkMode ? "#facc15" : "#eab308",
        lineColor: isDarkMode ? "#facc15" : "#eab308",
        targetArrowColor: isDarkMode ? "#facc15" : "#eab308",
        "border-color": isDarkMode ? "#ca8a04" : "#d97706",
        transitionProperty:
          "background-color, line-color, target-arrow-color, border-color",
        transitionDuration: "0.2s",
      },
    },
    {
      selector: ".searched",
      style: {
        "border-width": 4,
        "border-color": "#22d3ee",
        "text-font-weight": "bold",
      },
    },
  ];

  const togglePTM = (ptm) => {
    setSelectedPTMs((prev) =>
      prev.includes(ptm) ? prev.filter((p) => p !== ptm) : [...prev, ptm]
    );
  };

  // Effect for Cytoscape event listeners (tap)
  useEffect(() => {
    let cyInstance = null; // Store the current cy instance locally for cleanup
    if (cyRef.current) {
      cyInstance = cyRef.current; // Assign to local variable
      const handleNodeTap = (event) => {
        const node = event.target;
        setSelectedNodeInfo({ id: node.id(), data: node.data() });
        cyInstance.elements().removeClass("highlighted");
        node.addClass("highlighted");
        node.connectedEdges().addClass("highlighted");
        node.neighborhood().nodes().addClass("highlighted");
      };
      const handleBackgroundTap = (event) => {
        if (event.target === cyInstance) {
          setSelectedNodeInfo(null);
          cyInstance.elements().removeClass("highlighted");
        }
      };

      cyInstance.on("tap", "node", handleNodeTap);
      cyInstance.on("tap", handleBackgroundTap);

      return () => {
        if (cyInstance && !cyInstance.destroyed()) {
          cyInstance.removeListener("tap", "node", handleNodeTap);
          cyInstance.removeListener("tap", handleBackgroundTap);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cyRef.current]); // Only re-run if cyRef.current changes

  // Effect for applying layout when elements change and network is generated
  useEffect(() => {
    if (
      cyRef.current &&
      elements.length > 0 &&
      networkGenerated &&
      cyRef.current.nodes().length > 0
    ) {
      if (!cyRef.current.scratch("_layoutAppliedForCurrentElements")) {
        handleResetLayout(true);
        cyRef.current.scratch("_layoutAppliedForCurrentElements", true);
      }
    } else if (cyRef.current && cyRef.current.nodes().length === 0) {
      cyRef.current.scratch("_layoutAppliedForCurrentElements", false);
    }
  }, [elements, networkGenerated, handleResetLayout]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleCyRef = useCallback((cyInstance) => {
    cyRef.current = cyInstance;
  }, []);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
      } transition-colors duration-300 font-sans`}
    >
      <div className="p-4 md:p-6 max-w-full mx-auto">
        <AppHeader isDarkMode={isDarkMode} onToggleDarkMode={setIsDarkMode} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <ControlsColumn
            glycansInput={glycansInput}
            onGlycansInputChange={handleInputChange}
            exampleGlycanSets={exampleGlycanSets} // Passed down
            activeExample={activeExample}
            onExampleClick={handleExampleClick}
            showAdvanced={showAdvanced}
            onToggleAdvanced={() => setShowAdvanced((prev) => !prev)}
            permittedRootsInput={permittedRootsInput}
            onPermittedRootsInputChange={(e) =>
              setPermittedRootsInput(e.target.value)
            }
            selectedEdgeType={selectedEdgeType}
            onSelectedEdgeTypeChange={(e) =>
              setSelectedEdgeType(e.target.value)
            }
            availableEdgeTypes={availableEdgeTypes}
            selectedPTMs={selectedPTMs}
            onTogglePTM={togglePTM}
            availablePTMs={availablePTMs}
            isLoading={isLoading}
            onGenerateNetwork={handleGenerateNetwork}
            onResetLayout={handleResetLayout}
            onExportPNG={handleExportPNG}
            canPerformActions={elements.length > 0}
            selectedNodeInfo={selectedNodeInfo}
            networkMetadata={networkMetadata}
            isDarkMode={isDarkMode}
          />

          <GraphVisualization
            searchTerm={searchTerm}
            onSearchTermChange={(e) => setSearchTerm(e.target.value)}
            error={error}
            warning={warning}
            networkGenerated={networkGenerated}
            elements={elements}
            cytoscapeStylesheet={cytoscapeStylesheet}
            onCyRef={handleCyRef}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
};

export default BiosyntheticNetworks;
