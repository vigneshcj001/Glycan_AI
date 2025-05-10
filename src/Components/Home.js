import React, { useEffect } from "react";
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
  useEffect(() => {
    const stage = new NGL.Stage("glycan-viewer", {
      backgroundColor: "transparent",
    });
    const pdbId = "1hyy";

    stage
      .loadFile(`https://files.rcsb.org/download/${pdbId}.pdb`)
      .then((component) => {
        component.addRepresentation("cartoon", {
          color: "residueindex",
        });
        component.autoView();
      });
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
            Empowering AI-driven Glycomics with 3D molecular visualization,
            advanced analytics, and predictive tools to accelerate biomedical
            research.
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
          <h3 className="font-bold text-xl mt-2">Glycan Discovery</h3>
          <p className="text-gray-700">
            Explore curated 3D models and perform sequence-based and
            structure-based alignments.
          </p>
        </div>
        <div className="hover:scale-105 transition-transform">
          <FaRobot className="mx-auto text-blue-600" size={40} />
          <h3 className="font-bold text-xl mt-2">AI-Powered Analysis</h3>
          <p className="text-gray-700">
            Harness custom deep learning models for feature extraction and
            pattern recognition in Glycomics datasets.
          </p>
        </div>
        <div className="hover:scale-105 transition-transform">
          <FaAtom className="mx-auto text-blue-600" size={40} />
          <h3 className="font-bold text-xl mt-2">Interactive Visualizer</h3>
          <p className="text-gray-700">
            Real-time, browser-based manipulation of 3D glycan structures using
            PDB data.
          </p>
        </div>
      </section>

      {/* Why GlycoAI Section */}
      <section className="bg-white py-16 px-8 text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-6">
          Why Choose GlycoAI?
        </h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-6 border border-blue-100 rounded-lg shadow hover:shadow-lg transition">
            <FaLightbulb className="mx-auto text-blue-500" size={36} />
            <h4 className="font-semibold text-xl mt-4">Innovation</h4>
            <p className="text-gray-600 mt-2">
              Integrates custom-built AI models for Glycomics structure mining
              and predictive modeling.
            </p>
          </div>
          <div className="p-6 border border-blue-100 rounded-lg shadow hover:shadow-lg transition">
            <FaTools className="mx-auto text-blue-500" size={36} />
            <h4 className="font-semibold text-xl mt-4">Usability</h4>
            <p className="text-gray-600 mt-2">
              Intuitive, research-focused interface with tools for alignment,
              visualization, and dataset generation.
            </p>
          </div>
          <div className="p-6 border border-blue-100 rounded-lg shadow hover:shadow-lg transition">
            <FaRocket className="mx-auto text-blue-500" size={36} />
            <h4 className="font-semibold text-xl mt-4">Performance</h4>
            <p className="text-gray-600 mt-2">
              Optimized pipelines deliver rapid structure search, sequence-based
              retrieval, and automated CSV generation.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-50 text-center">
        <h2 className="text-3xl font-bold text-blue-800 mb-4">
          Ready to Dive In?
        </h2>
        <p className="text-gray-600 mb-6">
          Start exploring glycan structures or download curated datasets with
          just a few clicks.
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
