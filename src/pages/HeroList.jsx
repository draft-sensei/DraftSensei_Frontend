import React, { useState, useEffect } from "react";
import HeroGrid from "../components/HeroGrid";
import { heroesAPI } from "../services/api";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

const HeroList = () => {
  const [heroes, setHeroes] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const roles = [
    "All",
    "Tank",
    "Fighter",
    "Assassin",
    "Mage",
    "Marksman",
    "Support",
  ];

  useEffect(() => {
    loadHeroes();
  }, []);

  useEffect(() => {
    filterHeroes();
  }, [heroes, searchTerm, selectedRole]);

  const loadHeroes = async () => {
    try {
      setIsLoading(true);
      const data = await heroesAPI.getAllHeroes();
      setHeroes(data);
      setError(null);
    } catch (err) {
      setError("Failed to load heroes");
      console.error("Error loading heroes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterHeroes = () => {
    let filtered = heroes;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((hero) =>
        hero.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (selectedRole !== "All") {
      filtered = filtered.filter((hero) => hero.role === selectedRole);
    }

    setFilteredHeroes(filtered);
  };

  const handleHeroSelect = (hero) => {
    // In a full implementation, this could open a hero detail modal
    console.log("Selected hero:", hero);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-gray-300">Loading heroes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">{error}</p>
          <button
            onClick={loadHeroes}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-linear-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
            Hero Database
          </h1>
          <p className="text-gray-300">
            Explore all {heroes.length} heroes in Mobile Legends
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search heroes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-200"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="pl-10 pr-8 py-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-200 appearance-none cursor-pointer"
              >
                {roles.map((role) => (
                  <option key={role} value={role} className="bg-gray-800">
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Results */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
            <span>
              Showing {filteredHeroes.length} of {heroes.length} heroes
              {selectedRole !== "All" && ` • ${selectedRole} role`}
              {searchTerm && ` • "${searchTerm}"`}
            </span>
            {(searchTerm || selectedRole !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRole("All");
                }}
                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Heroes Grid */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30">
          {filteredHeroes.length > 0 ? (
            <HeroGrid heroes={filteredHeroes} onSelectHero={handleHeroSelect} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">No heroes found</p>
              <p className="text-gray-500 text-sm">
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroList;
