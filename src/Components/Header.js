import React from "react";
import Logo from "./Logo"; 
import NavBar from "./NavBar"; 

const Header = () => {
  return (
    <header className="w-full bg-white sticky top-0 z-50">
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
