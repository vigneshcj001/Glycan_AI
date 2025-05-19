import React, { useState } from "react";
import Select from "react-select";

const ranks = [
  { value: "Kingdom", label: "Kingdom" },
  { value: "Domain", label: "Domain" },
  { value: "Phylum", label: "Phylum" },
  { value: "Class", label: "Class" },
  { value: "Order", label: "Order" },
  { value: "Family", label: "Family" },
  { value: "Genus", label: "Genus" },
  { value: "Species", label: "Species" },
  { value: "Subspecies", label: "Subspecies" },
  { value: "Variety", label: "Variety" },
  { value: "Form", label: "Form" },
];

const CharacterizeForm = () => {
  const [formData, setFormData] = useState({
    mono: "D-Rha",
    rank: ranks[0],
    focus: "Bacteria",
    modifications: true,
    thresh: 10,
  });

  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSelectChange = (selected, name) => {
    setFormData((prev) => ({ ...prev, [name]: selected }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setImage(null);
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/characterize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sugar: formData.mono,
          rank: formData.rank.value,
          focus: formData.focus,
          modifications: formData.modifications,
          thresh: Number(formData.thresh),
        }),
      });

      const result = await response.json();
      if (result.image) {
        setImage(`data:image/png;base64,${result.image}`);
      } else {
        setError(result.error || "Unknown error occurred");
      }
    } catch (err) {
      setError("Error: Failed to fetch from server");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
        Glycan Characterization
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
        noValidate
      >
        <div className="space-y-4">
          {/* Monosaccharide input */}
          <label className="block">
            <span className="text-gray-700 font-semibold mb-1 block">
              Monosaccharide
            </span>
            <input
              type="text"
              name="mono"
              value={formData.mono}
              onChange={handleChange}
              placeholder="e.g. D-Rha"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </label>

          {/* Rank dropdown */}
          <label className="block">
            <span className="text-gray-700 font-semibold mb-1 block">Rank</span>
            <Select
              options={ranks}
              value={formData.rank}
              onChange={(selected) => handleSelectChange(selected, "rank")}
              className="rounded"
            />
          </label>

          {/* Focus input */}
          <label className="block">
            <span className="text-gray-700 font-semibold mb-1 block">
              Focus
            </span>
            <input
              type="text"
              name="focus"
              value={formData.focus}
              onChange={handleChange}
              placeholder="e.g. Bacteria"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </label>

          {/* Threshold slider */}
          <label className="block">
            <span className="text-gray-700 font-semibold mb-1 block">
              Threshold: {formData.thresh}
            </span>
            <input
              name="thresh"
              type="range"
              min="1"
              max="50"
              value={formData.thresh}
              onChange={handleChange}
              className="w-full"
            />
          </label>

          {/* Modifications toggle */}
          <div className="flex items-center space-x-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="modifications"
                checked={formData.modifications}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-purple-600 peer-focus:ring-4 peer-focus:ring-purple-300 transition-all"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-full"></div>
            </label>
            <span className="text-gray-700 font-semibold">
              Consider Modifications
            </span>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded text-white font-semibold ${
              loading
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-700 hover:bg-purple-800"
            } transition-colors`}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <p className="mt-4 text-center text-red-600 font-semibold">{error}</p>
      )}

      {/* Image display */}
      {image && (
        <div className="mt-6">
          <img
            src={image}
            alt="Result"
            className="mx-auto rounded shadow-lg max-w-full"
          />
        </div>
      )}
    </div>
  );
};

export default CharacterizeForm;
