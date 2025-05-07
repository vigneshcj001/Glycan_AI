import React from "react";
import { Link } from "react-router"; 
import { Menu, Transition } from "@headlessui/react";

const navItems = [
  { to: "/", label: "Home" },
  {
    label: "Analysis",
    children: [
      { to: "/visualization", label: "Visualization" },
      { to: "/prediction", label: "Prediction" },
      { to: "/history", label: "History" },
    ],
  },
  {
    label: "Others",
    children: [
      { to: "/resources", label: "Resources" },
      { to: "/blog", label: "Blog" },
    ],
  },
  { to: "/login", label: "Login" },
  { to: "/signup", label: "Sign Up" },
  { to: "/aboutus", label: "About Us" },
  { to: "/contactus", label: "Contact Us" },
];

const NavBar = () => {
  return (
    <nav className="bg-white border border-gray-200 rounded-lg shadow-md px-6 py-2">
      <div className="flex items-center space-x-6 text-gray-800 font-semibold">
        {navItems.map((item, index) => (
          <div key={index} className="relative">
            {item.children ? (
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-blue-100 transition">
                  {item.label}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Menu.Button>
                <Transition
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute left-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    {item.children.map((child, i) => (
                      <Menu.Item key={i}>
                        {({ active }) => (
                          <Link
                            to={child.to}
                            className={`block px-4 py-2 text-sm ${
                              active
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-blue-100"
                            }`}
                          >
                            {child.label}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link
                to={item.to}
                className="px-3 py-2 rounded-md hover:bg-blue-100 transition"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default NavBar; // ✅ Fix: was misspelled as NavbBar
