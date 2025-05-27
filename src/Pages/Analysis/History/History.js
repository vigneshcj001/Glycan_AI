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
      "In the early 20th century, researchers discovered glycans were not just simple sugars, but complex macromolecules composed of monosaccharides linked together in diverse configurations. This discovery laid the foundation for glycobiology.",
  },
  {
    year: "1950s",
    title: "🧫 Glycans in Biology",
    description:
      "The recognition of glycans as essential components of cellular biology.",
    details:
      "By the 1950s, scientists realized glycans play crucial roles in cellular recognition, protein folding, and the immune response, marking the early steps toward understanding their biological functions.",
  },
  {
    year: "1980s",
    title: "⚠️ Glycosylation and Disease",
    description: "The link between abnormal glycosylation and disease.",
    details:
      "In the 1980s, research showed that improper glycosylation could lead to various diseases, including cancer and congenital disorders, paving the way for glycobiology’s importance in disease diagnostics and therapeutics.",
  },
  {
    year: "2000s",
    title: "🔬 Advances in Glycomics",
    description: "The rise of glycomics and large-scale glycan analysis.",
    details:
      "With the advent of technologies such as mass spectrometry, scientists began analyzing complex glycan structures at an unprecedented scale, leading to the development of the field of glycomics, which complements genomics and proteomics.",
  },
  {
    year: "2010s",
    title: "🤖 AI and Glycomics",
    description: "AI-driven analysis in glycobiology.",
    details:
      "Machine learning and AI began to be integrated into glycobiology research, enabling more accurate predictions of glycan structures and their interactions. Glycobiology's applications in personalized medicine and diagnostics flourished.",
  },
  {
    year: "2020s",
    title: "🚀 The Age of GlycoAI",
    description:
      "Revolutionizing glycomics research with AI and deep learning.",
    details:
      "The latest advancements include GlycoAI, a platform that uses AI to model glycans, predict their biological roles, and even identify glycan patterns involved in diseases such as cancer and infections. This represents a major leap toward personalized medicine.",
  },
];

const History = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleItem = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-100 p-6 sm:p-12">
      <div className="max-w-5xl mx-auto bg-white p-8 sm:p-12 rounded-3xl shadow-2xl border border-blue-200">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-blue-800 mb-10">
          🚀 History of Glycobiology
        </h1>
        <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Explore the remarkable evolution of glycobiology through this
          interactive timeline. Click on each era to dive into the milestones!
        </p>

        <div className="space-y-6">
          {historyItems.map((item, index) => (
            <div
              key={index}
              className="cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all duration-200 p-6 rounded-xl border-l-8 border-blue-500 shadow-md"
              onClick={() => toggleItem(index)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg text-blue-700 font-bold">
                    {item.year}
                  </div>
                  <div className="text-2xl font-semibold text-gray-800">
                    {item.title}
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
                <p className="text-md">{item.description}</p>
                <p className="text-sm text-gray-600 mt-2">{item.details}</p>
              </motion.div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-xl text-blue-700">
            🎯 The journey continues as glycoinformatics and AI redefine our
            understanding of life’s sugar code.
          </p>
        </div>
      </div>
    </div>
  );
};

export default History;
