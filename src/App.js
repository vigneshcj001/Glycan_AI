import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./Components/Header";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import "./index.css";
import Home from "./Components/Home";
import VisualizePage from "./Pages/Analysis/Visualization/VisualizePage";
import Prediction from "./Pages/Analysis/Prediction/Prediction";
import SequenceAlignment from "./Pages/Analysis/History/SequenceAlignment";
import ResearchPapers from "./Pages/Others/ResearchPapers/ResearchPapers";
import Resources from "./Pages/Others/Resources/Resources";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import Footer from "./Components/Footer";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visualize" element={<VisualizePage />} />
          <Route path="/visualize/:pdbId" element={<VisualizePage />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/sequenceAlignment" element={<SequenceAlignment />} />
          <Route path="/researchPapers" element={<ResearchPapers />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/contactus" element={<ContactUs />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
