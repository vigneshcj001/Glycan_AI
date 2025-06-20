import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaDna,
  FaChartBar,
  FaExclamationTriangle,
  FaFlask,
  FaPaperPlane,
  FaShieldAlt,
} from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";
import { IoClose } from "react-icons/io5";

// --- Helper: Result Visualization Card ---
const InfoCard = ({ icon, title, children, colorClass = "bg-slate-100" }) => (
  <div className={`rounded-xl p-4 ${colorClass}`}>
    <div className="flex items-center gap-3 mb-2">
      <div className="text-slate-500">{icon}</div>
      <h3 className="font-semibold text-slate-700">{title}</h3>
    </div>
    <div className="pl-8">{children}</div>
  </div>
);

// --- Helper: Generate specific interpretations based on sequence ---
const getSequenceInterpretations = (sequence, isImmunogenic) => {
  const points = [];

  // --- Immunogenic Motif Checks ---
  if (sequence.includes("Gal(a1-3)Gal")) {
    points.push({
      icon: <FaExclamationTriangle className="text-red-500" />,
      title: "Alpha-Gal Epitope Detected",
      text: "The sequence contains the 'Gal(a1-3)Gal' motif. This is a well-known xenogeneic antigen (found in non-primate mammals) that can trigger a strong pre-existing immune response in humans.",
    });
  }
  if (sequence.includes("Neu5Gc")) {
    points.push({
      icon: <FaExclamationTriangle className="text-red-500" />,
      title: "Non-Human Sialic Acid (Neu5Gc)",
      text: "This glycan includes Neu5Gc, a sialic acid not naturally produced by humans. It is often immunogenic when present on biotherapeutics produced in non-human cell lines.",
    });
  }
  if (sequence.includes("Rha")) {
    // Rhamnose
    points.push({
      icon: <FaExclamationTriangle className="text-red-500" />,
      title: "Bacterial-Associated Monosaccharide",
      text: "The presence of Rhamnose (Rha) is characteristic of many bacterial polysaccharides and can be recognized as foreign by the human immune system, a potential pathogen-associated molecular pattern (PAMP).",
    });
  }

  // --- Non-Immunogenic / "Self" Motif Checks ---
  if (sequence.includes("NeuNAc(a2-6)") || sequence.includes("NeuNAc(a2-3)")) {
    points.push({
      icon: <FaShieldAlt className="text-emerald-500" />,
      title: "Human-Type Sialic Acid Capping",
      text: "The glycan is terminated with NeuNAc (N-acetylneuraminic acid), the common sialic acid in humans. This 'capping' can mask underlying structures and is a key feature of 'self' glycans, reducing immunogenicity.",
    });
  }
  if (sequence.includes("Man(b1-4)GlcNAc(b1-4)")) {
    points.push({
      icon: <FaShieldAlt className="text-emerald-500" />,
      title: "Complex N-Glycan Core Detected",
      text: "The structure contains a 'Man(b1-4)GlcNAc(b1-4)' core, which is characteristic of complex N-glycans typically found on human glycoproteins, suggesting it is likely to be well-tolerated.",
    });
  }
  // --- ADDED: Check for core fucosylation, a common 'self' marker ---
  if (sequence.includes("Fuc(a1-6)]GlcNAc")) {
    points.push({
      icon: <FaShieldAlt className="text-emerald-500" />,
      title: "Core Fucosylation Detected",
      text: "The presence of core fucosylation (Fucα1-6 attached to the innermost GlcNAc) is a common modification on human N-glycans and is generally considered part of a 'self' signature, contributing to low immunogenicity.",
    });
  }

  // --- General/Fallback Interpretations ---
  if (points.length === 0) {
    if (isImmunogenic) {
      points.push({
        icon: <FaExclamationTriangle className="text-red-500" />,
        title: "Predicted Immunogenic Structure",
        text: "While no common high-risk motifs were automatically detected, the model predicts this structure is immunogenic. This could be due to its overall topology, unusual branching, or less common antigenic determinants.",
      });
    } else {
      points.push({
        icon: <FaShieldAlt className="text-emerald-500" />,
        title: "Predicted Non-Immunogenic Structure",
        text: "This structure is predicted to be well-tolerated. It does not contain common high-risk motifs and likely resembles glycans typically found in humans, suggesting a low risk of an immune response.",
      });
    }
  }

  return points;
};

