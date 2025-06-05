import React from "react";
import Logo from "./Logo";
import NavBar from "./NavBar";

const Header = () => {
  return (
    <header className="w-full sticky top-0 z-50 bg-gradient-to-r from-white via-blue-50 to-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
        <div className="flex-1">
          <Logo />
        </div>
        <div className="flex-1 hidden md:flex justify-center">
          <NavBar />
        </div>
      </div>
    </header>
  );
};

export default Header;
