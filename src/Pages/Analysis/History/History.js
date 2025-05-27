import React, { useState } from "react";
import { motion } from "framer-motion";

// Timeline data
const historyItems = [
  {
    year: "1900s",
    title: "🧬 Discovery of Glycans",
    description:
      "The first identification of glycans as complex carbohydrate structures.",
    details:
      "Emil Fischer demonstrated how monosaccharides could form glycosidic bonds, laying the foundation of glycan chemistry. He synthesized various sugars and mapped their stereochemistry.",
    figure: "Emil Fischer",
    paper:
      "https://www.scirp.org/reference/referencespapers?referenceid=849472",
    fact: "Did you know? Emil Fischer coined terms like 'pyranose' and 'furanose' that are still used today!",
    keywords: ["discovery", "chemistry", "carbohydrates"],
    image: "/assets/glycan-1900s.svg",
  },
  {
    year: "1950s",
    title: "🧫 Glycans in Biology",
    description:
      "The recognition of glycans as essential components of cellular biology.",
    details:
      "Luis Leloir discovered sugar nucleotides, showing that glycosylation is enzymatically driven. This marked the beginning of understanding glycans in cellular signaling and protein function.",
    figure: "Luis F. Leloir",
    paper: "https://www.nobelprize.org/prizes/chemistry/1970/leloir/facts/",
    fact: "Did you know? Leloir received the Nobel Prize in 1970 for discovering the role of sugar nucleotides in metabolism.",
    keywords: ["glycoprotein", "protein folding", "immunity"],
    image: "/assets/glycan-1950s.svg",
  },
  {
    year: "1980s",
    title: "⚠️ Glycosylation and Disease",
    description: "The link between abnormal glycosylation and disease.",
    details:
      "Research led by scientists like Hudson Freeze revealed that defects in glycosylation pathways cause Congenital Disorders of Glycosylation (CDGs), impacting multiple organ systems.",
    figure: "Hudson Freeze",
    paper: "https://jmhg.springeropen.com/articles/10.1186/s43042-020-00117-w",
    fact: "Did you know? CDGs are now a growing class of metabolic diseases affecting neurological development.",
    keywords: ["disease", "CDG", "biomarkers"],
    image: "/assets/glycan-1980s.svg",
  },
  {
    year: "2000s",
    title: "🔬 Advances in Glycomics",
    description: "The rise of glycomics and large-scale glycan analysis.",
    details:
      "High-throughput methods like mass spectrometry and HPLC were applied to glycans. The Consortium for Functional Glycomics (CFG) helped map glycan structures across tissues and organisms.",
    figure: "Ajit Varki",
    paper:
      "https://www.researchgate.net/publication/304588166_Glycomics_Aims_To_Interpret_the_Third_Molecular_Language_of_Cells",
    fact: "Did you know? Glycomics was coined as a 'third language of life' alongside genomics and proteomics.",
    keywords: ["mass spectrometry", "profiling", "high-throughput"],
    image: "/assets/glycan-2000s.svg",
  },
  {
    year: "2010s",
    title: "🤖 AI and Glycomics",
    description: "AI-driven analysis in glycobiology.",
    details:
      "Machine learning began assisting in glycan motif detection, functional annotation, and sequence interpretation. Work from Carolyn Bertozzi’s lab integrated chemical biology and informatics.",
    figure: "Carolyn Bertozzi",
    paper: "https://ieeexplore.ieee.org/document/7102732",
    fact: "Did you know? Carolyn Bertozzi coined 'bioorthogonal chemistry,' enabling tracking of glycans in live cells.",
    keywords: ["AI", "machine learning", "prediction"],
    image: "/assets/glycan-2010s.svg",
  },
  {
    year: "2020s",
    title: "🚀 The Age of GlycoAI",
    description:
      "Revolutionizing glycomics research with AI and deep learning.",
    details:
      "Deep learning tools now simulate glycan folding, predict host-pathogen interactions, and assist in drug target discovery. Models like SweetNet, GlyNet, and GlyBERT emerged.",
    figure: "Multiple AI Labs (e.g. MIT, EMBL-EBI)",
    paper: "https://www.biorxiv.org/content/10.1101/2021.10.15.464532v1",
    fact: "Did you know? GlyBERT can interpret and generate glycan structures using BERT-like transformers.",
    keywords: ["deep learning", "glycoAI", "therapeutics"],
    image: "/assets/glycan-2020s.svg",
  },
];

const History = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [search, setSearch] = useState("");

  const toggleItem = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const filteredItems = historyItems.filter((item) =>
    item.keywords.join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-100 p-6 sm:p-12">
      <div className="max-w-6xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-blue-200">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-blue-800 mb-10">
          🚀 History of Glycobiology
        </h1>
        <p className="text-lg text-center text-gray-600 mb-10 max-w-3xl mx-auto">
          Explore the evolution of glycobiology through an interactive timeline.
        </p>

        <input
          type="text"
          placeholder="🔍 Filter by keyword (e.g. AI, disease)"
          className="w-full p-3 mb-10 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="space-y-6">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all duration-200 p-6 rounded-xl border-l-8 border-blue-500 shadow-md"
              onClick={() => toggleItem(index)}
            >
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <img src={item.image} alt="Glycan" className="w-16 h-16" />
                  <div>
                    <div className="text-lg text-blue-700 font-bold">
                      {item.year}
                    </div>
                    <div className="text-2xl font-semibold text-gray-800">
                      {item.title}
                    </div>
                  </div>
                </div>
                <div className="text-2xl">
                  {activeIndex === index ? "−" : "+"}
                </div>
              </div>
              <motion.div
                initial={false}
                animate={{
                  height: activeIndex === index ? "auto" : 0,
                  opacity: activeIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden mt-4 text-gray-700"
              >
                <p className="text-md mb-2">{item.description}</p>
                <p className="text-sm text-gray-600 mb-2">{item.details}</p>
                <p className="text-sm text-blue-800">
                  <strong>Key Figure:</strong> {item.figure} |{" "}
                  <a
                    href={item.paper}
                    className="underline text-blue-500"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Breakthrough Paper 🔗
                  </a>
                </p>
                <p className="text-sm mt-2 bg-yellow-100 p-3 rounded-lg">
                  💡 <strong>Did you know?</strong> {item.fact}
                </p>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-xl text-blue-700">
            🎯 Glycoinformatics continues to unlock the sugar code in health and
            disease.
          </p>
        </div>
      </div>
    </div>
  );
};

export default History;
