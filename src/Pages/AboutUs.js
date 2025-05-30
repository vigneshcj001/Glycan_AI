import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { FaRocket, FaUsers, FaTools, FaEye, FaSeedling } from "react-icons/fa";

const features = [
  {
    icon: <FaRocket className="text-blue-600 text-3xl mb-4" />,
    title: "AI-Powered Predictions",
    desc: "Predict glycan immunogenicity and discover patterns using GAT, LSTM, GIN, and MPNN models.",
  },
  {
    icon: <FaUsers className="text-blue-600 text-3xl mb-4" />,
    title: "Glycan Visualization",
    desc: "Interactive 3D and SNFG rendering for exploring glycans using IUPAC-condensed formats.",
  },
  {
    icon: <FaTools className="text-blue-600 text-3xl mb-4" />,
    title: "Format Conversion & Descriptor Analysis",
    desc: "Seamlessly switch between IUPAC, WURCS, GLYCOCT, SMILES formats with descriptor insights.",
  },
  {
    icon: <FaSeedling className="text-blue-600 text-3xl mb-4" />,
    title: "Glycan Biosynthetic Networks",
    desc: "Generate pathway networks to visualize synthesis routes and analyze complexity.",
  },
  {
    icon: <FaEye className="text-blue-600 text-3xl mb-4" />,
    title: "Sequence Alignment & Mutation Tools",
    desc: "Align glycans using biological matrices and simulate structural motif changes.",
  },
  {
    icon: <FaUsers className="text-blue-600 text-3xl mb-4" />,
    title: "Data & Research Integration",
    desc: "Explore curated datasets, historic breakthroughs, and trending glycan research.",
  },
];

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-blue-800 mb-6"
        >
          About GlycoAI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto"
        >
          <span className="font-semibold text-blue-700">GlycoAI</span> is an
          innovative platform merging AI with glycomics to explore the complex
          world of carbohydrates. From prediction and visualization to
          conversion and pathway generation, GlycoAI equips researchers with
          intelligent tools for impactful analysis.
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-left mt-10">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + idx * 0.1, duration: 0.6 }}
            >
              <Tilt
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                glareEnable={true}
                glareMaxOpacity={0.1}
                scale={1.02}
              >
                <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-[1.03]">
                  {feature.icon}
                  <h3 className="text-xl font-bold text-blue-700 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-md text-gray-600 mt-14 max-w-3xl mx-auto"
        >
          Whether you're a biologist, data scientist, or developer, GlycoAI
          offers a gateway into the future of glycan research. Dive in and be
          part of the next revolution in glycobiology.
        </motion.p>
      </div>
    </div>
  );
};

export default AboutUs;
