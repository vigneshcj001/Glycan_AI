
import React, { useState } from "react";
import Logo from "./Logo";
import NavBar from "./NavBar";
import AuthModal from "../Pages/AuthModal"; 
import { FaBars } from "react-icons/fa";
import { NavLink } from "react-router"; 

// Placeholder button component
const Button = ({ onClick, children, className, variant, size }) => {
  const baseStyle =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost: "hover:bg-gray-200 text-gray-800",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };
  const sizes = { default: "h-10 py-2 px-4", icon: "h-10 w-10" };
  const buttonClass = `${baseStyle} ${sizes[size] || sizes.default} ${
    variants[variant] || variants.default
  } ${className || ""}`;
  return (
    <button onClick={onClick} className={buttonClass}>
      {children}
    </button>
  );
};

const Header = () => {
  // --- All application state now lives here ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signIn"); // 'signIn' or 'signUp'

  // --- Functions to manage state ---
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleOpenModal = (mode) => {
    setAuthMode(mode);
    setIsModalOpen(true);
    setIsSidebarOpen(false); // Close sidebar if it's open
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSwitchAuthMode = () => {
    setAuthMode((prevMode) => (prevMode === "signIn" ? "signUp" : "signIn"));
  };

  const handleSignIn = () => {
    setIsAuthenticated(true);
    handleCloseModal();
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  const handleLinkClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="w-full sticky top-0 z-40 bg-gradient-to-r from-white via-blue-50 to-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <div className="hidden md:flex justify-center">
            {/* Pass only necessary props down */}
            <NavBar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              handleLinkClick={handleLinkClick}
              isAuthenticated={isAuthenticated}
              onOpenModal={handleOpenModal}
              onSignOut={handleSignOut}
            />
          </div>

          <div className="flex items-center justify-end flex-shrink-0 space-x-4">
            {/* --- UI changes based on authentication state --- */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/dashboard"
                    className="font-semibold px-4 py-2 text-gray-700 hover:text-blue-600"
                  >
                    Dashboard
                  </NavLink>
                  <Button
                    onClick={handleSignOut}
                    variant="danger"
                    className="font-semibold"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => handleOpenModal("signIn")}
                    variant="ghost"
                    className="font-semibold"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => handleOpenModal("signUp")}
                    className="font-semibold"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <FaBars className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Render the modal, controlled by state from this component */}
      <AuthModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={authMode}
        onSwitchMode={handleSwitchAuthMode}
        onSignIn={handleSignIn}
      />
    </>
  );
};

export default Header;
