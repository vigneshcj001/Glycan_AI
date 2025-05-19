import React, { useState } from "react";

export default function GlycanConverter() {
  const [inputFormat, setInputFormat] = useState("glycoct");
  const [glycanInput, setGlycanInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const formats = ["iupac", "glycoct", "wurcs"];

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          glycan: glycanInput,
          input_format: inputFormat,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unknown error");
      } else {
        setResult(data);
      }
    } catch (e) {
      setError("Network error or server not running");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">
        🧬 Glycan Format Converter
      </h1>

      <label className="block mb-2 font-semibold text-gray-700">
        Select Input Format:
        <select
          value={inputFormat}
          onChange={(e) => setInputFormat(e.target.value)}
          className="ml-3 border border-gray-300 rounded px-2 py-1"
        >
          {formats.map((fmt) => (
            <option key={fmt} value={fmt}>
              {fmt.toUpperCase()}
            </option>
          ))}
        </select>
      </label>

      <label className="block mb-4">
        Enter Glycan ({inputFormat.toUpperCase()} format):
        <textarea
          rows={inputFormat === "glycoct" ? 12 : 5}
          className="mt-1 w-full border border-gray-300 rounded p-2 font-mono text-sm"
          value={glycanInput}
          onChange={(e) => setGlycanInput(e.target.value)}
          placeholder={`Paste your ${inputFormat.toUpperCase()} glycan sequence here...`}
        />
      </label>

      <button
        onClick={handleConvert}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded"
        disabled={loading || !glycanInput.trim()}
      >
        {loading ? "Converting..." : "Convert Glycan"}
      </button>

      {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}

      {result && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">
            Conversion Result:
          </h2>

          <div className="space-y-4 text-sm">
            <div>
              <strong>IUPAC:</strong>
              <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap">
                {result.iupac || "N/A"}
              </pre>
            </div>

            <div>
              <strong>GlycoCT:</strong>
              <textarea
                readOnly
                className="bg-gray-100 p-3 rounded w-full h-40 font-mono text-xs"
                value={result.glycoct || "N/A"}
              />
            </div>

            <div>
              <strong>WURCS:</strong>
              <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap">
                {result.wurcs || "N/A"}
              </pre>
            </div>

            <div>
              <strong>SMILES:</strong>
              <pre className="bg-gray-100 p-3 rounded whitespace-pre-wrap">
                {result.smiles || "N/A"}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
