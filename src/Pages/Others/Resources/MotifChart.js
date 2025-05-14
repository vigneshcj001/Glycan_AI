import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import { FiHelpCircle } from "react-icons/fi";
import { FaMagic } from "react-icons/fa";

const MotifChart = () => {
  const [sequence, setSequence] = useState("");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [n, setN] = useState(100);
  const [nMut, setNMut] = useState(1);
  const [mode, setMode] = useState("normal");
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!sequence.trim()) {
      setError("Please enter a glycan sequence before analyzing.");
      return;
    }

    setLoading(true);
    setError("");
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
      setError("Server error occurred while analyzing the motifs.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        🧬 Glycan Motif Mutation Visualizer
      </h1>

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

      {error && (
        <div className="text-red-600 text-sm mb-4 font-semibold">{error}</div>
      )}

      <button
        onClick={() =>
          setSequence("GlcNAc(b1-4)Gal(b1-3)GlcNAc(b1-6)Gal(b1-4)Glc")
        }
        className="flex items-center text-sm text-purple-600 hover:text-purple-800 transition mb-6"
        title="Insert example glycan sequence"
      >
        <FaMagic className="mr-1" />
        Example
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          />
          <p className="text-xs text-gray-500 mt-1">
            Positions to mutate per glycan variant.
          </p>
        </div>

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
          />
          <p className="text-xs text-gray-500 mt-1">
            Total glycan mutants to generate.
          </p>
        </div>

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
            <strong>Normal</strong>: Conservative changes. <br />
            <strong>Extreme</strong>: Radical reshuffling.
          </p>
        </div>
      </div>

      <button
        onClick={analyze}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-200"
      >
        {loading ? "Analyzing..." : "🔍 Analyze Motifs"}
      </button>

      {chartData && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">
              📊 Motif Frequency Distribution
            </h2>
            <button
              onClick={() => setShowHelp(true)}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <FiHelpCircle size={22} className="mr-1" />
              Help
            </button>
          </div>

          <Bar
            data={chartData}
            options={{ plugins: { legend: { display: false } } }}
          />

          {showHelp && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md overflow-y-auto max-h-[80vh]">
                <h3 className="text-lg font-bold mb-2 text-gray-800">
                  📘 Understanding the Motif Analysis
                </h3>
                <ul className="list-disc ml-5 text-sm text-gray-700 space-y-3">
                  <li>
                    <strong>Glycan Sequence:</strong>
                    <p className="ml-4">
                      The input is a linear sugar chain using IUPAC format (e.g.{" "}
                      <code>GlcNAc(b1-4)Gal(b1-3)...</code>). This is the base
                      structure that gets mutated.
                    </p>
                  </li>

                  <li>
                    <strong>Mutation Depth:</strong>
                    <p className="ml-4">
                      Controls how many sugar units or bonds are changed in each
                      mutant. A higher value means deeper structural edits.
                    </p>
                  </li>

                  <li>
                    <strong>Mutant Samples:</strong>
                    <p className="ml-4">
                      Number of variants to generate. More samples give a richer
                      understanding of common structural changes.
                    </p>
                  </li>

                  <li>
                    <strong>Mutation Intensity:</strong>
                    <p className="ml-4">
                      <strong>Normal:</strong> Random but sensible swaps.
                      <br />
                      <strong>Extreme:</strong> Random radical mutations in
                      sugars and linkages, simulating highly diverse motifs.
                    </p>
                  </li>

                  <li>
                    <strong>Result - Motif Frequency:</strong>
                    <p className="ml-4">
                      After mutating, all short patterns ("motifs") are
                      extracted from the variants. These motifs are counted and
                      displayed as a bar chart. Frequent motifs might indicate
                      structural importance or resilience.
                    </p>
                  </li>
                </ul>

                <p className="text-sm text-gray-700 mt-4">
                  This tool helps explore glycan mutation patterns and their
                  structural impact—ideal for experimental planning in
                  glycomics.
                </p>

                <div className="text-right mt-6">
                  <button
                    onClick={() => setShowHelp(false)}
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                  >
                    Got it
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MotifChart;
