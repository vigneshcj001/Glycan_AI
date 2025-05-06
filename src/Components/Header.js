import React from "react";
import Logo from "./Logo";
import Navbar from "./NavBar";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">
        <Logo />
        <Navbar/>
      </div>
    </header>
  );
};

export default Header;
