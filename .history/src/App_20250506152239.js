import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./Components/Header";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import "../index.css";

const App = () => {
  return (
    <Router>
      {" "}
      {/* Wrap your app with BrowserRouter */}
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Header />
        <main className="p-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to GlycoAI</h1>
          <p className="text-lg text-gray-600">
            Empowering AI-driven glycomics
          </p>
        </main>
      </div>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
