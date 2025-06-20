import React, { useState } from "react";
import {
  FaChevronDown,
  FaTimes,
  FaTools,
  FaMicroscope,
  FaAlignLeft,
  FaBrain,
  FaFlask,
  FaRegWindowClose,
} from "react-icons/fa";
import { NavLink } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

const sidebarNavConfig = [
  {
    title: "Create",
    icon: <FaTools className="text-blue-500" />,
    items: [
      { to: "/GlycanMolecule", label: "Glycan Molecule" },
      { to: "/BiosyntheticNetworks", label: "Biosynthetic Networks" },
    ],
  },
  {
    title: "Analyse",
    icon: <FaMicroscope className="text-green-500" />,
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
    icon: <FaFlask className="text-orange-500" />,
    items: [
      { to: "/GlycanInsight", label: "Glycan Insight" },
      { to: "/researchPapers", label: "Research Papers with PubMed AI" },
      { to: "/DatasetDownloader", label: "Dataset Downloader" },
      { to: "/PDBsearch", label: "PDB Search" },
      { to: "/history", label: "Glycobiology History" },
    ],
  },
  {
    title: "Align",
    icon: <FaAlignLeft className="text-purple-500" />,
    items: [{ to: "/sequenceAlignment", label: "Sequence Alignment" }],
  },
  {
    title: "Predict",
    icon: <FaBrain className="text-pink-500" />,
    items: [{ to: "/prediction", label: "Immunogenicity Prediction" }],
  },
];

const navItems = [
  { to: "/", label: "Home" },
  { label: "Tools" },
  { to: "/aboutus", label: "About" },
  { to: "/contactus", label: "Contact" },
];

const NavBar = ({
  isSidebarOpen,
  toggleSidebar,
  handleLinkClick,
  isAuthenticated,
  onOpenModal,
  onSignOut,
}) => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    sidebarNavConfig[0].title
  );
  const activeSection = sidebarNavConfig.find(
    (s) => s.title === activeCategory
  );

  return (
    <>
      {/* Desktop nav remains the same */}
      <div className="flex items-center space-x-8">
        {navItems.map((item) => (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() =>
              item.label === "Tools" && setIsMegaMenuOpen(true)
            }
            onMouseLeave={() =>
              item.label === "Tools" && setIsMegaMenuOpen(false)
            }
          >
            {item.to ? (
              <NavLink
                to={item.to}
                onClick={handleLinkClick}
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
              <button className="text-gray-800 font-bold text-lg flex items-center hover:text-blue-600 transition px-3 py-2">
                {item.label}
                <FaChevronDown
                  className={`ml-1 transition-transform duration-200 ${
                    isMegaMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
            {item.label === "Tools" && (
              <AnimatePresence>
                {isMegaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute top-full mt-4 -translate-x-1/2 left-1/2 w-[44rem] bg-white/95 backdrop-blur-lg rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden"
                  >
                    <div className="flex">
                      <div className="w-1/3 border-r border-gray-200 bg-gray-50/50 flex flex-col justify-between">
                        <ul className="p-3">
                          {sidebarNavConfig.map((section) => (
                            <li key={section.title}>
                              <button
                                onMouseEnter={() =>
                                  setActiveCategory(section.title)
                                }
                                className={`w-full text-left flex items-center p-3 rounded-md transition-colors duration-150 font-semibold text-base ${
                                  activeCategory === section.title
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {React.cloneElement(section.icon, {
                                  className: `${
                                    activeCategory === section.title
                                      ? "text-white"
                                      : section.icon.props.className
                                  } mr-3`,
                                })}
                                {section.title}
                              </button>
                            </li>
                          ))}
                        </ul>
                        <div className="p-3 border-t border-gray-200">
                          <button
                            onClick={() => setIsMegaMenuOpen(false)}
                            className="w-full text-left flex items-center p-3 rounded-md transition-colors duration-150 font-semibold text-gray-600 hover:bg-red-100 hover:text-red-700"
                          >
                            <FaRegWindowClose className="mr-3" />
                            Close
                          </button>
                        </div>
                      </div>
                      <div className="w-2/3 p-5">
                        <h3 className="font-bold text-lg text-gray-800 mb-3">
                          {activeSection?.title}
                        </h3>
                        {activeSection &&
                          activeSection.items.map((menuItem) => (
                            <NavLink
                              key={menuItem.label}
                              to={menuItem.to}
                              onClick={() => {
                                handleLinkClick();
                                setIsMegaMenuOpen(false);
                              }}
                              className={({ isActive }) =>
                                `block px-4 py-2.5 rounded-lg transition duration-200 font-medium text-sm mb-1 ${
                                  isActive
                                    ? "bg-blue-100 text-blue-800"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`
                              }
                            >
                              {menuItem.label}
                            </NavLink>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        ))}
      </div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              onClick={toggleSidebar}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-0 left-0 h-full bg-white/95 backdrop-blur-lg shadow-xl z-50 w-80 md:hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-300">
                <h2 className="text-xl font-bold text-blue-600">Menu</h2>
                <button
                  onClick={toggleSidebar}
                  className="text-gray-600 hover:text-gray-900"
                  aria-label="Close menu"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-[calc(100vh-65px)] flex flex-col">
                <div className="flex-grow">
                  {sidebarNavConfig.map((section) => (
                    <div key={section.title} className="mb-4">
                      <h3 className="text-md font-semibold text-gray-800 flex items-center mb-2 px-2">
                        {React.cloneElement(section.icon, {
                          className: `${section.icon.props.className} mr-3`,
                        })}
                        {section.title}
                      </h3>
                      <ul className="space-y-1">
                        {section.items.map((item) => (
                          <li key={item.label}>
                            <NavLink
                              to={item.to}
                              onClick={handleLinkClick}
                              className={({ isActive }) =>
                                `block px-3 py-2 rounded-md font-medium ${
                                  isActive
                                    ? "bg-blue-100 text-blue-800"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`
                              }
                            >
                              {item.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {/* --- UPDATED AUTH SECTION FOR MOBILE --- */}
                <div className="border-t pt-4 mt-4 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <NavLink
                        to="/dashboard"
                        onClick={handleLinkClick}
                        className="block w-full text-center font-bold text-lg bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 py-2 px-4 rounded-md"
                      >
                        Dashboard
                      </NavLink>
                      <button
                        onClick={onSignOut}
                        className="w-full font-bold text-lg bg-red-500 text-white hover:bg-red-600 h-10 py-2 px-4 rounded-md"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onOpenModal("signIn")}
                        className="w-full font-bold text-lg bg-blue-600 text-white hover:bg-blue-700 h-10 py-2 px-4 rounded-md"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => onOpenModal("signUp")}
                        className="w-full font-bold text-lg bg-gray-200 text-gray-800 hover:bg-gray-300 h-10 py-2 px-4 rounded-md"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
