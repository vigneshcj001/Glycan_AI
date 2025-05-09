import React, { useEffect } from "react";
import { Link } from "react-router";
import { FaMicroscope, FaRobot, FaAtom } from "react-icons/fa";
import * as NGL from "ngl";

const HeroSection = () => {
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
    <div className="relative bg-gradient-to-br from-blue-50 to-white min-h-screen flex flex-col justify-between overflow-hidden">
      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row items-center justify-between p-10 md:p-20 z-10">
        {/* Left: Text */}
        <div className="max-w-xl space-y-6 animate-fade-in-up">
          <h1 className="text-5xl font-extrabold text-blue-800 leading-tight">
            Welcome to <span className="text-blue-500">GlycoAI</span>
          </h1>
          <p className="text-lg text-gray-700">
            Empowering AI-driven glycomics with 3D molecular visualization,
            smart analysis, and real-time prediction tools to revolutionize
            biomedical research.
          </p>

          <div className="flex gap-4">
            <Link
              to="/visualize"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform shadow-md"
            >
              Visualize 3D Glycan
            </Link>
            <Link
              to="http://localhost:1234/resources"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-100 hover:scale-105 transition-transform shadow-sm"
            >
              Explore Tools
            </Link>
          </div>
        </div>

        {/* Right: 3D Molecule Viewer */}
        <div className="mt-10 lg:mt-0 w-full lg:w-1/2 flex justify-center animate-fade-in">
          <div
            id="glycan-viewer"
            className="w-80 h-80 rounded-3xl border border-blue-100 shadow-lg"
          ></div>
        </div>
      </main>

      {/* Info Highlights */}
      <section className="px-8 py-12 bg-blue-50 grid md:grid-cols-3 gap-8 text-center z-10">
        <div className="hover:scale-105 transition-transform">
          <FaMicroscope className="mx-auto text-blue-500" size={40} />
          <h3 className="font-bold text-xl mt-2">Glycan Discovery</h3>
          <p className="text-gray-600">
            Explore curated 3D models and advanced alignments.
          </p>
        </div>
        <div className="hover:scale-105 transition-transform">
          <FaRobot className="mx-auto text-blue-500" size={40} />
          <h3 className="font-bold text-xl mt-2">AI-Powered Analytics</h3>
          <p className="text-gray-600">
            Predict immunogenicity and analyze complex patterns.
          </p>
        </div>
        <div className="hover:scale-105 transition-transform">
          <FaAtom className="mx-auto text-blue-500" size={40} />
          <h3 className="font-bold text-xl mt-2">Interactive Visualizer</h3>
          <p className="text-gray-600">
            Real-time 3D interaction with molecular structures.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