// --- Helper: Interpretation Card ---
const InterpretationCard = ({ sequence, isImmunogenic }) => {
  const interpretations = getSequenceInterpretations(sequence, isImmunogenic);
  const title = "Potential Implications";
  const overallIcon = isImmunogenic ? (
    <FaExclamationTriangle className="text-red-500" />
  ) : (
    <FaShieldAlt className="text-emerald-500" />
  );

  return (
    <InfoCard
      icon={overallIcon}
      title={title}
      colorClass={isImmunogenic ? "bg-red-50" : "bg-emerald-50"}
    >
      <div className="space-y-4">
        {interpretations.map((item, index) => (
          <div key={index} className="flex items-start gap-3 text-sm">
            <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
            <div className="flex-grow">
              <h4 className="font-semibold text-slate-800">{item.title}</h4>
              <p className="text-slate-600">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </InfoCard>
  );
};

// --- Results Display Component ---
const ResultsDisplay = ({ result, sequence, onClear }) => {
  const isImmunogenic = result.prediction === "Immunogenic";
  const immunogenicityProbability = result.score * 100;
  const confidence = isImmunogenic ? result.score : 1 - result.score;
  const confidencePercentage = confidence * 100;
  const glycanTokens = sequence.split(/([()\[\]])/).filter(Boolean);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="relative w-full bg-white border border-slate-200 rounded-2xl shadow-lg p-6 space-y-5"
    >
      <button
        onClick={onClear}
        className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors rounded-full p-1 hover:bg-slate-100"
        aria-label="Clear results"
      >
        <IoClose size={22} />
      </button>

      <h2 className="text-2xl font-bold text-slate-800">Analysis Complete</h2>

      <div
        className={`p-6 rounded-xl text-center ${
          isImmunogenic ? "bg-red-50" : "bg-emerald-50"
        }`}
      >
        <p className="text-sm font-medium text-slate-500 mb-1">
          Predicted Classification
        </p>
        <p
          className={`text-4xl font-extrabold ${
            isImmunogenic ? "text-red-600" : "text-emerald-600"
          }`}
        >
          {result.prediction}
        </p>
        <p className="mt-2 text-lg font-semibold text-slate-700">
          Model Confidence: {confidencePercentage.toFixed(1)}%
        </p>
      </div>

      <InterpretationCard isImmunogenic={isImmunogenic} sequence={sequence} />

      <InfoCard
        icon={<FaChartBar />}
        title="Predicted Immunogenicity (Probability)"
      >
        <div className="flex items-center gap-4">
          <div className="w-full bg-slate-200 rounded-full h-4">
            <motion.div
              className={`h-4 rounded-full ${
                isImmunogenic ? "bg-red-500" : "bg-emerald-500"
              }`}
              initial={{ width: "0%" }}
              animate={{ width: `${immunogenicityProbability}%` }}
              transition={{ duration: 1, ease: "circOut", delay: 0.5 }}
            />
          </div>
          <span className="text-2xl font-bold text-slate-700">
            {immunogenicityProbability.toFixed(1)}%
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-2 pl-1">
          {/* --- CORRECTED: Clarified description of the score. --- */}
          The model's raw output probability for the 'Immunogenic' class. A
          score &gt; 50% results in an 'Immunogenic' classification.
        </p>
      </InfoCard>

      <InfoCard icon={<FaDna />} title="Input Sequence Tokenization">
        <p className="text-xs text-slate-500 mb-2">
          The input IUPAC string is broken down into its constituent
          monosaccharide and linkage tokens for model processing.
        </p>
        <div className="flex flex-wrap gap-1">
          {glycanTokens.map((part, index) => (
            <motion.span
              key={`${part}-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.05 }}
              className="px-2.5 py-1 text-xs bg-slate-200 text-slate-800 rounded-md font-mono"
            >
              {part}
            </motion.span>
          ))}
        </div>
      </InfoCard>
    </motion.div>
  );
};

// --- Main Page Component ---
const GlycanAnalysisPage = () => {
  const [sequence, setSequence] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const examples = [
    {
      name: "Complex Human N-Glycan",
      // --- CORRECTED: "GalOS" typo fixed to "Gal". ---
      sequence:
        "Gal(b1-4)GlcNAc(b1-2)[Gal(b1-4)GlcNAc(b1-4)]Man(a1-3)[NeuNAc(a2-3)Gal(b1-4)GlcNAc(b1-2)[NeuNAc(a2-3)Gal(b1-4)GlcNAc(b1-6)]Man(a1-6)]Man(b1-4)GlcNAc(b1-4)[Fuc(a1-6)]GlcNAc",
    },
    {
      name: "Bacterial Polysaccharide",
      sequence:
        "[GalNAcAN(a1-2)]Rha(a1-2)Rha(a1-3)Rha(a1-2)Rha(a1-3)GlcNAc(b1-3)Rha",
    },
    // --- ADDED: A new example to highlight the Alpha-Gal rule. ---
    {
      name: "Xenogeneic Alpha-Gal",
      sequence: "Gal(a1-3)Gal(b1-4)GlcNAc(b1-2)Man(a1-3)Man(b1-4)GlcNAc",
    },
  ];

  const handleAnalyze = async (seq) => {
    const sequenceToAnalyze = seq || sequence;
    if (!sequenceToAnalyze) {
      setError("Please enter a glycan sequence in IUPAC-condensed format.");
      return;
    }
    setError("");
    setResult(null);
    setIsLoading(true);

    try {
      // --- ADDED: Note on using environment variables for real applications.
      const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

      const validation = await axios.post(`${API_URL}/validate`, {
        sequence: sequenceToAnalyze,
      });
      if (!validation.data.valid) {
        setError(`Invalid Sequence Format: ${validation.data.reason}`);
        setIsLoading(false);
        return;
      }

      const response = await axios.post(`${API_URL}/predict`, {
        sequence: sequenceToAnalyze,
      });
      setResult(response.data);
      setSequence(sequenceToAnalyze);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        "An API error occurred. Please ensure the backend server is running and accessible.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (exampleSequence) => {
    setSequence(exampleSequence);
    handleAnalyze(exampleSequence);
  };

  const handleClear = () => {
    setSequence("");
    setResult(null);
    setError("");
  };

  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-800 flex justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="w-full space-y-8 lg:sticky lg:top-8">
          <header>
            <div className="flex items-center gap-3">
              <FaFlask className="text-3xl text-sky-600" />
              <h1 className="text-4xl font-bold text-slate-900">
                Glycan Immunogenicity Predictor
              </h1>
            </div>
            <p className="mt-2 text-slate-500">
              Analyze glycan structures using a Graph Neural Network (GNN) to
              predict their potential to trigger an immune response—a critical
              step in biotherapeutic development and glycoengineering.
            </p>
          </header>

          <div className="space-y-4">
            <label
              htmlFor="sequence-input"
              className="block font-semibold text-slate-700"
            >
              Enter Glycan Sequence (IUPAC-condensed)
            </label>
            <textarea
              id="sequence-input"
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
              placeholder="e.g., Gal(a1-3)Gal(b1-4)GlcNAc"
              className="w-full p-3 h-32 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow font-mono text-sm"
              disabled={isLoading}
            />
            <button
              onClick={() => handleAnalyze()}
              disabled={isLoading || !sequence}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 text-lg font-semibold text-white bg-sky-600 rounded-lg shadow-md hover:bg-sky-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <CgSpinner className="animate-spin h-6 w-6" />
              ) : (
                <FaPaperPlane />
              )}
              <span>{isLoading ? "Analyzing..." : "Analyze Sequence"}</span>
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-slate-700">Or try an example:</h3>
            <div className="flex flex-wrap gap-2">
              {examples.map((ex) => (
                <button
                  key={ex.name}
                  onClick={() => handleExampleClick(ex.sequence)}
                  disabled={isLoading}
                  className="px-3 py-1.5 text-sm bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 disabled:opacity-50 transition-colors"
                >
                  {ex.name}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-r-lg flex items-start gap-3"
              >
                <FaExclamationTriangle className="mt-1 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full">
          <AnimatePresence mode="wait">
            {result ? (
              <ResultsDisplay
                result={result}
                sequence={sequence}
                onClear={handleClear}
              />
            ) : (
              <div className="text-center border-2 border-dashed border-slate-300 rounded-2xl p-12 h-full flex flex-col justify-center items-center">
                <FaChartBar className="text-5xl text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-500">
                  Awaiting Glycan Analysis
                </h3>
                <p className="text-slate-400 mt-1">
                  Prediction results will be displayed here.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
};

export default GlycanAnalysisPage;
