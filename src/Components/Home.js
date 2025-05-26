import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import {
  FaMicroscope,
  FaRobot,
  FaAtom,
  FaRocket,
  FaLightbulb,
  FaTools,
} from "react-icons/fa";
import { motion } from "framer-motion";
import * as NGL from "ngl";

const Home = () => {
  const [motif, setMotif] = useState("Man(a1-3)Man(a1-4)GlcNAc");
  const stageRef = useRef(null);
  const stageInstance = useRef(null);

  // PubChem CID - Blood group B trisaccharide for Fuc(a1-2)[Gal(a1-3)]aldehydo-Gal
  const pubchemCID = "54177368";

  useEffect(() => {
    if (!stageRef.current) return;

    stageInstance.current = new NGL.Stage(stageRef.current, {
      backgroundColor: "white",
    });

    // Fetch SDF from PubChem using CID
    const sdfUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${pubchemCID}/record/SDF/?record_type=3d`;

    fetch(sdfUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch 3D structure from PubChem.");
        }
        return response.text();
      })
      .then((sdfText) => {
        const blob = new Blob([sdfText], { type: "chemical/x-mdl-sdfile" });
        const sdfObjectURL = URL.createObjectURL(blob);
        return stageInstance.current.loadFile(sdfObjectURL, {
          ext: "sdf",
          defaultRepresentation: true,
        });
      })
      .then((component) => {
        component.addRepresentation("ball+stick", { color: "element" });
        component.autoView();
      })
      .catch((err) => {
        console.error("Failed to load 3D structure:", err);
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

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen overflow-hidden">
      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row items-center justify-between p-10 md:p-20">
        <motion.div
          className="max-w-xl space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          variants={sectionVariants}
        >
          <h1 className="text-5xl font-extrabold text-blue-800 leading-tight">
            Welcome to <span className="text-blue-500">GlycoAI</span>
          </h1>
          <p className="text-lg text-gray-700">
            Unlock the future of Glycomics with 3D visualization, intelligent
            analytics, and AI-powered predictions—all in one platform.
          </p>
          <div className="flex gap-4">
            <Link
              to="/visualize"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform shadow-md"
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
            className="rounded-3xl border border-blue-100 shadow-lg"
          />
        </motion.div>
      </main>

      {/* Feature Highlights */}
      <motion.section
        className="px-8 py-12 bg-blue-100 grid md:grid-cols-3 gap-8 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        variants={sectionVariants}
      >
        {[
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
        ].map((feature, index) => (
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

      {/* Motif Prediction */}
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
          <input
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

      {/* Why GlycoAI */}
      <motion.section
        className="bg-blue-50 py-16 px-8 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        variants={sectionVariants}
      >
        <h2 className="text-3xl font-bold text-blue-800 mb-6">
          Why Use GlycoAI?
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: <FaLightbulb />,
              title: "Custom AI for Glycobiology",
              text: "Discover our in-house deep learning model—designed and trained from scratch—to predict glycan immunogenicity with molecular precision.",
            },
            {
              icon: <FaTools />,
              title: "Research-Ready Tools",
              text: "Tools for glycan conversion, biosynthetic analysis, and dataset generation.",
            },
            {
              icon: <FaRocket />,
              title: "Performance at Scale",
              text: "Handle thousands of glycans with fast pipelines and powerful predictions.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-6 border border-blue-100 rounded-lg shadow hover:shadow-lg transition"
            >
              {React.cloneElement(feature.icon, {
                className: "mx-auto text-blue-500",
                size: 36,
              })}
              <h4 className="font-semibold text-xl mt-4">{feature.title}</h4>
              <p className="text-gray-600 mt-2">{feature.text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="py-16 bg-white text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        variants={sectionVariants}
      >
        <h2 className="text-3xl font-bold text-blue-800 mb-4">
          Ready to Explore Glycobiology?
        </h2>
        <p className="text-gray-600 mb-6">
          Analyze, visualize, and predict glycan properties—powered by AI.
        </p>
        <Link
          to="/resources"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
        >
          Get Started
        </Link>
      </motion.section>
    </div>
  );
};

export default Home;
