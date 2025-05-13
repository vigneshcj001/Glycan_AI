import React from "react";

// Static imports for images
import Img1900 from "../../../images/1900.png";
import Img1950 from "../../../images/1950.png";
import Img1980 from "../../../images/1980.png";
import Img2000 from "../../../images/2000.png";
import Img2010 from "../../../images/2010.png";
import Img2020 from "../../../images/2020.png";

// Timeline data
const historyItems = [
  {
    year: "1900s",
    title: "Discovery of Glycans",
    description:
      "The first identification of glycans as complex carbohydrate structures.",
    details:
      "In the early 20th century, researchers discovered glycans were not just simple sugars, but complex macromolecules composed of monosaccharides linked together in diverse configurations. This discovery laid the foundation for glycobiology.",
    media: Img1900,
  },
  {
    year: "1950s",
    title: "Glycans in Biology",
    description:
      "The recognition of glycans as essential components of cellular biology.",
    details:
      "By the 1950s, scientists realized glycans play crucial roles in cellular recognition, protein folding, and the immune response, marking the early steps toward understanding their biological functions.",
    media: Img1950,
  },
  {
    year: "1980s",
    title: "Glycosylation and Disease",
    description: "The link between abnormal glycosylation and disease.",
    details:
      "In the 1980s, research showed that improper glycosylation could lead to various diseases, including cancer and congenital disorders, paving the way for glycobiology’s importance in disease diagnostics and therapeutics.",
    media: Img1980,
  },
  {
    year: "2000s",
    title: "Advances in Glycomics",
    description: "The rise of glycomics and large-scale glycan analysis.",
    details:
      "With the advent of technologies such as mass spectrometry, scientists began analyzing complex glycan structures at an unprecedented scale, leading to the development of the field of glycomics, which complements genomics and proteomics.",
    media: Img2000,
  },
  {
    year: "2010s",
    title: "AI and Glycomics",
    description: "AI-driven analysis in glycobiology.",
    details:
      "Machine learning and AI began to be integrated into glycobiology research, enabling more accurate predictions of glycan structures and their interactions. Glycobiology's applications in personalized medicine and diagnostics flourished.",
    media: Img2010,
  },
  {
    year: "2020s",
    title: "The Age of GlycoAI",
    description:
      "Revolutionizing glycomics research with AI and deep learning.",
    details:
      "The latest advancements include GlycoAI, a platform that uses AI to model glycans, predict their biological roles, and even identify glycan patterns involved in diseases such as cancer and infections. This represents a major leap toward personalized medicine.",
    media: Img2020,
  },
];

const History = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-6 sm:p-12">
      <div className="max-w-6xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-blue-800 mb-10">
          History of Glycobiology
        </h1>
        <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          The journey of glycobiology is one of discovery, innovation, and
          breakthrough. From the identification of glycans to modern AI-driven
          glycomics, here is a timeline of key events that have shaped this
          field.
        </p>

        <div className="space-y-12">
          {historyItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col lg:flex-row items-center gap-6 border-l-4 border-blue-600 pl-6 py-8"
            >
              <img
                src={item.media}
                alt={`Illustration from ${item.year}`}
                className="w-44 h-44 rounded-xl shadow-lg object-cover transition-transform hover:scale-105"
              />
              <div className="flex-1">
                <div className="text-xl text-blue-700 font-semibold">
                  {item.year}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {item.title}
                </h2>
                <p className="text-md text-gray-700 mt-2">{item.description}</p>
                <p className="text-sm text-gray-600 mt-1">{item.details}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-xl text-gray-700">
            The history of glycobiology is still unfolding, with exciting
            advances in glycomics, glycoinformatics, and glycan-based therapies.
            Stay tuned for future developments!
          </p>
        </div>
      </div>
    </div>
  );
};

export default History;
