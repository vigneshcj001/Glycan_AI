import React, { useState } from "react";
import axios from "axios";

const SequenceAlignment = () => {
  const [sequence1, setSequence1] = useState("");
  const [sequence2, setSequence2] = useState("");
  const [alignmentResult, setAlignmentResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/align", {
        sequence1,
        sequence2,
      });

      setAlignmentResult(response.data.alignment);
      setError(null); // Clear any previous error
    } catch (err) {
      console.error("Error:", err);
      if (err.response) {
        // Response received but with an error code
        setError(
          `Error aligning glycans: ${err.response.data.error || err.message}`
        );
      } else if (err.request) {
        // No response received from the server
        console.error("No response received:", err.request);
        setError("No response received from the server.");
      } else {
        // Something else went wrong
        console.error("Error message:", err.message);
        setError("An unknown error occurred.");
      }
      setAlignmentResult(null); // Clear any previous result
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Glycan Sequence Alignment</h1>

      {/* Add margin-top to form to move it further down */}
      <form onSubmit={handleSubmit} className="mt-8">
        <div className="mb-4">
          <label className="block text-sm font-medium">Sequence 1</label>
          <input
            type="text"
            value={sequence1}
            onChange={(e) => setSequence1(e.target.value)}
            placeholder="Enter first glycan sequence"
            className="border p-2 w-full mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Sequence 2</label>
          <input
            type="text"
            value={sequence2}
            onChange={(e) => setSequence2(e.target.value)}
            placeholder="Enter second glycan sequence"
            className="border p-2 w-full mt-1"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {/* Error message with margin-top */}
      {error && <div className="mt-4 text-red-500">{error}</div>}

      {/* Alignment results section with margin-top */}
      {alignmentResult && (
        <div className="mt-8">
          <h2 className="text-xl font-bold">Alignment Results</h2>
          <pre className="bg-gray-100 p-4">
            <strong>Sequence 1:</strong> {alignmentResult.seq1}
            <br />
            <strong>Match Line:</strong> {alignmentResult.match_line}
            <br />
            <strong>Sequence 2:</strong> {alignmentResult.seq2}
            <br />
            <strong>Alignment Score:</strong> {alignmentResult.score}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SequenceAlignment;
