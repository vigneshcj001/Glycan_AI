import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import "./index.css";
import Header from "./Components/Header";
import Home from "./Components/Home";
import VisualizePage from "./Pages/Data/Visualization/VisualizePage";
import SequenceAlignment from "./Pages/Data/SequenceAlignment/SequenceAlignment";
import DataCharacterizeForm from "./Pages/Data/CharacterizeForm/CharacterizeForm";
import AnalysisCharacterizeForm from "./Pages/Data/CharacterizeForm/CharacterizeForm";
import Prediction from "./Pages/Tools/Prediction/Prediction";
import History from "./Pages/Resources/History/History";
import GlycanNetwork from "./Pages/Data/GlycanNetwork/GlycanNetwork";
import GlycanToolbox from "./Pages/Tools/Conversion/GlycanToolbox";
import ResearchPapers from "./Pages/Resources/ResearchPapers/ResearchPapers";
import Resources from "./Pages/Resources/Resources/Resources";
import GlycanBuilder from "./Pages/Tools/GlycanBuilder/GlycanBuilder";
import DescriptorCalculator from "./Pages/Tools/DescriptorCalculator/DescriptorCalculator";
import PathwayViewer from "./Pages/Data/PathwayViewer/PathwayViewer";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
import Footer from "./Components/Footer";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/visualize" element={<VisualizePage />} />
            <Route path="/visualize/:pdbId" element={<VisualizePage />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/sequenceAlignment" element={<SequenceAlignment />} />
            <Route path="/characterize" element={<AnalysisCharacterizeForm />} />
            <Route path="/characterizeData" element={<DataCharacterizeForm />} />
            <Route path="/glycanNetwork" element={<GlycanNetwork />} />
            <Route path="/conversion" element={<GlycanToolbox />} />
            <Route path="/history" element={<History />} />
            <Route path="/researchPapers" element={<ResearchPapers />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/GlycanBuilder" element={<GlycanBuilder />} />
            <Route path="/DescriptorCalculator" element={<DescriptorCalculator />} />
            <Route path="/pathwayMaps" element={<PathwayViewer />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/contactus" element={<ContactUs />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);