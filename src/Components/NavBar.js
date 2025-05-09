import React, { useState } from "react";
import { FaBars, FaChevronDown } from "react-icons/fa";
import Button from "../UI/button";

// Navigation items
const navItems = [
  { to: "/", label: "Home" },
  {
    label: "Analysis",
    children: [
      { to: "/visualize", label: "Visualization" },
      { to: "/prediction", label: "Prediction" },
      { to: "/history", label: "History" },
      { to: "/sequenceAlignment", label: "Sequence Alignment" },
    ],
  },
  {
    label: "Others",
    children: [
      { to: "/resources", label: "Resources" },
      { to: "/blog", label: "Blog" },
    ],
  },
  { to: "/aboutus", label: "About Us" },
  { to: "/contactus", label: "Contact Us" },
];

const NavBar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSignIn, setIsSignIn] = useState(true);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const toggleAuth = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <nav className="w-full bg-white px-6 py-4 flex items-center justify-between">
      {/* Left side spacer (no logo) */}
      <div className="flex-1" />

      {/* Center menu items */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-12 items-center">
        {navItems.map((item) => (
          <div key={item.label} className="relative">
            {item.children ? (
              <button
                className="text-gray-700 hover:text-blue-600 flex items-center font-bold text-lg space-x-1 whitespace-nowrap"
                onClick={() => toggleDropdown(item.label)}
              >
                <span>{item.label}</span>
                <FaChevronDown className="w-4 h-4" />
              </button>
            ) : (
              <a
                href={item.to}
                className="text-gray-700 hover:text-blue-600 transition font-bold text-lg whitespace-nowrap"
              >
                {item.label}
              </a>
            )}

            {/* Dropdown Menu */}
            {openDropdown === item.label && item.children && (
              <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md w-48 z-10">
                {item.children.map((child) => (
                  <a
                    key={child.label}
                    href={child.to}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sign In / Sign Up */}
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
