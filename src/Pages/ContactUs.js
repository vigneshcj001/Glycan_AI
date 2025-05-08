// src/Pages/ContactUs.js
import React from "react";

const ContactUs = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg text-gray-700 mb-4">
        If you have any questions or feedback, feel free to reach out to us. We
        are always happy to help!
      </p>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-gray-700">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            placeholder="Enter your message"
            className="border p-2 w-full"
            rows="4"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
