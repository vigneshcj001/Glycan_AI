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
          Welcome to{" "}
          <span className="font-semibold text-blue-700">GlycoAI</span> — the
          intersection of{" "}
          <span className="font-semibold text-blue-700">
            artificial intelligence
          </span>{" "}
          and <span className="font-semibold text-blue-700">glycobiology</span>.
          We're revolutionizing how the world explores the invisible sugar code
          using graph-based AI, 3D visualization, and predictive tools.
        </motion.p>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-10 mt-12 text-left">
          <FeatureCard
            icon={<FaSeedling className="text-blue-600 text-3xl" />}
            title="Our Mission"
            text="To accelerate discoveries in immunology, microbiology, and medicine by building AI tools that decode glycan functions, structures, and interactions."
          />

          <FeatureCard
            icon={<FaEye className="text-blue-600 text-3xl" />}
            title="Our Vision"
            text="To be the global hub for AI-powered glycomics research, sparking collaboration and innovation in bioscience and medicine."
          />

          <FeatureCard
            icon={<FaRocket className="text-blue-600 text-3xl" />}
            title="What We Offer"
            text={
              <ul className="list-disc list-inside space-y-1">
                <li>AI-based glycan immunogenicity predictions</li>
                <li>3D visualization & motif drawing tools</li>
                <li>Sequence alignment and motif discovery</li>
                <li>Open research resources & curated datasets</li>
              </ul>
            }
          />

          <FeatureCard
            icon={<FaUsers className="text-blue-600 text-3xl" />}
            title="Who We Serve"
            text="Researchers, clinicians, and students in immunology, infectious diseases, bioinformatics, and systems biology."
          />
        </div>

        {/* Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-2xl shadow-xl mt-20 border-l-4 border-blue-600"
        >
          <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center justify-center md:justify-start">
            <FaTools className="mr-2" /> Tools & Features
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2 text-left">
            <li>
              3D Glycan Visualizer{" "}
              <span className="italic text-sm">
                (Stick style, element color, surface option)
              </span>
            </li>
            <li>
              GlycoDraw Viewer{" "}
              <span className="italic text-sm">(2D motifs + highlight)</span>
            </li>
            <li>
              Immunogenicity Predictor{" "}
              <span className="italic text-sm">
                (sequence → immunogenicity)
              </span>
            </li>
            <li>Biosynthetic Network Generator</li>
            <li>Sequence Alignment Tool</li>
            <li>
              Glycan Characterization{" "}
              <span className="italic text-sm">(rank, kingdom, mods)</span>
            </li>
            <li>
              Format Converter{" "}
              <span className="italic text-sm">
                (IUPAC, WURCS, GlycoCT, SMILES)
              </span>
            </li>
            <li>
              Highlighted Papers{" "}
              <span className="italic text-sm">
                (SweetOrigins, LectinOracle...)
              </span>
            </li>
            <li>
              Dataset Downloader{" "}
              <span className="italic text-sm">(by species)</span>
            </li>
            <li>
              PDB Redirector <span className="italic text-sm">(by PDB ID)</span>
            </li>
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-20 bg-blue-100 p-10 rounded-2xl shadow-md text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-semibold text-blue-700 mb-4">
            🌌 Ready to explore the glycan universe with AI?
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            Dive into our powerful tools, predictive models, and visual
            explorers—or contribute to the open glycoscience revolution!
          </p>
          <a
            href="/resources"
            className="bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium shadow hover:bg-blue-800 transition duration-300"
          >
            Explore Resources
          </a>
        </motion.div>
      </div>
    </div>
  );
};

// Reusable FeatureCard component
const FeatureCard = ({ icon, title, text }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ duration: 0.3 }}
    className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600 hover:shadow-lg"
  >
    <div className="flex items-center mb-3">
      {icon}
      <h2 className="text-2xl font-bold text-blue-700 ml-2">{title}</h2>
    </div>
    <div className="text-gray-700 text-base">{text}</div>
  </motion.div>
);

export default AboutUs;
