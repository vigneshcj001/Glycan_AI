import React, { useState } from "react";
import { Link } from "react-router";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const navItems = [
  { to: "/", label: "Home" },
  {
    label: "Analysis",
    children: [
      { to: "/visualization", label: "Visualization" },
      { to: "/prediction", label: "Prediction" },
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

const Navbar = () => {
  return (
    <nav className="bg-white shadow">
      <ul className="flex space-x-6 p-4 relative">
        {navItems.map((item, index) => (
          <li key={index} className="relative">
            {item.children ? (
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
                    {item.label}
                    <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
                  </MenuButton>
                </div>

                <MenuItems className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black/5 transition">
                  <div className="py-1">
                    {item.children.map((child, i) => (
                      <MenuItem key={i}>
                        <Link
                          to={child.to}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                          {child.label}
                        </Link>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>
            ) : (
              <Link
                to={item.to}
                className="text-gray-800 hover:text-blue-500 font-medium"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
