import React from "react";
import { Link } from "react-router"; 
import GlycanAILOGO from "../../images/GlycoAI_logo.png";

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
    >
    
      <span className="text-3xl font-bold text-blue-600 tracking-wide">
        Glyco<span className="text-gray-800">AI</span>
      </span>
    </Link>
  );
};

export default Logo;
