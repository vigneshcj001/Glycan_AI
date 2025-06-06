import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  FaRocket,
  FaUsers,
  FaTools,
  FaEye,
  FaSeedling,
  FaLinkedin,
  FaOrcid,
} from "react-icons/fa";

import vigneshImg from "../../images/GPT.png";
import ashokImg from "../../images/GPT.png";

const features = [
  {
    icon: <FaRocket className="text-blue-600 text-3xl mb-4" />,
    title: "AI-Powered Predictions",
    desc: "Predict glycan immunogenicity using GAT, LSTM, GIN, and MPNN models.",
  },
  {
    icon: <FaUsers className="text-blue-600 text-3xl mb-4" />,
    title: "Glycan Visualization",
    desc: "Interactive 3D and SNFG rendering using IUPAC-condensed formats.",
  },
  {
    icon: <FaTools className="text-blue-600 text-3xl mb-4" />,
    title: "Format Conversion & Descriptor Analysis",
    desc: "Switch between IUPAC, WURCS, GLYCOCT, SMILES with descriptor insights.",
  },
  {
    icon: <FaSeedling className="text-blue-600 text-3xl mb-4" />,
    title: "Glycan Biosynthetic Networks",
    desc: "Visualize synthesis routes and analyze complexity.",
  },
  {
    icon: <FaEye className="text-blue-600 text-3xl mb-4" />,
    title: "Sequence Alignment & Mutation Tools",
    desc: "Align glycans and simulate structural motif changes.",
  },
  {
    icon: <FaUsers className="text-blue-600 text-3xl mb-4" />,
    title: "Data & Research Integration",
    desc: "Explore curated datasets and trending glycan research.",
  },
];

const authors = [
  {
    name: "Vigneshwaran C.J",
    img: vigneshImg,
    tags: ["Researcher", "Developer"],
    affiliation:
      "Systems Computational Biology Lab & Bioinformatics Center,\nSchool of Chemical & Biotechnology, SASTRA Deemed University",
    email: ["125164007@sastra.ac.in", "vigneshwarancj@gmail.com"],
    section: "Skills & Interests",
    list: [
      "Glycomics",
      "Bioinformatics",
      "Artificial Intelligence",
      "Deep Learning",
      "Machine Learning",
      "Web Development",
    ],
    orcid: null,
    linkedin: "https://www.linkedin.com/in/vigneshwarancj1",
  },
  {
    name: "Dr. Ashok Palaniappan",
    img: ashokImg,
    tags: ["Mentor"],
    affiliation:
      "Systems Computational Biology Lab & Bioinformatics Center,\nSchool of Chemical & Biotechnology, SASTRA Deemed University",
    email: ["apalania@scbt.sastra.ac.in"],
    section: "Research Interests",
    list: [
      "Systems & Synthetic Biology",
      "Computational Biomedicine",
      "AI/ML in Genomics",
      "Biomarker Discovery",
      "Multi-omics Integration",
    ],
    orcid: "https://orcid.org/0000-0003-2841-9527",
    linkedin: "https://www.linkedin.com/in/ashokpalaniappan",
  },
];

const FeatureCard = ({ icon, title, desc }) => (
  <Tilt
    tiltMaxAngleX={10}
    tiltMaxAngleY={10}
    glareEnable
    glareMaxOpacity={0.1}
    scale={1.02}
  >
    <div className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl hover:ring-4 hover:ring-blue-200 transition-transform transform hover:scale-[1.03]">
      {icon}
      <h3 className="text-xl font-bold text-blue-700 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  </Tilt>
);

const AuthorCard = ({ author }) => (
  <div className="group perspective w-full h-full cursor-pointer">
    <div className="relative w-full h-[380px] transition-transform duration-700 preserve-3d group-hover:rotate-y-180">
      {/* Front */}
      <div className="absolute inset-0 backface-hidden bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center group-hover:scale-105">
        <img
          src={author.img}
          alt={author.name}
          className="w-28 h-28 object-cover rounded-full mb-4 border-4 border-blue-100 shadow-md group-hover:scale-110 transition-transform"
        />
        <h3 className="text-xl font-bold text-center text-blue-700">
          {author.name}
        </h3>
        <p className="text-center text-sm text-gray-600 italic mt-1 whitespace-pre-line">
          {author.affiliation}
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          {author.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Back */}
      <div className="absolute inset-0 backface-hidden rotate-y-180 bg-blue-50 p-6 rounded-2xl shadow-lg overflow-auto">
        <h4 className="text-blue-700 font-semibold text-lg mb-2">
          {author.section}
        </h4>
        <ul className="list-disc list-inside text-sm text-gray-700 mb-4 max-h-[140px] overflow-y-auto space-y-1">
          {author.list.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            <strong>Email:</strong>{" "}
            {Array.isArray(author.email)
              ? author.email.join(" / ")
              : author.email}
          </p>
          {author.orcid && (
            <p className="flex items-center gap-2">
              <FaOrcid className="text-green-600" />
              <strong>ORCID:</strong>{" "}
              <a
                href={author.orcid}
                className="text-blue-600 underline hover:text-blue-800"
                target="_blank"
                rel="noreferrer"
              >
                ORCID Profile
              </a>
            </p>
          )}
          {author.linkedin && (
            <p className="flex items-center gap-2">
              <FaLinkedin className="text-blue-700" />
              <strong>LinkedIn:</strong>{" "}
              <a
                href={author.linkedin}
                className="text-blue-600 underline hover:text-blue-800"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn Profile
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

const AboutUs = () => (
  <div className="bg-gradient-to-br from-white to-blue-50 min-h-screen px-6 py-12 relative z-10">
    <div className="max-w-6xl mx-auto text-center">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-extrabold text-blue-800 mb-6"
      >
        About GlycanBench
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-lg text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed"
      >
        <span className="font-semibold text-blue-700">GlycanBench</span> is an
        innovative platform merging AI with glycomics to explore the complex
        world of carbohydrates. From prediction and visualization to conversion
        and pathway generation, GlycanBench equips researchers with intelligent
        tools for impactful analysis.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-10 text-left">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + idx * 0.1, duration: 0.6 }}
          >
            <FeatureCard {...feature} />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="mt-24"
      >
        <h2 className="text-4xl font-bold text-blue-800 mb-12 text-center tracking-tight">
          🧚 Meet the Minds Behind GlycanBench
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 px-4 max-w-6xl mx-auto">
          {authors.map((author, idx) => (
            <AuthorCard key={idx} author={author} />
          ))}
        </div>
      </motion.div>
    </div>
    <div className="h-20" />
  </div>
);

export default AboutUs;
