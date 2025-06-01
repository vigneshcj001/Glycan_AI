import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";

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
  },
];

const TimelineItem = React.memo(({ item, index, isActive, onToggle }) => {
  const panelId = `timeline-panel-${index}`;
  const buttonId = `timeline-button-${index}`;

  return (
    <div className="bg-blue-50 rounded-xl border-l-8 border-blue-500 shadow-md">
      <button
        id={buttonId}
        type="button"
        aria-expanded={isActive}
        aria-controls={panelId}
        onClick={() => onToggle(index)}
        className="flex w-full items-center justify-between p-6 text-left hover:bg-blue-100 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-50 rounded-t-xl"
      >
        <div className="flex gap-4 items-center">
          <div
            className="w-16 h-16 rounded-full bg-cover bg-center shadow-md border-2 border-blue-300 flex-shrink-0"
            aria-hidden="true" 
          ></div>
          <div>
            <div className="text-lg text-blue-700 font-bold">{item.year}</div>
            <div className="text-2xl font-semibold text-gray-800">
              {item.title}
            </div>
          </div>
        </div>
        <span aria-hidden="true" className="text-2xl ml-4 flex-shrink-0">
          {isActive ? "−" : "+"}
        </span>
      </button>
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        initial={false}
        animate={{
          height: isActive ? "auto" : 0,
          opacity: isActive ? 1 : 0,
          marginTop: isActive ? "0px" : "0px", 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 pt-4 text-gray-700">
          {" "}
          <p className="text-md mb-2">{item.description}</p>
          <p className="text-sm text-gray-600 mb-2">{item.details}</p>
          <p className="text-sm text-blue-800">
            <strong>Key Figure:</strong> {item.figure} |{" "}
            <a
              href={item.paper}
              className="underline text-blue-500 hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer" 
            >
              Breakthrough Paper 🔗
            </a>
          </p>
          <p className="text-sm mt-3 bg-yellow-100 p-3 rounded-xl">
            {item.fact}
          </p>
        </div>
      </motion.div>
    </div>
  );
});
TimelineItem.displayName = "TimelineItem"; 

const History = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [search, setSearch] = useState("");

  const toggleItem = useCallback((index) => {
    setActiveIndex((prevActiveIndex) =>
      prevActiveIndex === index ? null : index
    );
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const filteredItems = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) {
      return historyItems;
    }
    return historyItems.filter(
      (item) =>
        item.keywords.join(" ").toLowerCase().includes(searchTerm) ||
        item.title.toLowerCase().includes(searchTerm) || 
        item.description.toLowerCase().includes(searchTerm)  
    );
  }, [search]);  

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-100 p-6 sm:p-12">
      <div className="max-w-6xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-blue-200">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-blue-800 mb-10">
          🚀 History of Glycobiology
        </h1>
        <p className="text-lg text-center text-gray-600 mb-10 max-w-3xl mx-auto">
          Explore the evolution of glycobiology through an interactive timeline.
        </p>

        <label htmlFor="timeline-search" className="sr-only">
          Filter by keyword
        </label>
        <input
          id="timeline-search"
          type="text"
          placeholder="🔍 Filter by keyword, title, or description (e.g. AI, disease)"
          className="w-full p-3 mb-10 rounded-xl border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={handleSearchChange}
        />

        {filteredItems.length > 0 ? (
          <div className="space-y-6">
            {filteredItems.map((item, index) => (
              <TimelineItem
                key={item.year} 
                item={item}
                index={index} 
                isActive={activeIndex === index}
                onToggle={toggleItem}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            No items match your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default History;
