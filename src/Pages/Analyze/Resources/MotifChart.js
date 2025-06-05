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
  const [expandedSteps, setExpandedSteps] = useState([]);

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

  // Toggle accordion steps in help modal
  const toggleStep = (idx) => {
    if (expandedSteps.includes(idx)) {
      setExpandedSteps(expandedSteps.filter((i) => i !== idx));
    } else {
      setExpandedSteps([...expandedSteps, idx]);
    }
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
            <div
              className="fixed inset-0 flex items-center justify-center p-6"
              style={{
                background: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.1))", // transparentish overlay
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                zIndex: 9999,
              }}
            >
              <div className="bg-white bg-opacity-90 rounded-lg p-6 max-w-lg shadow-lg relative max-h-[80vh] overflow-y-auto">
                <button
                  onClick={() => setShowHelp(false)}
                  className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
                  aria-label="Close help"
                >
                  ×
                </button>
                <h3 className="text-lg font-semibold mb-4 text-center">
                  Help: How Motif Frequencies are Calculated
                </h3>

                <p className="mb-4 italic text-gray-700">
                  This visualization is powered by a backend process that
                  simulates glycan mutations and extracts recurring motifs to
                  reveal important glycan features.
                </p>

                {[
                  {
                    title: "1. Input Parsing & Tokenization",
                    content: (
                      <>
                        <p>
                          The input glycan sequence is split into a list of
                          sugar units and bond types, removing brackets and
                          special characters.
                        </p>
                        <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-x-auto">
                          {`Example: 
"GlcNAc(b1-4)Gal(b1-3)" 
→ ["GlcNAc", "b1-4", "Gal", "b1-3"]`}
                        </pre>
                      </>
                    ),
                  },
                  {
                    title: "2. Mutation Simulation",
                    content: (
                      <>
                        <p>
                          Depending on the mutation depth and mode, random
                          sugars or bonds are replaced in the sequence at
                          randomly selected positions.
                        </p>
                        <p>
                          Positions alternate between sugars (even indices) and
                          bonds (odd indices).
                        </p>
                        <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-x-auto">
                          {`For each mutant:
- Select positions to mutate
- Replace with random sugar or bond`}
                        </pre>
                      </>
                    ),
                  },
                  {
                    title: "3. Motif Extraction",
                    content: (
                      <>
                        <p>
                          Mutated sequences are scanned for motifs —
                          fixed-length sliding windows of sugars + bonds (length
                          5 units).
                        </p>
                        <p>
                          These motifs represent recurring structural features
                          in the glycans.
                        </p>
                        <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-x-auto">
                          {`Extract motifs:
["GlcNAc*b1-4*Gal*b1-3*GlcNAc", ...]`}
                        </pre>
                      </>
                    ),
                  },
                  {
                    title: "4. Frequency Counting",
                    content: (
                      <>
                        <p>
                          All motifs from all mutants are combined and counted
                          to produce frequency statistics.
                        </p>
                        <p>
                          The higher the frequency, the more conserved or common
                          the motif.
                        </p>
                        <pre className="bg-gray-100 p-2 rounded mt-2 text-sm overflow-x-auto">
                          {`Count occurrences:
{
  "GlcNAc*b1-4*Gal*b1-3*GlcNAc": 42,
  "Gal*b1-3*GlcNAc*b1-6*Gal": 37,
  ...
}`}
                        </pre>
                      </>
                    ),
                  },
                  {
                    title: "5. Visualization",
                    content: (
                      <>
                        <p>
                          Frequencies are sent back to the frontend and
                          displayed in a bar chart, enabling visual
                          interpretation of glycan motif conservation under
                          mutation.
                        </p>
                      </>
                    ),
                  },
                ].map(({ title, content }, idx) => (
                  <div
                    key={idx}
                    className="mb-4 border border-gray-300 rounded"
                  >
                    <button
                      onClick={() => toggleStep(idx)}
                      className="w-full text-left px-4 py-2 font-semibold bg-gray-200 hover:bg-gray-300 flex justify-between items-center"
                    >
                      <span>{title}</span>
                      <span>{expandedSteps.includes(idx) ? "−" : "+"}</span>
                    </button>
                    {expandedSteps.includes(idx) && (
                      <div className="px-4 py-3 bg-white text-gray-800">
                        {content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MotifChart;
