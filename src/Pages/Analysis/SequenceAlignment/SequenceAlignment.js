import React, { useState } from "react";
import axios from "axios";
import { FaMagic, FaDownload, FaChartBar, FaCheckCircle } from "react-icons/fa";
import Papa from "papaparse";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#10B981", "#EF4444"]; // Match: green, Mismatch: red

const SequenceAlignment = () => {
  const [pairs, setPairs] = useState([{ seq1: "", seq2: "" }]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const handleInputChange = (index, field, value) => {
    const newPairs = [...pairs];
    newPairs[index][field] = value;
    setPairs(newPairs);
  };

  const handleAddPair = () => {
    setPairs([...pairs, { seq1: "", seq2: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResults([]);
    setLoading(true);
    try {
      const allResults = await Promise.all(
        pairs.map((pair) =>
          axios.post("http://localhost:5000/align", {
            sequence1: pair.seq1.trim(),
            sequence2: pair.seq2.trim(),
          })
        )
      );
      setResults(allResults.map((res) => res.data.alignment));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to align sequences.");
    } finally {
      setLoading(false);
    }
  };

  const applyExample = (pair) => {
    setPairs([{ seq1: pair.seq1, seq2: pair.seq2 }]);
    setResults([]);
    setError(null);
  };

  const downloadCSV = () => {
    const csvData = results.map((res, idx) => ({
      Sequence1: pairs[idx].seq1,
      Sequence2: pairs[idx].seq2,
      Aligned1: res.seq1,
      MatchLine: res.match_line,
      Aligned2: res.seq2,
      Score: res.score.toFixed(2),
      Observation: res.observation,
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "glycan_alignments.csv";
    link.click();
  };

  const extractChartData = (observation) => {
    const match = observation?.match(/(\d+)\s+out of\s+(\d+)/);
    if (!match) return [];
    const matched = parseInt(match[1]);
    const total = parseInt(match[2]);
    return [
      { name: "Matches", value: matched },
      { name: "Mismatches", value: total - matched },
    ];
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-2xl rounded-xl mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        🔬 Glycan Sequence Aligner
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {pairs.map((pair, idx) => (
          <div key={idx} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-semibold text-gray-700">
                Sequence 1
              </label>
              <textarea
                value={pair.seq1}
                onChange={(e) => handleInputChange(idx, "seq1", e.target.value)}
                className="w-full border border-blue-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                rows="3"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700">
                Sequence 2
              </label>
              <textarea
                value={pair.seq2}
                onChange={(e) => handleInputChange(idx, "seq2", e.target.value)}
                className="w-full border border-blue-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400"
                rows="3"
                required
              />
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleAddPair}
            className="bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded hover:bg-blue-200"
          >
            ➕ Add Pair
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-2 px-6 rounded-full text-lg font-semibold hover:opacity-90"
          >
            {loading ? "Aligning..." : "Align Sequences"}
          </button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-blue-700">🧬 Results</h3>
            <button
              onClick={downloadCSV}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
            >
              <FaDownload className="inline mr-2" /> Export CSV
            </button>
          </div>

          {results.map((result, idx) => (
            <div
              key={idx}
              className="mt-6 p-6 bg-blue-50 border-l-4 border-blue-400 rounded-lg"
            >
              <h3 className="text-xl font-bold text-blue-700 mb-2">
                Pair {idx + 1}
              </h3>
              <pre className="whitespace-pre-wrap font-mono">{result.seq1}</pre>
              <pre className="whitespace-pre-wrap font-mono text-green-700">
                {result.match_line}
              </pre>
              <pre className="whitespace-pre-wrap font-mono">{result.seq2}</pre>
              <p className="mt-2 text-lg font-semibold text-blue-700">
                🎯 Score:{" "}
                <span className="text-black">{result.score.toFixed(2)}</span>
              </p>
              <p className="text-md text-gray-700">🧪 {result.observation}</p>

              <div className="mt-4 w-full sm:w-1/2">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={extractChartData(result.observation)}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label
                      dataKey="value"
                    >
                      {extractChartData(result.observation).map(
                        (entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <button className="mt-4 text-sm text-blue-600 underline flex items-center">
                <FaChartBar className="mr-1" /> View Glycan Visualization
                (Coming Soon)
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-600 mt-4 font-semibold">{error}</p>}

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          ✨ Try an Example:
        </h2>
        <div className="flex flex-wrap gap-4">
          {examplePairs.map((pair, index) => (
            <button
              key={index}
              onClick={() => applyExample(pair)}
              className="bg-gray-100 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg shadow"
            >
              <FaMagic className="inline mr-2" /> Example {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SequenceAlignment;
