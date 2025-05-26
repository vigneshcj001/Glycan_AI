import React, { useState } from "react";
import { FaMagic, FaSpinner } from "react-icons/fa";

const Prediction = () => {
  const [sequence, setSequence] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const example = "GlcNAc(β1-4)Gal(α1-3)Fuc(β1-2)GalNAc";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ glycan_sequence: sequence }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Prediction failed");
      }

      setPrediction(data.prediction);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-xl p-8 space-y-6 border border-blue-100">
        <h1 className="text-3xl font-bold text-center text-blue-700">
          🧬 Glycan Immunogenicity Predictor
        </h1>

        <p className="text-center text-gray-600">
          Paste a glycan sequence below to check its immunogenic potential.
        </p>

        <button
          onClick={() => {
            setSequence(example);
            setPrediction(null);
            setError(null);
          }}
          className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200 transition mx-auto"
        >
          <FaMagic />
          Try Example
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
              placeholder="Enter Glycan Sequence (e.g., GlcNAc(β1-4)Gal...)"
              className="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-md text-lg hover:bg-blue-700 transition flex items-center justify-center"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Predicting...
              </>
            ) : (
              "Predict"
            )}
          </button>
        </form>

        {error && (
          <div className="text-red-600 text-center font-medium mt-2">
            ⚠️ {error}
          </div>
        )}

        {prediction !== null && (
          <div
            className={`text-center mt-6 p-4 rounded-lg font-bold text-lg ${
              prediction === 1
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-yellow-100 text-yellow-800 border border-yellow-300"
            }`}
          >
            Result: {prediction === 1 ? "✅ Immunogenic" : "🟡 Non-Immunogenic"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Prediction;
