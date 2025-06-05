import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router";

// Global Styles
import "./index.css";

// Core Layout Components
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./Components/Home";

// Page Components
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";

// 'Align' Page Components
import SequenceAlignment from "./Pages/Align/SequenceAlignment/SequenceAlignment";

// 'Analyze' Page Components
import CharacterizeForm from "./Pages/Analyze/CharacterizeForm/CharacterizeForm";
import GlycanToolbox from "./Pages/Analyze/Conversion/GlycanToolbox";
import DescriptorCalculator from "./Pages/Analyze/DescriptorCalculator/DescriptorCalculator";
import History from "./Pages/Analyze/History/History";
import PathwayViewer from "./Pages/Analyze/PathwayViewer/PathwayViewer";
import ResearchPapers from "./Pages/Analyze/ResearchPapers/ResearchPapers";
import Resources from "./Pages/Analyze/Resources/Resources";
import VisualizePage from "./Pages/Analyze/Visualization/VisualizePage";

// 'Create' Page Components
import GlycanBuilder from "./Pages/Create/GlycanBuilder/GlycanBuilder";
import GlycanNetwork from "./Pages/Create/GlycanNetwork/GlycanNetwork";

// 'Innovate' Page Components
import GlycoGPTExplorer from "./Pages/Innovate/GlycoGPTExplorer/GlycoGPTExplorer";

// 'Predict' Page Components
import Prediction from "./Pages/Predict/Prediction/Prediction";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Core Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/glycoGPT" element={<GlycoGPTExplorer />} />

            {/* Feature Routes */}
            <Route path="/visualize" element={<VisualizePage />} />
            <Route path="/visualize/:pdbId" element={<VisualizePage />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/sequenceAlignment" element={<SequenceAlignment />} />
            <Route path="/characterize" element={<CharacterizeForm />} />
            <Route path="/characterizeData" element={<CharacterizeForm />} />
            <Route path="/glycanNetwork" element={<GlycanNetwork />} />
            <Route path="/conversion" element={<GlycanToolbox />} />
            <Route path="/history" element={<History />} />
            <Route path="/researchPapers" element={<ResearchPapers />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/GlycanBuilder" element={<GlycanBuilder />} />
            <Route
              path="/DescriptorCalculator"
              element={<DescriptorCalculator />}
            />
            <Route path="/pathwayMaps" element={<PathwayViewer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
