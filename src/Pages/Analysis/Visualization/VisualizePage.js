import React, { useState } from "react";
import axios from "axios";

const VisualizePage = () => {
  const [glycanCode, setGlycanCode] = useState("");
  const [glycanImage, setGlycanImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    if (!glycanCode) {
      alert("Please enter a glycan code.");
      return;
    }
    try {
      setLoading(true);
      // Send request to the backend
      const response = await axios.post("/api/visualize", { glycanCode });
      console.log("Response from server:", response.data); // Log full response
      setGlycanImage(response.data.imageUrl); // Get image URL from backend
    } catch (error) {
      console.error("Error visualizing glycan:", error); // Log detailed error
      alert(
        "Error visualizing glycan structure. Check the console for details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Glycan Structure Visualization
      </h1>
      <input
        type="text"
        value={glycanCode}
        onChange={(e) => setGlycanCode(e.target.value)}
        placeholder="Enter glycan code (e.g., Man(a1-2)Man(a1-3)GlcNAc)"
        className="border p-2 mr-2"
      />
      <button
        onClick={handleButtonClick}
        className="bg-blue-500 text-white p-2 rounded mt-2"
        disabled={loading}
      >
        {loading ? "Loading..." : "Visualize Glycan Structure"}
      </button>
      {glycanImage && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Visualization</h2>
          <img
            src={glycanImage}
            alt="Glycan structure"
            className="border rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default VisualizePage;
