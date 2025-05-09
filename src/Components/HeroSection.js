import React from "react";
import { Link } from "react-router";
import { FaMicroscope, FaRobot, FaAtom } from "react-icons/fa";

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col justify-between overflow-hidden">

      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row items-center justify-between p-10 md:p-20 z-10">
        {/* Left: Text */}
        <div className="max-w-xl space-y-6">
          <h1 className="text-5xl font-extrabold text-blue-800 leading-tight">
            Welcome to GlycoAI
          </h1>
          <p className="text-lg text-gray-700">
            Empowering AI-driven glycomics with 3D molecular visualization,
            mutation analysis, and predictive tools to advance research and
            personalized medicine.
          </p>

          <div className="flex gap-4">
            <Link
              to="/visualize"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Visualize 3D Glycan
            </Link>
            <Link
              to="/analysis"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
            >
              Explore Tools
            </Link>
          </div>
        </div>

        {/* Right: 3D Molecule Illustration Placeholder */}
        <div className="mt-10 lg:mt-0 w-full lg:w-1/2 flex justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-80 h-80 flex items-center justify-center animate-pulse">
            <FaAtom size={120} className="text-blue-300" />
          </div>
        </div>
      </main>

      {/* Info Highlights */}
      <section className="px-8 py-12 bg-blue-50 grid md:grid-cols-3 gap-8 text-center z-10">
        <div>
          <FaMicroscope className="mx-auto text-blue-500" size={40} />
          <h3 className="font-bold text-xl mt-2">Glycan Discovery</h3>
          <p className="text-gray-600">
            Explore curated 3D models and sequence alignments.
          </p>
        </div>
        <div>
          <FaRobot className="mx-auto text-blue-500" size={40} />
          <h3 className="font-bold text-xl mt-2">AI-powered Analytics</h3>
          <p className="text-gray-600">
            Predict immunogenicity and analyze mutations with deep learning.
          </p>
        </div>
        <div>
          <FaAtom className="mx-auto text-blue-500" size={40} />
          <h3 className="font-bold text-xl mt-2">Interactive Visualizer</h3>
          <p className="text-gray-600">
            View glycan structures in 3D and customize rendering in real time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
