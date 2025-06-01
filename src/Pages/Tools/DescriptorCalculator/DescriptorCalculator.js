import React, { useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaMagic } from "react-icons/fa";

const descriptorGroups = {
  Weight: [
    "Molecular Weight",
    "Exact Molecular Weight",
    "Heavy Atom Mol Weight",
    "Molar Refractivity",
  ],
  Rings: ["Ring Count", "Aliphatic Rings", "Aromatic Rings", "Saturated Rings"],
  Bonds: ["Num Rotatable Bonds", "H-Bond Acceptors", "H-Bond Donors"],
  Atoms: [
    "Heavy Atom Count",
    "Num Valence Electrons",
    "Num Heteroatoms",
    "NHOH Count",
    "NO Count",
  ],
  Other: ["TPSA", "LogP", "Fraction Csp3"],
};

const descriptorDescriptions = {
  "Molecular Weight": "Average molecular weight of the molecule.",
  "Exact Molecular Weight":
    "Precise molecular weight with isotopes considered.",
  "Heavy Atom Mol Weight": "Weight of all non-hydrogen atoms.",
  "Molar Refractivity": "Measure of polarizability of the molecule.",
  "Ring Count": "Total number of rings in the structure.",
  "Aliphatic Rings": "Number of non-aromatic rings.",
  "Aromatic Rings": "Number of aromatic rings.",
  "Saturated Rings": "Number of saturated rings.",
  "Num Rotatable Bonds": "Number of bonds that can rotate freely.",
  "H-Bond Acceptors": "Atoms that accept hydrogen bonds.",
  "H-Bond Donors": "Atoms that donate hydrogen bonds.",
  "Heavy Atom Count": "Count of non-hydrogen atoms.",
  "Num Valence Electrons": "Total valence electrons in the molecule.",
  "Num Heteroatoms": "Number of atoms other than carbon and hydrogen.",
  "NHOH Count": "Number of NH or OH groups.",
  "NO Count": "Number of nitrogen and oxygen atoms.",
  TPSA: "Topological polar surface area.",
  LogP: "Octanol-water partition coefficient, measure of hydrophobicity.",
  "Fraction Csp3": "Fraction of sp3 hybridized carbons.",
};

const DescriptorCard = ({ name, value }) => (
  <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-xl shadow-lg hover:scale-105 transform transition duration-300 cursor-help relative group">
    <h3 className="font-semibold text-lg">{name}</h3>
    <p className="mt-2 text-xl font-bold">
      {typeof value === "number" ? value.toFixed(3) : value}
    </p>
    <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-75 text-xs text-white px-2 py-1 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      {descriptorDescriptions[name]}
    </div>
  </div>
);

const InteractiveDescriptorOutput = ({ data }) => {
  if (!data) return null;

  const barData = Object.entries(data)
    .filter(
      ([k, v]) =>
        typeof v === "number" &&
        k !== "Ring Count" &&
        k !== "Num Valence Electrons" &&
        k !== "Num Heteroatoms"
    )
    .map(([key, value]) => ({ name: key, value }));

  return (
    <div className="mt-10 space-y-8 max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">
          Glycan Descriptor Summary
        </h2>
        <p className="text-gray-600 italic">
          Input IUPAC:{" "}
          <span className="font-mono text-blue-900">{data.IUPAC}</span>
        </p>
        <p className="text-gray-600 italic">
          Generated SMILES:{" "}
          <a
            href={`https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(
              data.SMILES
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-700 hover:text-blue-900"
          >
            View on PubChem
          </a>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(descriptorGroups).map(([groupName, keys]) => (
          <div key={groupName}>
            <h3 className="text-xl font-semibold text-blue-600 mb-4 border-b border-blue-300 pb-2">
              {groupName}
            </h3>
            <div className="space-y-4">
              {keys.map(
                (key) =>
                  data[key] !== undefined && (
                    <DescriptorCard key={key} name={key} value={data[key]} />
                  )
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white p-6 rounded-xl shadow-xl">
        <h3 className="text-2xl font-bold mb-4 text-blue-700 text-center">
          Descriptor Values Overview
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart
            data={barData}
            margin={{ top: 10, right: 20, left: 10, bottom: 80 }}
            layout="vertical"
          >
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
              width={150}
              angle={-45}
              textAnchor="end"
            />
            <Tooltip formatter={(value) => value.toFixed(3)} />
            <Bar dataKey="value" fill="#2563eb" radius={[5, 5, 5, 5]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const DescriptorCalculator = () => {
  const [sequence, setSequence] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (sequence.trim().length < 3) {
      setError("Please enter a valid IUPAC glycan string.");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/descriptor", {
        format: "IUPAC",
        data: sequence.trim(),
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Server error");
    }
    setLoading(false);
  };

  const handleClear = () => {
    setSequence("");
    setResult(null);
    setError("");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
        Glycan Descriptor Calculator
      </h1>
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={() => setSequence("Man(a1-4)GlcNAc(b1-4)GlcNAc")}
          className="flex items-center text-sm text-purple-600 hover:text-purple-800 transition mb-2"
        >
          <FaMagic className="mr-1" />
          Example
        </button>

        <textarea
          className="w-full p-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Enter IUPAC glycan sequence..."
          value={sequence}
          onChange={(e) => setSequence(e.target.value)}
        />
        <div className="space-x-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Processing..." : "Calculate"}
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Clear
          </button>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>
      {result && <InteractiveDescriptorOutput data={result} />}
    </div>
  );
};

export default DescriptorCalculator;
