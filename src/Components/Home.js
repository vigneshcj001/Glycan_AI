import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import {
  FaMicroscope,
  FaRobot,
  FaAtom,
  FaRocket,
  FaUsers,
  FaTools,
  FaEye,
  FaSeedling,
  FaSpinner,
} from "react-icons/fa";
import { motion } from "framer-motion";
import * as NGL from "ngl";

const Home = () => {
  const [motif, setMotif] = useState("Man(a1-3)Man(a1-4)GlcNAc");
  const [loading, setLoading] = useState(true); // Spinner control
  const stageRef = useRef(null);
  const stageInstance = useRef(null);

  const pubchemCID = "54177368"; // Optional: could parse CID from motif

  useEffect(() => {
    if (!stageRef.current) return;

    stageInstance.current = new NGL.Stage(stageRef.current, {
      backgroundColor: "white",
    });

    const sdfUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${pubchemCID}/record/SDF/?record_type=3d`;

    fetch(sdfUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch SDF.");
        return res.text();
      })
      .then((sdf) => {
        const blob = new Blob([sdf], { type: "chemical/x-mdl-sdfile" });
        const url = URL.createObjectURL(blob);
        return stageInstance.current.loadFile(url, {
          ext: "sdf",
          defaultRepresentation: true,
        });
      })
      .then((component) => {
        component.addRepresentation("ball+stick", { color: "element" });
        component.autoView();
        setLoading(false);
      })
      .catch((err) => {
        console.error("3D Load error:", err);
        setLoading(false);
      });

    const handleResize = () => stageInstance.current.handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      stageInstance.current.dispose();
    };
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const featureHighlights = [
    {
      icon: <FaMicroscope />,
      title: "Structure Discovery",
      text: "Browse annotated glycan structures and perform motif or sequence alignment.",
    },
    {
      icon: <FaRobot />,
      title: "AI-Driven Insight",
      text: "Leverage deep learning for immunogenicity prediction, motif scoring, and more.",
    },
    {
      icon: <FaAtom />,
      title: "Real-Time Viewer",
      text: "Interact with glycan models in 3D, powered by RCSB and NGL.",
    },
  ];

  const aboutFeatures = [
    {
      icon: <FaRocket />,
      title: "AI-Powered Predictions",
      text: "Predict glycan immunogenicity and discover patterns using GAT, LSTM, GIN, and MPNN.",
    },
    {
      icon: <FaUsers />,
      title: "3D & SNFG Visualization",
      text: "Interactive rendering for exploring glycans in IUPAC-condensed formats.",
    },
    {
      icon: <FaTools />,
      title: "Format & Descriptor Tools",
      text: "Convert between formats like WURCS, SMILES, GLYCOCT with descriptor insights.",
    },
    {
      icon: <FaSeedling />,
      title: "Biosynthetic Networks",
      text: "Visualize synthesis pathways and analyze structural complexity.",
    },
    {
      icon: <FaEye />,
      title: "Alignment & Mutations",
      text: "Align glycans with biological matrices and simulate motif-level mutations.",
    },
    {
      icon: <FaUsers />,
      title: "Data & Research Hub",
      text: "Access curated datasets, past discoveries, and modern glycan research.",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen overflow-hidden">
      <main className="flex flex-col lg:flex-row items-center justify-between p-10 md:p-20">
        <motion.div
          className="max-w-xl space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          variants={sectionVariants}
        >
          <h1 className="text-4xl font-extrabold text-blue-800 leading-tight">
            Welcome to <span className="text-blue-500">GlycanBench</span>
          </h1>
          <p className="text-lg text-gray-700">
            Unlock the future of Glycomics with 3D visualization, intelligent
            analytics, and AI-powered predictions—all in one platform.
          </p>
          <div className="flex gap-4">
            <Link
              to="/visualize"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:scale-105 hover:text-white transition-transform shadow-md"
            >
              Visualize 3D Glycan
            </Link>
            <Link
              to="/resources"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-100 hover:scale-105 transition-transform shadow-sm"
            >
              Explore Tools
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="mt-10 lg:mt-0 w-full lg:w-1/2 flex justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          variants={sectionVariants}
        >
          <div
            ref={stageRef}
            style={{ width: "320px", height: "320px" }}
            className="relative rounded-3xl border border-blue-100 shadow-lg"
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 rounded-3xl z-10">
                <FaSpinner className="animate-spin text-blue-500 text-3xl" />
              </div>
            )}
          </div>
        </motion.div>
      </main>

      <motion.section
        className="px-8 py-12 bg-blue-100 grid md:grid-cols-3 gap-8 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={sectionVariants}
      >
        {featureHighlights.map((feature, index) => (
          <div key={index} className="hover:scale-105 transition-transform">
            {React.cloneElement(feature.icon, {
              className: "mx-auto text-blue-600",
              size: 40,
            })}
            <h3 className="font-bold text-xl mt-2">{feature.title}</h3>
            <p className="text-gray-700">{feature.text}</p>
          </div>
        ))}
      </motion.section>

      <motion.section
        className="bg-white py-16 px-8 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        variants={sectionVariants}
      >
        <h2 className="text-3xl font-bold text-blue-800 mb-4">
          Try Immunogenicity Prediction
        </h2>
        <p className="text-gray-600 mb-6">
          Enter a glycan motif in IUPAC-condensed format and get a sample
          prediction.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
          <label htmlFor="motif" className="sr-only">Glycan Motif</label>
          <input
            id="motif"
            type="text"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full md:w-1/2"
            placeholder="e.g., Man(a1-3)Man(a1-4)GlcNAc"
          />
          <Link
            to="/prediction"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Predict
          </Link>
        </div>
      </motion.section>

      <motion.section
        className="bg-blue-50 py-16 px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        variants={sectionVariants}
      >
        <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-12">
          Why Choose GlycanBench?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          {aboutFeatures.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:scale-[1.03]"
            >
              {React.cloneElement(item.icon, {
                className: "mx-auto text-blue-600 mb-4",
                size: 36,
              })}
              <h3 className="text-xl font-semibold text-blue-700 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};

export default Home;