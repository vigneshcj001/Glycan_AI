import React, { useState } from "react";
import axios from "axios";
import { FaMagic, FaCheckCircle } from "react-icons/fa";

const SequenceAlignment = () => {
  const [sequence1, setSequence1] = useState("");
  const [sequence2, setSequence2] = useState("");
  const [alignmentResult, setAlignmentResult] = useState(null);
  const [error, setError] = useState(null);

  const examplePairs = [
    {
      seq1: "GlcNAc(β1-4)Gal(α1-3)Fuc(β1-2)GalNAc",
      seq2: "GlcNAc(β1-4)Gal(α1-3)Fuc(α1-6)Glc",
    },
    {
      seq1: "Neu5Ac(α2-6)Gal(β1-4)GlcNAc",
      seq2: "Gal(β1-3)GalNAc(α1-6)Gal",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setAlignmentResult(null);

    const cleanSeq1 = sequence1.trim().replace(/\s+/g, "");
    const cleanSeq2 = sequence2.trim().replace(/\s+/g, "");

    if (!cleanSeq1 || !cleanSeq2) {
      setError("Please enter both glycan sequences.");
      return;
    }

    try {
      const payload = { sequence1: cleanSeq1, sequence2: cleanSeq2 };
      const response = await axios.post(
        "http://localhost:5000/align",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setAlignmentResult(response.data.alignment);
    } catch (err) {
      if (err.response) {
        setError(`Server error: ${err.response.data.error || err.message}`);
      } else {
        setError("Failed to connect to the alignment server.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-6 border border-blue-100">
        <h1 className="text-3xl font-bold text-center text-blue-700">
          🧬 Glycan Sequence Alignment Tool
        </h1>

        <p className="text-center text-gray-600">
          Paste or auto-fill glycan sequences below and align them using our
          custom engine.
        </p>

        {/* Auto-Fill Examples */}
        <div className="flex flex-wrap gap-4 justify-center">
          {examplePairs.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSequence1(ex.seq1);
                setSequence2(ex.seq2);
                setAlignmentResult(null);
                setError(null);
              }}
              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full hover:bg-blue-200 transition"
            >
              <FaMagic />
              Try Example {idx + 1}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sequence 1
            </label>
            <input
              type="text"
              value={sequence1}
              onChange={(e) => setSequence1(e.target.value)}
              placeholder="Enter first glycan sequence"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sequence 2
            </label>
            <input
              type="text"
              value={sequence2}
              onChange={(e) => setSequence2(e.target.value)}
              placeholder="Enter second glycan sequence"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md text-lg hover:bg-blue-700 transition"
          >
            Align Sequences
          </button>
        </form>

        {/* Result or Error */}
        {error && (
          <div className="text-red-600 text-center font-medium mt-4">
            ⚠️ {error}
          </div>
        )}

        {alignmentResult && (
          <div className="bg-green-50 border border-green-200 rounded p-4 mt-6">
            <h2 className="text-xl font-bold text-green-700 flex items-center gap-2">
              <FaCheckCircle />
              Alignment Results
            </h2>
            <pre className="mt-2 text-gray-800 whitespace-pre-wrap">
              <strong>Sequence 1:</strong> {alignmentResult.seq1}
              {"\n"}
              <strong>Match Line:</strong> {alignmentResult.match_line}
              {"\n"}
              <strong>Sequence 2:</strong> {alignmentResult.seq2}
              {"\n"}
              <strong>Score:</strong> {alignmentResult.score}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SequenceAlignment;
