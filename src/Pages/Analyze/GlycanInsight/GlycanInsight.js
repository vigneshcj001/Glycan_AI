import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {
  FaDna,
  FaLeaf,
  FaVial,
  FaDisease,
  FaExclamationCircle,
  FaMagic,
} from "react-icons/fa";

// Register Chart.js components for the doughnut chart
ChartJS.register(ArcElement, Tooltip, Legend);

// Self-contained helper components
const GlycanLogo = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 100 100"
    className="inline-block mr-3 text-cyan-400"
  >
    <path
      d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="5"
    />
    <path d="M50 50 L85 30" fill="none" stroke="currentColor" strokeWidth="5" />
    <path d="M50 50 L15 30" fill="none" stroke="currentColor" strokeWidth="5" />
    <path d="M50 50 L15 70" fill="none" stroke="currentColor" strokeWidth="5" />
    <circle cx="50" cy="10" r="7" fill="currentColor" />
    <circle cx="85" cy="70" r="7" fill="currentColor" />
  </svg>
);

const DashboardCard = ({ title, icon, children, className = "" }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    className={`bg-gray-800/50 backdrop-blur-sm p-5 rounded-xl border border-gray-700 shadow-lg h-full ${className}`}
  >
    <h3 className="text-xl font-bold mb-4 text-cyan-300 flex items-center">
      {icon}
      <span className="ml-3">{title}</span>
    </h3>
    <div className="text-gray-300">{children}</div>
  </motion.div>
);

const SpeciesList = ({ species }) => {
  const [showAll, setShowAll] = useState(false);
  const displayedSpecies = showAll ? species : species.slice(0, 40);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {displayedSpecies.map((sp, i) => (
          <span
            key={i}
            className="bg-cyan-900/70 text-cyan-200 px-3 py-1 rounded-full text-xs font-medium"
          >
            {sp.replaceAll("_", " ")}
          </span>
        ))}
      </div>
      {species.length > 40 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-cyan-400 mt-3 text-sm hover:underline"
        >
          {showAll ? "Show Less" : `+ ${species.length - 40} more...`}
        </button>
      )}
    </>
  );
};

