import React, { useState } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

const ContactUs = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-xl shadow-xl">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-6">
          Contact Us
        </h1>
        <p className="text-lg text-center text-gray-700 mb-10">
          We'd love to hear from you! Whether you have questions, suggestions,
          or want to collaborate, feel free to reach out.
        </p>

        {formSubmitted ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-blue-100 text-blue-800 p-6 rounded-lg text-center shadow-md"
          >
            <h3 className="text-2xl font-bold">Thank you for reaching out!</h3>
            <p>We'll get back to you as soon as possible.</p>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {["Full Name", "Email Address", "Subject"].map((label, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-blue-900">
                    {label}
                  </label>
                  <input
                    type={label.includes("Email") ? "email" : "text"}
                    className="mt-1 block w-full px-5 py-3 border border-blue-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder={
                      label === "Full Name"
                        ? "Vigneshwaran C J"
                        : label === "Email Address"
                        ? "vigneshwarancj@example.com"
                        : "Your Subject"
                    }
                    required={label !== "Subject"}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-blue-900">
                  Message
                </label>
                <textarea
                  rows="5"
                  className="mt-1 block w-full px-5 py-3 border border-blue-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your message here..."
                ></textarea>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition duration-300"
              >
                Send Message 🚀
              </motion.button>
            </form>
            <div className="space-y-8 text-blue-900">
              {[
                {
                  title: "📍 Address",
                  desc: "SASTRA Deemed University, Thanjavur, Tamil Nadu, India",
                },
                {
                  title: "📧 Email",
                  desc: (
                    <a
                      href="mailto:vigneshwarancj@gmail.com"
                      className="text-blue-600 hover:underline"
                    >
                      contact@GlycanBench.org
                    </a>
                  ),
                },
                {
                  title: "🔗 Follow Us",
                  desc: (
                    <div className="flex space-x-6">
                      {["Twitter", "GitHub", "LinkedIn"].map((platform, i) => (
                        <a
                          key={i}
                          href="#"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {platform}
                        </a>
                      ))}
                    </div>
                  ),
                },
              ].map((item, idx) => (
                <Tilt
                  key={idx}
                  glareEnable={true}
                  glareMaxOpacity={0.15}
                  scale={1.02}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * idx, duration: 0.5 }}
                    className="bg-blue-50 p-5 rounded-lg shadow-md hover:shadow-lg"
                  >
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <div>{item.desc}</div>
                  </motion.div>
                </Tilt>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
