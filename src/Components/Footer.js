import React from "react";
import { Link } from "react-router";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FiChevronUp } from "react-icons/fi";


const sidebarNavConfig = [
  {
    title: "Create",
    items: [
      { to: "/GlycanMolecule", label: "Glycan Molecule" },
      { to: "/BiosyntheticNetworks", label: "Biosynthetic Networks" },
    ],
  },
  {
    title: "Analyse",
    items: [
      { to: "/characterize", label: "Characterize" },
      { to: "/DescriptorCalculator", label: "Generate Descriptor" },
      { to: "/GlycanFormatConverter", label: "Convert between formats" },
      { to: "/visualize", label: "3D Visualize" },
      { to: "/GlycanDrawer", label: "2D Drawer" },
      { to: "/pathwayMaps", label: "KEGG Pathway Viewer" },
      { to: "/MotifMutation", label: "Motif Mutation" },
    ],
  },
  {
    title: "Browse",
    items: [
      { to: "/researchPapers", label: "Research Papers with PubMed AI" },
      { to: "/DatasetDownloader", label: "Dataset Downloader" },
      { to: "/PDBsearch", label: "PDB Search" },
      { to: "/history", label: "Glycobiology History" },
    ],
  },
  {
    title: "Align",
    items: [{ to: "/sequenceAlignment", label: "Sequence Alignment" }],
  },
  {
    title: "Predict",
    items: [{ to: "/prediction", label: "Immunogenicity Prediction" }],
  },
];

const navItems = [
  { to: "/", label: "Home" },
  { label: "Tools" },
  { to: "/aboutus", label: "About" },
  { to: "/contactus", label: "Contact" },
];
// --- End of data ---

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const siteLinks = navItems.filter((item) => item.to && item.to !== "/");

  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white py-10 mt-10 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Branding & Social Links */}
          <div className="space-y-4 flex-shrink-0">
            <Link
              to="/"
              // Added hover:bg-transparent to prevent background color changes
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity hover:bg-transparent"
            >
              <span className="text-3xl font-bold text-gray-200 tracking-wide">
                Glycan<span className="text-blue-400">Bench</span>
              </span>
            </Link>
            <p className="text-sm text-gray-300 max-w-xs">
              AI-powered platform accelerating research in Glycomics.
            </p>
            <div className="flex gap-4 text-gray-300">
              {/* Added hover:bg-transparent to all social links */}
              <a href="#" className="hover:text-blue-400 hover:bg-transparent">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="hover:text-blue-400 hover:bg-transparent">
                <FaSquareXTwitter size={24} />
              </a>
              <a href="#" className="hover:text-blue-400 hover:bg-transparent">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="hover:text-blue-400 hover:bg-transparent">
                <FaInstagram size={24} />
              </a>
            </div>
          </div>

          {/* DYNAMICALLY GENERATED NAVIGATION SECTIONS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-x-8 gap-y-6 text-sm text-gray-200 w-full">
            {sidebarNavConfig.map((section) => (
              <div key={section.title}>
                <h4 className="font-semibold mb-2">{section.title}</h4>
                <ul className="space-y-1">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        // Added hover:bg-transparent here
                        className="hover:underline hover:text-blue-300 hover:bg-transparent"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="font-semibold mb-2">GlycanBench</h4>
              <ul className="space-y-1">
                {siteLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      // Added hover:bg-transparent here
                      className="hover:underline hover:text-blue-300 hover:bg-transparent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Scroll to Top */}
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
        <div className="mt-4 text-center text-sm text-gray-400 border-t border-blue-600 pt-6">
          © {new Date().getFullYear()} GlycanBench. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
