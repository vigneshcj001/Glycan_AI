import React, { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaChevronDown,
  FaTimes,
  FaTools,
  FaMicroscope,
  FaAlignLeft,
  FaBrain,
  FaMagic,
  FaFlask,
} from "react-icons/fa";
import { NavLink } from "react-router";
import { motion } from "framer-motion";
import Button from "../UI/button";

const navItems = [
  { to: "/", label: "Home" },
  { label: "Tools" },
  { to: "/aboutus", label: "About" },
  { to: "/contactus", label: "Contact" },
];

const sidebarNavConfig = [
  {
    title: "Create",
    icon: <FaTools className="text-blue-500 mr-2" />,
    items: [
      { to: "/GlycanBuilder", label: "Glycan Builder" },
      { to: "/glycanNetwork", label: "Network Analysis" },
    ],
  },
  {
    title: "Analyse",
    icon: <FaMicroscope className="text-green-500 mr-2" />,
    items: [
      { to: "/visualize", label: "Glycan Visualization" },
      { to: "/characterize", label: "Structural Characterization" },
      { to: "/pathwayMaps", label: "Pathway Maps" },
      { to: "/conversion", label: "Format Conversion" },
      { to: "/DescriptorCalculator", label: "Descriptor Calculation" },
      { to: "/researchPapers", label: "Research Papers" },
      { to: "/resources", label: "Data Repositories" },
      { to: "/history", label: "Analysis History" },
    ],
  },
  {
    title: "Align",
    icon: <FaAlignLeft className="text-purple-500 mr-2" />,
    items: [{ to: "/sequenceAlignment", label: "Sequence Alignment" }],
  },
  {
    title: "Predict",
    icon: <FaBrain className="text-pink-500 mr-2" />,
    items: [{ to: "/prediction", label: "Immunogenicity Prediction" }],
  },
  {
    title: "Innovate",
    icon: <FaMagic className="text-yellow-500 mr-2" />,
    items: [
      { to: "/glycoGPT", label: "Glyco-GPT Explorer" },
    ],
  },

];

const NavBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const sidebarRef = useRef();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleAuth = () => setIsSignIn(!isSignIn);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-10 mt-3">
        {navItems.map((item) => (
          <div key={item.label}>
            {item.to ? (
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `text-lg font-bold px-3 py-2 transition duration-150 rounded-md ${
                    isActive
                      ? "text-blue-700 underline"
                      : "text-gray-800 hover:text-blue-600"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <button
                onClick={toggleSidebar}
                className="text-gray-800 font-bold text-lg flex items-center hover:text-blue-600 transition"
              >
                {item.label}
                <FaChevronDown className="ml-1" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center space-x-4 ml-auto pr-4">
        <Button onClick={toggleAuth} className="font-bold text-lg">
          {isSignIn ? "Sign In" : "Sign Up"}
        </Button>
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <FaBars className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-white/90 backdrop-blur-lg shadow-xl z-50 transform transition-transform duration-300 ease-in-out w-80 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <h2 className="text-xl font-bold text-blue-600">Tools & Features</h2>
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Close menu"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-65px)]">
          {sidebarNavConfig.map((section) => (
            <motion.div
              key={section.title}
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h3 className="text-md font-semibold text-gray-800 flex items-center mb-3 px-2">
                {section.icon}
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `block px-3 py-2 rounded-md transition duration-200 font-medium ${
                          isActive
                            ? "bg-blue-100 text-blue-800"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-800"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NavBar;
