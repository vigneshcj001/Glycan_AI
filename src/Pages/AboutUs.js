import { motion } from "framer-motion";
import { FaRocket, FaUsers, FaTools, FaEye, FaSeedling } from "react-icons/fa";

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto text-center">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-blue-800 mb-6"
        >
          About GlycoAI
        </motion.h1>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg text-gray-700 mb-10 leading-relaxed max-w-3xl mx-auto"
        >
          <span className="font-semibold text-blue-700">GlycoAI</span> is a
          cutting-edge platform that fuses artificial intelligence with
          glycomics to revolutionize our understanding of complex carbohydrates.
          From 3D visualization and immunogenicity prediction to format
          conversion and biosynthetic pathway generation, GlycoAI empowers
          researchers, developers, and biologists with intuitive, AI-powered
          tools for advanced glycan analysis.
        </motion.p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-left mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <FaRocket className="text-blue-600 text-3xl mb-4" />
            <h3 className="text-xl font-bold text-blue-700 mb-2">
              AI-Powered Predictions
            </h3>
            <p className="text-gray-600">
              Predict glycan immunogenicity and discover patterns in
              structure-function relationships using advanced models like GAT,
              LSTM, GIN, and MPNN.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <FaUsers className="text-blue-600 text-3xl mb-4" />
            <h3 className="text-xl font-bold text-blue-700 mb-2">
              Glycan Visualization
            </h3>
            <p className="text-gray-600">
              View glycans in interactive 3D using IUPAC-condensed inputs or
              build them using our glycan builder interface with real-time SNFG
              rendering.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <FaTools className="text-blue-600 text-3xl mb-4" />
            <h3 className="text-xl font-bold text-blue-700 mb-2">
              Format Conversion & Descriptor Analysis
            </h3>
            <p className="text-gray-600">
              Convert between IUPAC, WURCS, GLYCOCT, and SMILES formats while
              computing molecular descriptors like molecular weight, H-bond
              donors, and more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <FaSeedling className="text-blue-600 text-3xl mb-4" />
            <h3 className="text-xl font-bold text-blue-700 mb-2">
              Glycan Biosynthetic Networks
            </h3>
            <p className="text-gray-600">
              Generate biosynthetic pathway networks from glycan structures to
              understand synthesis routes and pathway complexity.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <FaEye className="text-blue-600 text-3xl mb-4" />
            <h3 className="text-xl font-bold text-blue-700 mb-2">
              Sequence Alignment & Mutation Tools
            </h3>
            <p className="text-gray-600">
              Align glycan sequences using biologically-aware scoring matrices,
              and simulate glycan motif mutations for structural variation
              analysis.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <FaUsers className="text-blue-600 text-3xl mb-4" />
            <h3 className="text-xl font-bold text-blue-700 mb-2">
              Data & Research Integration
            </h3>
            <p className="text-gray-600">
              Access curated datasets, explore historical breakthroughs in
              glycobiology, and browse a library of cutting-edge glycan research
              papers.
            </p>
          </motion.div>
        </div>

        {/* Closing */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-md text-gray-600 mt-14 max-w-3xl mx-auto"
        >
          Whether you're a biologist, data scientist, or developer, GlycoAI is
          designed to make glycan research accessible, efficient, and impactful.
          Join us in shaping the future of glycobiology through AI.
        </motion.p>
      </div>
    </div>
  );
};

export default AboutUs;
