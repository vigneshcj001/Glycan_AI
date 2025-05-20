import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  FaMicroscope,
  FaRobot,
  FaAtom,
  FaRocket,
  FaLightbulb,
  FaTools,
} from "react-icons/fa";
import * as NGL from "ngl";

const Home = () => {
  const [motif, setMotif] = useState("Man(a1-3)Man(a1-4)GlcNAc");

  useEffect(() => {
    const stage = new NGL.Stage("glycan-viewer", {
      backgroundColor: "transparent",
    });

    const pdbId = "1hyy";
    stage
      .loadFile(`https://files.rcsb.org/download/${pdbId}.pdb`)
      .then((component) => {
        component.addRepresentation("cartoon", { color: "residueindex" });
        component.autoView();
      });

    window.addEventListener("resize", () => stage.handleResize());
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row items-center justify-between p-10 md:p-20">
        <div className="max-w-xl space-y-6 animate-fade-in-up">
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
        </div>

        <div className="mt-10 lg:mt-0 w-full lg:w-1/2 flex justify-center animate-fade-in">
          <div
            id="glycan-viewer"
            className="w-80 h-80 rounded-3xl border border-blue-100 shadow-lg"
          ></div>
        </div>
      </main>

      {/* Feature Highlights */}
      <section className="px-8 py-12 bg-blue-100 grid md:grid-cols-3 gap-8 text-center">
        <div className="hover:scale-105 transition-transform">
          <FaMicroscope className="mx-auto text-blue-600" size={40} />
          <h3 className="font-bold text-xl mt-2">Structure Discovery</h3>
          <p className="text-gray-700">
            Browse annotated glycan structures and perform motif or sequence
            alignment.
          </p>
        </div>
        <div className="hover:scale-105 transition-transform">
          <FaRobot className="mx-auto text-blue-600" size={40} />
          <h3 className="font-bold text-xl mt-2">AI-Driven Insight</h3>
          <p className="text-gray-700">
            Leverage deep learning for immunogenicity prediction, motif scoring,
            and more.
          </p>
        </div>
        <div className="hover:scale-105 transition-transform">
          <FaAtom className="mx-auto text-blue-600" size={40} />
          <h3 className="font-bold text-xl mt-2">Real-Time Viewer</h3>
          <p className="text-gray-700">
            Interact with glycan models in 3D, powered by RCSB and NGL.
          </p>
        </div>
      </section>

      {/* Motif Prediction */}
      <section className="bg-white py-16 px-8 text-center">
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
      </section>

      {/* Why GlycoAI Section */}
      <section className="bg-blue-50 py-16 px-8 text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">
          Why Use GlycoAI?
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-6 border border-blue-100 rounded-lg shadow hover:shadow-lg transition">
            <FaLightbulb className="mx-auto text-blue-500" size={36} />
            <h4 className="font-semibold text-xl mt-4">
              Custom AI for Glycobiology
            </h4>
            <p className="text-gray-600 mt-2">
              Discover our in-house deep learning model—designed and trained
              from scratch—to predict glycan immunogenicity with molecular
              precision.
            </p>
          </div>
          <div className="p-6 border border-blue-100 rounded-lg shadow hover:shadow-lg transition">
            <FaTools className="mx-auto text-blue-500" size={36} />
            <h4 className="font-semibold text-xl mt-4">Research-Ready Tools</h4>
            <p className="text-gray-600 mt-2">
              Tools for glycan conversion, biosynthetic analysis, and dataset
              generation.
            </p>
          </div>
          <div className="p-6 border border-blue-100 rounded-lg shadow hover:shadow-lg transition">
            <FaRocket className="mx-auto text-blue-500" size={36} />
            <h4 className="font-semibold text-xl mt-4">Performance at Scale</h4>
            <p className="text-gray-600 mt-2">
              Handle thousands of glycans with fast pipelines and powerful
              predictions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white text-center">
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
      </section>
    </div>
  );
};

export default Home;