// Main Application Component
const GlycanInsight = () => {
  const [userInput, setUserInput] = useState(""); // Start with an empty input
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const exampleSequence =
    "Man(a1-3)[Man(a1-6)]Man(b1-4)GlcNAc(b1-4)[Fuc(a1-6)]GlcNAc";

  // New handler to populate the input with the example
  const handleLoadExample = () => {
    setUserInput(exampleSequence);
  };

  const fetchInsight = async () => {
    if (!userInput.trim()) {
      setError("Please enter a glycan sequence or a GlyTouCan ID.");
      return;
    }
    setLoading(true);
    setData(null);
    setError(null);
    try {
      const res = await axios.post("http://localhost:5000/api/glycan_insight", {
        userInput,
      });
      setData(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error || "An unknown server error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderDoughnutChart = (items) => {
    const counts = items.reduce(
      (acc, item) => ({ ...acc, [item]: (acc[item] || 0) + 1 }),
      {}
    );
    const chartData = {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: [
            "#22d3ee",
            "#a78bfa",
            "#facc15",
            "#fb923c",
            "#4ade80",
            "#f87171",
            "#818cf8",
          ],
          borderColor: "#1f2937",
          borderWidth: 2,
        },
      ],
    };
    const options = {
      plugins: { legend: { position: "right", labels: { color: "#e5e7eb" } } },
      maintainAspectRatio: false,
    };
    return (
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>
    );
  };

  const hasMeaningfulResults =
    data &&
    (data.glytoucan_id !== "Not Found" ||
      data.species.length > 0 ||
      data.motifs.length > 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 flex items-center justify-center">
            <GlycanLogo /> Glyco-Verse Explorer
          </h1>
          <p className="text-lg text-gray-400">
            Unlock Biological Insights from Glycan Structures
          </p>
        </header>

        <div className="max-w-3xl mx-auto p-6 bg-gray-800/40 rounded-lg border border-gray-700 shadow-2xl">
          {/* Container for the textarea and the magic icon */}
          <div className="relative w-full">
            <textarea
              className="w-full p-3 pr-12 text-gray-200 bg-gray-900 rounded-md border-2 border-gray-600 focus:border-cyan-500 focus:ring-cyan-500 transition duration-300 font-mono"
              rows={3}
              placeholder="Enter a Glycan Sequence or GlyTouCan ID... or click the wand! ✨"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button
              onClick={handleLoadExample}
              className="absolute top-3 right-3 text-gray-400 hover:text-cyan-400 transition-colors duration-200"
              title="Load Example Sequence"
            >
              <FaMagic className="h-5 w-5" />
            </button>
          </div>
          <button
            className="w-full mt-4 bg-cyan-600 px-6 py-3 rounded-md font-bold text-white hover:bg-cyan-500 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
            onClick={fetchInsight}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Explore Insights"}
          </button>
        </div>

        <div className="mt-10 min-h-[200px]">
          <AnimatePresence mode="wait">
            {/* ... rest of the component remains the same ... */}
            {loading && (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div
                  role="status"
                  className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-cyan-400 border-r-transparent"
                />
                
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto p-4 bg-red-900/50 border border-red-700 rounded-lg text-center text-red-200"
              >
                <strong>Error:</strong> {error}
              </motion.div>
            )}

            {data &&
              !loading &&
              !error &&
              (!hasMeaningfulResults ? (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-2xl mx-auto p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg text-center text-yellow-200 flex items-center justify-center"
                >
                  <FaExclamationCircle className="mr-3 text-2xl" />
                  <div>
                    <h3 className="font-bold">Analysis Complete</h3>
                    <p>
                      No biological information was found in the database for
                      this input.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  className="grid gap-6 grid-cols-1 lg:grid-cols-5"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.07 } },
                  }}
                >
                  <DashboardCard
                    title="Glycan Identity"
                    icon={<FaDna />}
                    className="lg:col-span-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="mb-1 font-semibold text-gray-400">
                          GlyTouCan ID
                        </p>
                        <p className="font-mono text-amber-300 text-lg">
                          {data.glytoucan_id}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 font-semibold text-gray-400">
                          Contained Motifs
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {data.motifs.length > 0 ? (
                            data.motifs.map((m, i) => (
                              <span
                                key={i}
                                className="bg-purple-900/70 text-purple-200 px-3 py-1 rounded-full text-xs font-mono"
                              >
                                {m}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400">None found</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="mb-1 font-semibold text-gray-400">
                        Analyzed IUPAC Sequence
                      </p>
                      <p className="font-mono text-sm text-cyan-200 bg-gray-900/50 p-2 rounded-md break-all">
                        {data.analyzed_glycan_sequence}
                      </p>
                    </div>
                  </DashboardCard>

                  <DashboardCard
                    title="Taxonomy"
                    icon={<FaLeaf />}
                    className="lg:col-span-3"
                  >
                    <h4 className="font-semibold text-gray-300 mb-2">
                      Expressed In Species
                    </h4>
                    {data.species.length > 0 ? (
                      <SpeciesList species={data.species} />
                    ) : (
                      <p className="text-gray-400">
                        No species information found.
                      </p>
                    )}
                  </DashboardCard>

                  <DashboardCard
                    title="Phyla Distribution"
                    icon={<FaDna />}
                    className="lg:col-span-2"
                  >
                    {data.phyla.length > 0 ? (
                      renderDoughnutChart(data.phyla)
                    ) : (
                      <p className="text-gray-400 h-full flex items-center justify-center">
                        No phyla data to display.
                      </p>
                    )}
                  </DashboardCard>

                  <DashboardCard
                    title="Disease Associations"
                    icon={<FaDisease />}
                    className="lg:col-span-3"
                  >
                    <div className="max-h-60 overflow-y-auto pr-2">
                      <table className="w-full text-sm text-left">
                        <thead className="text-gray-400 uppercase bg-gray-700/50 sticky top-0">
                          <tr>
                            <th className="px-4 py-2">Disease</th>
                            <th className="px-4 py-2">Regulation</th>
                            <th className="px-4 py-2">Sample</th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-800/30">
                          {data.diseases.length > 0 ? (
                            data.diseases.map(([d, dir, s], i) => (
                              <tr
                                key={i}
                                className="border-b border-gray-700 hover:bg-gray-700/50"
                              >
                                <td className="px-4 py-2">{d}</td>
                                <td
                                  className={`px-4 py-2 font-bold ${
                                    dir === "up"
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  {dir}
                                </td>
                                <td className="px-4 py-2">{s}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="3"
                                className="text-center p-4 text-gray-400"
                              >
                                No disease associations found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </DashboardCard>

                  <DashboardCard
                    title="Expressed in Cell Lines & Tissues"
                    icon={<FaVial />}
                    className="lg:col-span-2"
                  >
                    <div className="max-h-60 overflow-y-auto pr-2 text-sm">
                      {data.cell_lines.length > 0 ? (
                        <ul className="list-disc list-inside columns-1 sm:columns-2 gap-2">
                          {data.cell_lines.map((cl, i) => (
                            <li key={i} className="mb-1">
                              {cl}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400">
                          No cell line or tissue data found.
                        </p>
                      )}
                    </div>
                  </DashboardCard>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default GlycanInsight;
