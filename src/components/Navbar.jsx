import React from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <SparklesIcon className="h-8 w-8 text-cyan-400" />
            <span className="ml-2 text-xl font-bold bg-linear-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              DraftSensei
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" icon={HomeIcon} text="Home" />
              <NavLink
                to="/draft-simulator"
                icon={UserGroupIcon}
                text="Draft Simulator"
              />
              <NavLink to="/hero-list" icon={SparklesIcon} text="Hero List" />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white p-2">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon: Icon, text }) => {
  return (
    <Link
      to={to}
      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200 group"
    >
      <Icon className="h-4 w-4 mr-2 group-hover:text-cyan-400 transition-colors duration-200" />
      {text}
    </Link>
  );
};

export default Navbar;
