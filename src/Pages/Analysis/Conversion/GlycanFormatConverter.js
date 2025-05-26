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

const FORMATS = [
  { key: "iupac", label: "IUPAC" },
  { key: "glycoct", label: "GLYCOCT" },
  { key: "wurcs", label: "WURCS" },
];

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
        // FULL URL here
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          glycan: glycanInput,
          input_format: inputFormat,
        }),
      });
      const data = await response.json();
      if (!response.ok) setError(data.error || "Conversion failed");
      else setResult(data);
    } catch (e) {
      setError("Network or server error");
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-xl rounded-2xl space-y-6">
      <h1 className="text-3xl font-bold text-center mb-4">
        Glycan Format Converter
      </h1>

      <div className="flex justify-center space-x-4">
        {FORMATS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => {
              setInputFormat(key);
              setGlycanInput("");
              setResult(null);
              setError(null);
            }}
            className={`px-5 py-2 rounded-lg font-semibold text-sm ${
              inputFormat === key
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative">
        <label htmlFor="glycan-input" className="block font-semibold mb-1">
          Enter Glycan ({inputFormat.toUpperCase()})
        </label>
        <textarea
          id="glycan-input"
          rows={inputFormat === "glycoct" ? 8 : 4}
          className="w-full p-3 border border-blue-300 rounded-lg resize-none font-mono text-sm"
          placeholder={`Paste ${inputFormat.toUpperCase()} glycan here...`}
          value={glycanInput}
          onChange={(e) => setGlycanInput(e.target.value)}
        />
        <button
          onClick={autofillExample}
          className="absolute top-3 right-3 text-blue-500 hover:text-blue-700"
          title="Fill with example"
          type="button"
        >
          <FaMagic size={20} />
        </button>
      </div>

      <button
        onClick={handleConvert}
        disabled={loading || !glycanInput.trim()}
        className={`w-full py-3 rounded-lg font-semibold text-white transition ${
          loading || !glycanInput.trim()
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        }`}
      >
        {loading ? "Converting..." : "Convert Glycan"}
      </button>

      {error && <div className="text-red-600 font-medium">{error}</div>}

      {result && (
        <div className="p-4 bg-gray-50 border border-blue-200 rounded-md font-mono mt-6 overflow-auto text-sm max-h-96">
          <h3 className="font-semibold text-blue-600 mb-3">
            Conversion Result:
          </h3>
          {Object.entries(result).map(([key, value]) => (
            <div key={key} className="mb-2">
              <strong>{key.toUpperCase()}:</strong>
              <pre className="whitespace-pre-wrap">{value}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlycanFormatConverter;
