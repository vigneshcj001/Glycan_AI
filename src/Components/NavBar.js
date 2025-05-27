import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaChevronDown } from "react-icons/fa";
import Button from "../UI/button";

const navItems = [
  { to: "/", label: "Home" },
  {
    label: "Data",
    children: [
      { to: "/visualize", label: "Glycan Visualization" }, // Glycan visualization
      { to: "/sequenceAlignment", label: "Sequence Alignment" }, // Glycan sequence alignment
      { to: "/characterize", label: "Structural Characterization" }, // Structural/functional analysis
      { to: "/glycanNetwork", label: "Network Analysis" }, // Glycan interaction/network analysis
    ],
  },
  {
    label: "Tools",
    children: [
      { to: "/prediction", label: "Immunogenicity Prediction" }, // Predict glycan immunogenicity
      { to: "/conversion", label: "Format Conversion" }, // Convert glycan formats (IUPAC, GlycoCT, WURCS)
      { to: "/DescriptorCalculator", label: "Descriptor Calculation" }, // Calculate descriptors (mass, composition)
      { to: "/GlycanBuilder", label: "Glycan Builder" }, // Interactive glycan construction tool
    ],
  },
  {
    label: "Resources",
    children: [
      { to: "/researchPapers", label: "Research Papers" }, // Key publications in glycomics
      { to: "/resources", label: "Data Repositories" }, // Glycan data, libraries, APIs
      { to: "/history", label: "Analysis History" }, // View past analyses and result
    ],
  },
  { to: "/aboutus", label: "About" },
  { to: "/contactus", label: "Contact" },
];

const NavBar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSignIn, setIsSignIn] = useState(true);
  const navRef = useRef();

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const toggleAuth = () => {
    setIsSignIn(!isSignIn);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="w-full bg-white px-6 py-4 flex items-center justify-between"
    >
      {/* Left spacer */}
      <div className="flex-1" />

      {/* Center menu */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-12 items-center">
        {navItems.map((item) => (
          <div key={item.label} className="relative">
            {item.children ? (
              <button
                className="text-gray-700 hover:text-blue-600 flex items-center font-bold text-lg space-x-1 whitespace-nowrap"
                onClick={() => toggleDropdown(item.label)}
              >
                <span>{item.label}</span>
                <FaChevronDown className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <a
                href={item.to}
                className="text-gray-700 hover:text-blue-600 transition font-bold text-lg whitespace-nowrap"
              >
                {item.label}
              </a>
            )}

            {openDropdown === item.label && item.children && (
              <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md w-56 z-10">
                {item.children.map((child) => (
                  <a
                    key={child.label}
                    href={child.to}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200 whitespace-nowrap"
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Auth button */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={toggleAuth}
          className="ml-4 font-bold text-lg whitespace-nowrap"
        >
          {isSignIn ? "Sign In" : "Sign Up"}
        </Button>
      </div>

      {/* Mobile menu icon */}
      <div className="md:hidden">
        <Button variant="ghost" size="icon">
          <FaBars className="w-6 h-6" />
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;          