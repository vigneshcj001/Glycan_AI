// src/components/AuthModal.js

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

// A placeholder button component for use within the modal
const AuthButton = ({
  children,
  onClick,
  type = "button",
  primary = false,
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`w-full font-bold text-lg h-12 rounded-md transition-colors ${
      primary
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
    }`}
  >
    {children}
  </button>
);

const AuthModal = ({ isOpen, onClose, onSwitchMode, mode, onSignIn }) => {
  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd handle form data here
    onSignIn(); // Simulate successful sign-in
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-md m-4 p-8"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <FaTimes size={24} />
            </button>

            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              {mode === "signIn" ? "Welcome Back!" : "Create Account"}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {mode === "signUp" && (
                <div>
                  <label
                    className="block text-sm font-medium text-gray-600 mb-1"
                    htmlFor="name"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}
              <div>
                <label
                  className="block text-sm font-medium text-gray-600 mb-1"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-600 mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="pt-4">
                <AuthButton type="submit" primary>
                  {mode === "signIn" ? "Sign In" : "Sign Up"}
                </AuthButton>
              </div>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                {mode === "signIn"
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  onClick={onSwitchMode}
                  className="font-semibold text-blue-600 hover:underline ml-1"
                >
                  {mode === "signIn" ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
