import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const MotifChart = () => {
  const [sequence, setSequence] = useState(
    "GlcNAc(b1-4)Gal(b1-3)GlcNAc(b1-6)Gal(b1-4)Glc"
  );
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [n, setN] = useState(100);
  const [nMut, setNMut] = useState(1);
  const [mode, setMode] = useState("normal");

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/motif/mutate", {
        sequence,
        n_mut: nMut,
        n,
        mode,
      });

      const freq = res.data.motif_frequencies;
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);

      setChartData({
        labels: sorted.map(([k]) => k),
        datasets: [
          {
            label: "Motif Frequency",
            data: sorted.map(([, v]) => v),
            backgroundColor: "rgba(34,197,94,0.6)",
          },
        ],
      });
    } catch (err) {
      console.error("Axios error:", err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🧬 Glycan Motif Mutation Visualizer
      </h1>

      {/* Glycan Sequence Input */}
      <label className="block mb-2 font-semibold text-gray-700">
        🧪 Glycan Sequence
      </label>
      <textarea
        value={sequence}
        onChange={(e) => setSequence(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded mb-2"
        rows="4"
        placeholder="Enter glycan sequence, e.g., GlcNAc(b1-4)Gal(b1-3)..."
      />
      <p className="text-sm text-gray-500 mb-4">
        Input a linear glycan chain using IUPAC-style representation.
      </p>

      {/* Control Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Number of Mutations */}
        <div>
          <label className="block font-semibold text-gray-700">
            🔁 Mutation Depth
          </label>
          <input
            type="number"
            value={nMut}
            min={1}
            onChange={(e) => setNMut(Number(e.target.value))}
            className="border p-2 rounded w-full"
            placeholder="Number of mutations per variant"
          />
          <p className="text-xs text-gray-500 mt-1">
            Number of positions to mutate per generated motif.
          </p>
        </div>

        {/* Number of Mutated Variants */}
        <div>
          <label className="block font-semibold text-gray-700">
            🧬 Mutant Samples
          </label>
          <input
            type="number"
            value={n}
            min={10}
            onChange={(e) => setN(Number(e.target.value))}
            className="border p-2 rounded w-full"
            placeholder="Total mutants to generate"
          />
          <p className="text-xs text-gray-500 mt-1">
            Total number of mutated variants to generate and analyze.
          </p>
        </div>

        {/* Mutation Intensity */}
        <div>
          <label className="block font-semibold text-gray-700">
            🌪️ Mutation Intensity
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="normal">Normal</option>
            <option value="extreme">Extreme</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            <strong>Normal</strong>: Conservative mutation. <br />
            <strong>Extreme</strong>: Radical motif reshuffling.
          </p>
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={analyze}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-200"
      >
        {loading ? "Analyzing..." : "🔍 Analyze Motifs"}
      </button>

      {/* Chart Output */}
      {chartData && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">
            📊 Motif Frequency Distribution
          </h2>
          <Bar
            data={chartData}
            options={{ plugins: { legend: { display: false } } }}
          />
        </div>
      )}
    </div>
  );
};

export default MotifChart;
