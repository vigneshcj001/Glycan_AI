// GlycanFormatConverter.jsx
import React, { useState } from "react";
import { FaMagic } from "react-icons/fa";

const EXAMPLES = {
  iupac: "Man(a1-3)[Man(a1-6)]Man",
  glycoct: `RES
1b:b-dgal-HEX-1:5
2s:n-acetyl
3b:b-dgal-HEX-1:5
4b:b-dglc-HEX-1:5
5b:b-dgal-HEX-1:5
6b:a-dglc-HEX-1:5
7b:b-dgal-HEX-1:5
8b:a-lgal-HEX-1:5|6:d
9b:a-dgal-HEX-1:5
10s:n-acetyl
11s:n-acetyl
12b:b-dglc-HEX-1:5
13b:b-dgal-HEX-1:5
14b:a-lgal-HEX-1:5|6:d
15b:a-lgal-HEX-1:5|6:d
16s:n-acetyl
17s:n-acetyl
18b:b-dgal-HEX-1:5
LIN
1:1d(2+1)2n
2:1o(3+1)3d
3:3o(3+1)4d
4:4o(-1+1)5d
5:5o(-1+1)6d
6:6o(-1+1)7d
7:7o(2+1)8d
8:7o(3+1)9d
9:9d(2+1)10n
10:6d(2+1)11n
11:5o(-1+1)12d
12:12o(-1+1)13d
13:13o(2+1)14d
14:12o(-1+1)15d
15:12d(2+1)16n
16:4d(2+1)17n
17:1o(6+1)18d`,
  wurcs:
    "WURCS=2.0/6,13,12/[a2112h-1b_1-5_2*NCC/3=O][a2112h-1b_1-5][a2122h-1b_1-5_2*NCC/3=O][a1221m-1a_1-5][a2122h-1a_1-5_2*NCC/3=O][a2112h-1a_1-5_2*NCC/3=O]/1-2-2-3-2-3-4-2-4-5-2-6-4/a3-c1_a6-b1_c3-d1_d?-e1_e?-j1_e?-f1_f?-h1_f?-g1_h2-i1_j?-k1_k2-m1_k3-l1",
};

const GlycanFormatConverter = () => {
  const [inputFormat, setInputFormat] = useState("iupac");
  const [glycanInput, setGlycanInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const autofillExample = () => {
    setGlycanInput(EXAMPLES[inputFormat] || "");
    setResult(null);
    setError(null);
  };

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          glycan: glycanInput,
          input_format: inputFormat,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Conversion failed");
      } else {
        setResult(data);
      }
    } catch (e) {
      setError("Network or server error");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-10 font-sans">
      <label className="block mb-2 font-semibold" htmlFor="format-select">
        Select Input Format:
      </label>
      <select
        id="format-select"
        className="mb-4 p-2 border rounded w-full"
        value={inputFormat}
        onChange={(e) => {
          setInputFormat(e.target.value);
          setGlycanInput("");
          setResult(null);
          setError(null);
        }}
      >
        <option value="iupac">IUPAC</option>
        <option value="glycoct">GlycoCT</option>
        <option value="wurcs">WURCS</option>
      </select>

      <label className="block mb-2 font-semibold" htmlFor="glycan-input">
        Enter Glycan ({inputFormat.toUpperCase()} format):
      </label>
      <div className="relative mb-4">
        <textarea
          id="glycan-input"
          rows={inputFormat === "glycoct" ? 8 : 4}
          className="w-full p-2 border rounded resize-none font-mono"
          value={glycanInput}
          onChange={(e) => setGlycanInput(e.target.value)}
          placeholder={`Paste your ${inputFormat.toUpperCase()} glycan here...`}
        />
        <button
          onClick={autofillExample}
          className="absolute top-2 right-2 text-purple-600 hover:text-purple-800"
          title="Fill with sample glycans"
          type="button"
        >
          <FaMagic size={20} />
        </button>
      </div>

      <button
        onClick={handleConvert}
        disabled={loading || !glycanInput.trim()}
        className={`w-full py-2 rounded text-white font-semibold ${
          loading || !glycanInput.trim()
            ? "bg-purple-300 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        }`}
      >
        {loading ? "Converting..." : "Convert Glycan"}
      </button>

      {error && (
        <div className="mt-4 text-red-600 font-semibold">Error: {error}</div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded border border-gray-300 font-mono whitespace-pre-wrap overflow-x-auto max-w-full">
          <h2 className="font-semibold mb-2">Conversion Result:</h2>
          {Object.entries(result).map(([key, value]) => (
            <div key={key} className="mb-3">
              <strong className="text-purple-700">{key.toUpperCase()}:</strong>
              <pre className="mt-1 text-sm break-words">{value}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlycanFormatConverter;
