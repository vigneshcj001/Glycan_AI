import React from "react";
import { Link } from "react-router";

const ResearchPapers = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen py-10">
      {/* Research Papers Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-4">
          Research Papers on Glycan Studies
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Explore cutting-edge research papers that utilize deep learning
          techniques in the study of glycan-mediated host-microbe interactions,
          glycan structure prediction, lectin binding, and more. Dive into these
          studies to understand the evolving landscape of glycan-based research.
        </p>
      </header>

      {/* Highlighted Research Papers */}
      <section className="max-w-6xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-blue-600">
          <img
            src="https://via.placeholder.com/1200x600"
            alt="Research Paper"
            className="w-full h-60 object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-blue-700">
              Deep-Learning Resources for Studying Glycan-Mediated Host-Microbe
              Interactions
            </h2>
            <p className="text-gray-600 mt-4">
              This research delves into various deep-learning models and their
              applications in studying glycan-mediated interactions between
              hosts and microbes. A comprehensive overview of the algorithms,
              models, and future research directions is provided.
            </p>
            <a
              href="https://www.sciencedirect.com/science/article/pii/S193131282030562X"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 mt-6 inline-block text-lg font-medium hover:underline"
            >
              Read Full Paper
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-blue-600">
          <img
            src="https://via.placeholder.com/1200x600"
            alt="Research Paper"
            className="w-full h-60 object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-blue-700">
              SweetOrigins: Extracting Evolutionary Information from Glycans
            </h2>
            <p className="text-gray-600 mt-4">
              This paper explores the evolutionary significance of glycans,
              using deep learning models to uncover insights into glycan
              evolution and their implications in biological processes.
            </p>
            <a
              href="https://www.biorxiv.org/content/10.1101/2020.04.08.031948.full"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 mt-6 inline-block text-lg font-medium hover:underline"
            >
              Read Full Paper
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-blue-600">
          <img
            src="https://via.placeholder.com/1200x600"
            alt="Research Paper"
            className="w-full h-60 object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-blue-700">
              Higher-Order Message Passing for Glycan Representation Learning
            </h2>
            <p className="text-gray-600 mt-4">
              This paper introduces a novel higher-order message-passing method
              to enhance the learning process of glycan representations,
              improving the model's prediction accuracy.
            </p>
            <a
              href="https://arxiv.org/abs/2409.13467"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 mt-6 inline-block text-lg font-medium hover:underline"
            >
              Read Full Paper
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-blue-600">
          <img
            src="https://via.placeholder.com/1200x600"
            alt="Research Paper"
            className="w-full h-60 object-cover"
          />
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-blue-700">
              GLAMOUR: Graph Learning over Macromolecule Representations
            </h2>
            <p className="text-gray-600 mt-4">
              This research explores GLAMOUR, a model that applies graph
              learning techniques to macromolecule representations, improving
              glycan-related predictive modeling.
            </p>
            <a
              href="https://arxiv.org/abs/2103.02565"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 mt-6 inline-block text-lg font-medium hover:underline"
            >
              Read Full Paper
            </a>
          </div>
        </div>
      </section>

      {/* Additional Research Papers */}
      <section className="max-w-6xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold text-blue-800 text-center mb-10">
          More Research Papers
        </h2>
        <ul className="list-disc pl-8 space-y-4 text-gray-700">
          <li>
            <a
              href="https://onlinelibrary.wiley.com/doi/full/10.1002/advs.202103807"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              LectinOracle: A Generalizable Deep Learning Model for
              Lectin-Glycan Binding Prediction
            </a>
          </li>
          <li>
            <a
              href="https://www.sciencedirect.com/science/article/pii/S2211124721006161"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Using Graph Convolutional Neural Networks to Learn a
              Representation for Glycans
            </a>
          </li>
          <li>
            <a
              href="https://pubs.rsc.org/en/content/articlelanding/2022/sc/d1sc05681f"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GlyNet: A Multi-task Neural Network for Predicting Protein–Glycan
              Interactions
            </a>
          </li>
          <li>
            <a
              href="https://www.researchgate.net/publication/366814100_Glycan_Immunogenicity_Prediction_with_Efficient_Automatic_Graph_Neural_Network"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Glycan Immunogenicity Prediction with Efficient Automatic Graph
              Neural Network
            </a>
          </li>
          <li>
            <a
              href="https://pubs.acs.org/doi/abs/10.1021/acschembio.1c00689"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              A Useful Guide to Lectin Binding: Machine-Learning Directed
              Annotation of 57 Unique Lectin Specificities
            </a>
          </li>
          <li>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/35163392/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Systemic Lectin-Glycan Interaction of Pathogenic Enteric Bacteria
              in the Gastrointestinal Tract
            </a>
          </li>
          <li>
            <a
              href="https://peerj.com/articles/cs-1069/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              An Analytical Study on the Identification of N-linked
              Glycosylation Sites Using Machine Learning Model
            </a>
          </li>
          <li>
            <a
              href="https://pubs.acs.org/doi/10.1021/acs.chemrev.2c00110"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Glycoinformatics in the Artificial Intelligence Era
            </a>
          </li>
          <li>
            <a
              href="https://www.researchgate.net/publication/371055705_GNNGLY_Graph_Neural_Networks_for_Glycan_Classification"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              GNNGLY: Graph Neural Networks for Glycan Classification
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default ResearchPapers;
