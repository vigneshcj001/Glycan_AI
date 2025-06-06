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

// 'Align' Page Components
import SequenceAlignment from "./Pages/Align/SequenceAlignment/SequenceAlignment";

// 'Analyze' Page Components
import CharacterizeForm from "./Pages/Analyze/CharacterizeForm/CharacterizeForm";
import DescriptorCalculator from "./Pages/Analyze/DescriptorCalculator/DescriptorCalculator";
import History from "./Pages/Analyze/History/History";
import PathwayViewer from "./Pages/Analyze/PathwayViewer/PathwayViewer";
import ResearchPapers from "./Pages/Analyze/ResearchPapers/ResearchPapers";
import DatasetDownloader from "./Pages/Analyze/DatasetDownloader/DatasetDownloader";
import GlycanSearch from "./Pages/Analyze/GlycanSearch/GlycanSearch";
import VisualizePage from "./Pages/Analyze/Visualization/VisualizePage";
import MotifMutation  from "./Pages/Analyze/MotifMutation/MotifMutation";
import GlycanDrawer from "./Pages/Analyze/GlycanDrawer/GlycanDrawer";
import GlycanFormatConverter from "./Pages/Analyze/GlycanFormatConverter/GlycanFormatConverter";

// 'Create' Page Components
import GlycanMolecule from "./Pages/Create/GlycanMolecule/GlycanMolecule";
import BiosyntheticNetworks from "./Pages/Create/BiosyntheticNetworks/BiosyntheticNetworks";

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
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/contactus" element={<ContactUs />} />

            {/* Feature Routes */}
            <Route path="/visualize" element={<VisualizePage />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/sequenceAlignment" element={<SequenceAlignment />} />
            <Route path="/characterize" element={<CharacterizeForm />} />
            <Route path="/characterizeData" element={<CharacterizeForm />} />
            <Route
              path="/BiosyntheticNetworks"
              element={<BiosyntheticNetworks />}
            />
            <Route path="/history" element={<History />} />
            <Route path="/MotifMutation" element={<MotifMutation />} />
            <Route path="/researchPapers" element={<ResearchPapers />} />
            <Route path="/DatasetDownloader" element={<DatasetDownloader />} />
            <Route path="/PDBsearch" element={<GlycanSearch />} />
            <Route path="/GlycanMolecule" element={<GlycanMolecule />} />
            <Route path="/GlycanDrawer" element={<GlycanDrawer />} />
            <Route
              path="GlycanFormatConverter"
              element={<GlycanFormatConverter />}
            />
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
