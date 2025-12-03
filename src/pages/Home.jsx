import React from "react";
import { Link } from "react-router-dom";
import {
  SparklesIcon,
  UserGroupIcon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <SparklesIcon className="h-20 w-20 text-cyan-400" />
          </div>
          <h1 className="text-5xl font-bold bg-linear-to-r from-cyan-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
            DraftSensei
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Master your Mobile Legends draft with AI-powered suggestions, team
            analysis, and strategic insights.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <FeatureCard
            to="/draft-simulator"
            icon={UserGroupIcon}
            title="Draft Simulator"
            description="Practice your draft strategy with real-time AI suggestions and team composition analysis."
            gradient="from-cyan-500 to-blue-500"
          />
          <FeatureCard
            to="/hero-list"
            icon={ListBulletIcon}
            title="Hero Database"
            description="Explore detailed hero information, roles, and statistics to make informed picks."
            gradient="from-violet-500 to-purple-500"
          />
        </div>

        {/* Call to Action */}
        <div className="mt-12">
          <p className="text-gray-400 mb-6">Ready to dominate the draft?</p>
          <Link
            to="/draft-simulator"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-linear-to-r from-cyan-500 to-violet-500 rounded-xl hover:from-cyan-600 hover:to-violet-600 transition-all duration-300 transform hover:scale-105 glow-cyan"
          >
            <SparklesIcon className="h-6 w-6 mr-2" />
            Start Drafting
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ to, icon: Icon, title, description, gradient }) => {
  return (
    <Link
      to={to}
      className="block p-8 bg-gray-800/60 backdrop-blur-sm border border-gray-600/30 rounded-2xl hover:border-cyan-400/50 transition-all duration-300 group transform hover:scale-105"
    >
      <div className="space-y-4">
        <div
          className={`w-16 h-16 mx-auto bg-linear-to-r ${gradient} rounded-xl flex items-center justify-center group-hover:glow-cyan transition-all duration-300`}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
};

export default Home;
