import React, { useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import axios from "axios";
import { FaMagic } from "react-icons/fa";

const magicIconDataUri =
  "data:image/svg+xml,%3csvg fill='%237c3aed' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath d='M10 2v2H8v2H6v2H4v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h-2V6h-2V4h-2V2h-2zm1 7h2v5h-2v-5z' /%3e%3c/svg%3e";

const GlycanNetwork = () => {
  const [glycans, setGlycans] = useState("");
  const [elements, setElements] = useState([]);

  const handleSubmit = async () => {
    const glycanList = glycans
      .split("\n")
      .map((g) => g.trim())
      .filter((g) => g.length > 0);
    try {
      const res = await axios.post("http://localhost:5000/api/network", {
        glycans: glycanList,
      });
     
      const elementsWithIcons = res.data.elements.map((el) => {
        if (el.data && el.data.id === "Gal(b1-4)Glc-ol") {
          return { ...el, data: { ...el.data, image: magicIconDataUri } };
        }
        return el;
      });

      setElements(elementsWithIcons);
    } catch (err) {
      alert("Failed to fetch biosynthetic network.");
      console.error(err);
    }
  };

  const autofillExample = () => {
    const exampleGlycans = [
      "Gal(b1-4)Glc-ol",
      "GlcNAc(b1-3)Gal(b1-4)Glc-ol",
      "GlcNAc6S(b1-3)Gal(b1-4)Glc-ol",
      "Gal(b1-4)GlcNAc(b1-3)Gal(b1-4)Glc-ol",
      "Fuc(a1-2)Gal(b1-4)Glc-ol",
      "Gal(b1-4)GlcNAc(b1-3)[Gal(b1-3)GlcNAc(b1-6)]Gal(b1-4)Glc-ol",
    ].join("\n");
    setGlycans(exampleGlycans);
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-r from-blue-200 to-blue-100">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 space-y-4">
        <h1 className="text-3xl font-bold text-center text-blue-800">
          Glycan Biosynthetic Network
        </h1>

        <div className="relative">
          <textarea
            rows="6"
            className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 font-mono"
            placeholder="Enter Glycan Structures (IUPAC-condensed format)"
            value={glycans}
            onChange={(e) => setGlycans(e.target.value)}
          />
          <button
            onClick={autofillExample}
            className="absolute top-2 right-2 text-purple-600 hover:text-purple-800"
            title="Fill with sample glycans"
          >
            <FaMagic size={20} />
          </button>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Generate Network
          </button>
        </div>

        {elements.length > 0 && (
          <div className="mt-6">
            <CytoscapeComponent
              elements={elements}
              style={{ width: "100%", height: "500px" }}
              layout={{ name: "breadthfirst" }}
              stylesheet={[
                {
                  selector: "node",
                  style: {
                    backgroundColor: "#7c3aed",
                    label: "data(id)",
                    color: "#fff",
                    textValign: "center",
                    textHalign: "center",
                    fontSize: 14,
                    textOutlineColor: "#000",
                    textOutlineWidth: 2,
                    backgroundImage: "data(image)",
                    backgroundFit: "contain",
                    backgroundClip: "node",
                    backgroundOpacity: 0.5,
                  },
                },
                {
                  selector: "edge",
                  style: {
                    width: 2,
                    lineColor: "#9ca3af",
                    targetArrowColor: "#9ca3af",
                    targetArrowShape: "triangle",
                    curveStyle: "bezier",
                  },
                },
              ]}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GlycanNetwork;
