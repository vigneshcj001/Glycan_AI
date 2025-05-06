import React from "react";
import { Link } from "react-router";

const Logo = () => {
  return (
    <div className="text-3xl font-bold text-blue-600 tracking-wide">
      <Link to="/" className="hover:opacity-80 transition-opacity">
        Glyco<span className="text-gray-800">AI</span>
      </Link>
    </div>
  );
};

export default Logo;
