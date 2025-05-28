import React from "react";
import { Link } from "react-router";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FiChevronUp } from "react-icons/fi";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white py-10 mt-10 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-10">
        {/* Logo and Socials */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-3">
            <Link
              to="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-3xl font-bold text-gray-200 tracking-wide">
                Glyco<span className="text-blue-400">AI</span>
              </span>
            </Link>
            <p className="text-sm text-gray-300 max-w-xs">
              AI-powered platform accelerating research in Glycomics.
            </p>
            <div className="flex gap-4 text-gray-300">
              <Link to="#" className="hover:text-blue-400">
                <FaFacebook size={24} />
              </Link>
              <Link to="#" className="hover:text-blue-400">
                <FaSquareXTwitter size={24} />
              </Link>
              <Link to="#" className="hover:text-blue-400">
                <FaLinkedin size={24} />
              </Link>
              <Link to="#" className="hover:text-blue-400">
                <FaInstagram size={24} />
              </Link>
            </div>
          </div>

          {/* Links in a single horizontal row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-200 w-full md:w-auto">
            {/* Data */}
            <div>
              <h4 className="font-semibold mb-2">Data</h4>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/visualize"
                    className="hover:underline hover:text-blue-300"
                  >
                    Glycan Visualization
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sequenceAlignment"
                    className="hover:underline hover:text-blue-300"
                  >
                    Sequence Alignment
                  </Link>
                </li>
                <li>
                  <Link
                    to="/characterize"
                    className="hover:underline hover:text-blue-300"
                  >
                    Structural Characterization
                  </Link>
                </li>
                <li>
                  <Link
                    to="/glycanNetwork"
                    className="hover:underline hover:text-blue-300"
                  >
                    Network Analysis
                  </Link>
                </li>
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h4 className="font-semibold mb-2">Tools</h4>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/prediction"
                    className="hover:underline hover:text-blue-300"
                  >
                    Immunogenicity Prediction
                  </Link>
                </li>
                <li>
                  <Link
                    to="/conversion"
                    className="hover:underline hover:text-blue-300"
                  >
                    Format Conversion
                  </Link>
                </li>
                <li>
                  <Link
                    to="/DescriptorCalculator"
                    className="hover:underline hover:text-blue-300"
                  >
                    Descriptor Calculation
                  </Link>
                </li>
                <li>
                  <Link
                    to="/GlycanBuilder"
                    className="hover:underline hover:text-blue-300"
                  >
                    Glycan Builder
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-2">Resources</h4>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/researchPapers"
                    className="hover:underline hover:text-blue-300"
                  >
                    Research Papers
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources"
                    className="hover:underline hover:text-blue-300"
                  >
                    Data Repositories
                  </Link>
                </li>
                <li>
                  <Link
                    to="/history"
                    className="hover:underline hover:text-blue-300"
                  >
                    Analysis History
                  </Link>
                </li>
              </ul>
            </div>

            {/* Name (Company) */}
            <div>
              <h4 className="font-semibold mb-2">GlycoAI</h4>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/aboutus"
                    className="hover:underline hover:text-blue-300"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contactus"
                    className="hover:underline hover:text-blue-300"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        <div className="text-center mt-4">
          <button
            onClick={scrollToTop}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-transform transform hover:scale-110"
            aria-label="Scroll to Top"
          >
            <FiChevronUp size={24} />
          </button>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} GlycoAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
