import React, { useState } from "react";

const ContactUs = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-6">
          Contact Us
        </h1>
        <p className="text-lg text-center text-gray-700 mb-10">
          We'd love to hear from you! Whether you have questions, suggestions,
          or want to collaborate, feel free to reach out.
        </p>

        {formSubmitted ? (
          <div className="bg-green-100 text-green-800 p-6 rounded-lg text-center">
            <h3 className="text-2xl font-bold">Thank you for reaching out!</h3>
            <p>We'll get back to you as soon as possible.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Jane Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="jane.doe@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Subject of your message"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  rows="5"
                  className="mt-1 block w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your message here..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Send Message
              </button>
            </form>

            {/* Contact Info */}
            <div className="space-y-8 text-gray-800">
              <div>
                <h3 className="text-xl font-semibold">📍 Address</h3>
                <p>SASTRA Deemed University, Thanjavur, Tamil Nadu, India</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">📧 Email</h3>
                <p>
                  <a
                    href="mailto:contact@glycoai.org"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    contact@glycoai.org
                  </a>
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">🔗 Follow Us</h3>
                <div className="flex space-x-6">
                  <a
                    href="https://twitter.com/glycoai"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Twitter
                  </a>
                  <a
                    href="https://github.com/glycoai"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/company/glycoai"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
