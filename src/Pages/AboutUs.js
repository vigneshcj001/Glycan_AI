const AboutUs = () => {
  return (
    <div className="bg-gradient-to-br from-white to-blue-50 min-h-screen px-6 py-12">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6">
          About GlycoAI
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Welcome to{" "}
          <span className="font-semibold text-blue-700">GlycoAI</span> — the
          intersection of
          <span className="font-semibold text-blue-700">
            {" "}
            artificial intelligence
          </span>{" "}
          and <span className="font-semibold text-blue-700">glycobiology</span>.
          We are a research-driven initiative aiming to redefine how the
          scientific community understands and leverages the power of glycans
          through modern machine learning and graph-based AI technologies.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mt-12 text-left">
          {/* Mission Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600">
            <h2 className="text-2xl font-bold text-blue-700 mb-3">
              🌱 Our Mission
            </h2>
            <p className="text-gray-700">
              To accelerate discoveries in immunology, microbiology, and
              personalized medicine by building AI tools that understand and
              predict glycan functions, structures, and interactions.
            </p>
          </div>

          {/* Vision Section */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600">
            <h2 className="text-2xl font-bold text-blue-700 mb-3">
              🔭 Our Vision
            </h2>
            <p className="text-gray-700">
              To become the go-to global platform for AI-powered glycomics
              research—fostering collaboration, innovation, and deeper
              biological understanding through explainable and scalable
              technologies.
            </p>
          </div>

          {/* What We Offer */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600">
            <h2 className="text-2xl font-bold text-blue-700 mb-3">
              🚀 What We Offer
            </h2>
            <ul className="list-disc list-inside text-gray-700">
              <li>AI models for glycan immunogenicity prediction</li>
              <li>Interactive 3D structure visualization tools</li>
              <li>Sequence alignment and glycan motif analysis</li>
              <li>Open access to curated research and datasets</li>
            </ul>
          </div>

          {/* Who We Serve */}
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600">
            <h2 className="text-2xl font-bold text-blue-700 mb-3">
              👥 Who We Serve
            </h2>
            <p className="text-gray-700">
              Researchers, data scientists, clinicians, and students across
              bioinformatics, immunology, infectious disease, and computational
              biology who seek intelligent, intuitive, and impactful tools in
              glycoscience.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">
            Ready to explore the glycan universe with AI?
          </h3>
          <p className="text-lg text-gray-700 mb-6">
            Join us in transforming glycoscience through artificial
            intelligence. Explore our models, tools, and publications—or
            contribute your own!
          </p>
          <a
            href="/resources"
            className="bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium shadow hover:bg-blue-800 transition duration-300"
          >
            Explore Resources
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
