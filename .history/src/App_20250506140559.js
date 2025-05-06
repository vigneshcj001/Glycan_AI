import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./Components/Header";
import "../index.css"; const App = () => {
  return (
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Header />
        <main className="p-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to GlycoAI</h1>
          <p className="text-lg text-gray-600">
            Empowering AI-driven glycomics
          </p>
        </main>
      </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
