import React, { useState } from "react";
import axios from "axios";

const Prediction = () => {
  const [model, setModel] = useState("LSTM");
  const [glycanSequence, setGlycanSequence] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5001/infer", {
        glycan_sequence: glycanSequence,
        model: model,
      });
      setResult(response.data.result);
    } catch (err) {
      setError(err.response ? err.response.data.error : err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-700">
        Glycan Immunogenicity Prediction
      </h1>

      <div className="mb-4">
        <label
          htmlFor="glycanSequence"
          className="block text-lg font-medium text-gray-600"
        >
          Glycan Sequence:
        </label>
        <textarea
          id="glycanSequence"
          value={glycanSequence}
          onChange={(e) => setGlycanSequence(e.target.value)}
          placeholder="Enter glycan sequence here"
          className="w-full p-4 border border-gray-300 rounded-md text-lg"
          rows="6"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="model"
          className="block text-lg font-medium text-gray-600"
        >
          Model:
        </label>
        <select
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md text-lg"
        >
          <option value="LSTM">LSTM</option>
          <option value="GAT">GAT</option>
          <option value="GIN">GIN</option>
          <option value="MPNN">MPNN</option>
        </select>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full p-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
      >
        Submit
      </button>

      {result && (
        <div className="mt-6 p-4 border border-green-300 bg-green-50 rounded-md">
          <h2 className="text-2xl font-medium text-green-700">
            Prediction Result:
          </h2>
          <pre className="text-gray-800 mt-4">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 border border-red-300 bg-red-50 rounded-md">
          <strong className="text-red-600">Error:</strong> {error}
        </div>
      )}
    </div>
  );
};

export default Prediction;
