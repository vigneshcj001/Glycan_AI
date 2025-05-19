import React, { useState } from "react";
import axios from "axios";

const GlycanConverter = () => {
  const [glycan, setGlycan] = useState("");
  const [format, setFormat] = useState("iupac");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState("");

  const handleConvert = async () => {
    setLoading(true);
    setError("");
    setOutput(null);

    try {
      const response = await axios.post("http://localhost:5000/convert", {
        glycan,
        input_format: format,
      });
      setOutput(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-lg space-y-6">
      <h1 className="text-3xl font-bold text-center text-indigo-600">
        🧬 Glycan Format Converter
      </h1>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Input Format:
        </label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="iupac">IUPAC</option>
          <option value="glycoct">GlycoCT</option>
          <option value="wurcs">WURCS</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Enter Glycan:
        </label>
        <textarea
          value={glycan}
          onChange={(e) => setGlycan(e.target.value)}
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-md"
          placeholder="Paste your glycan structure here..."
        />
      </div>

      <button
        onClick={handleConvert}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-200"
      >
        {loading ? "Converting..." : "Convert Glycan"}
      </button>

      {error && (
        <div className="text-red-600 font-medium text-center">{error}</div>
      )}

      {output && (
        <div className="bg-gray-50 p-4 rounded-md space-y-3 border mt-4">
          <h2 className="text-lg font-semibold text-indigo-700">
            Conversion Result:
          </h2>
          {output.canonical_iupac && (
            <div>
              <strong>IUPAC:</strong>
              <pre className="whitespace-pre-wrap text-sm">
                {output.canonical_iupac}
              </pre>
            </div>
          )}
          {output.smiles && (
            <div>
              <strong>SMILES:</strong>
              <pre className="whitespace-pre-wrap text-sm">{output.smiles}</pre>
            </div>
          )}
          {output.iupac && (
            <div>
              <strong>IUPAC:</strong>
              <pre className="whitespace-pre-wrap text-sm">{output.iupac}</pre>
            </div>
          )}
          {output.glycoct && (
            <div>
              <strong>GlycoCT:</strong>
              <pre className="whitespace-pre-wrap text-sm">
                {output.glycoct}
              </pre>
            </div>
          )}
          {output.wurcs && (
            <div>
              <strong>WURCS:</strong>
              <pre className="whitespace-pre-wrap text-sm">{output.wurcs}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlycanConverter;
