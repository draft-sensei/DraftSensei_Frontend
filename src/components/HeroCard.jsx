import React from "react";

const HeroCard = ({
  hero,
  onSelect,
  isSelected,
  isDisabled,
  size = "normal",
}) => {
  const sizeClasses = {
    small: "w-16 h-20",
    normal: "w-20 h-24",
    large: "w-24 h-28",
  };

  const textSizeClasses = {
    small: "text-xs",
    normal: "text-sm",
    large: "text-base",
  };

  const roleColors = {
    Tank: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    Fighter: "bg-red-500/20 text-red-300 border-red-400/30",
    Assassin: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    Mage: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30",
    Marksman: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
    Support: "bg-green-500/20 text-green-300 border-green-400/30",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} cursor-pointer transition-all duration-300 group
        ${isSelected ? "scale-110 glow-cyan" : ""}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
      `}
      onClick={() => !isDisabled && onSelect?.(hero)}
    >
      <div className="relative h-full rounded-xl overflow-hidden bg-gray-800/60 backdrop-blur-sm border border-gray-600/30">
        {/* Hero Image */}
        <div className="h-3/4 bg-linear-to-br from-gray-700 to-gray-800 flex items-center justify-center">
          {hero.image ? (
            <img
              src={hero.image}
              alt={hero.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div className="flex items-center justify-center text-gray-400 text-xs font-medium">
            {hero.name}
          </div>
        </div>

        {/* Hero Info */}
        <div className="h-1/4 px-1 py-1 flex flex-col justify-center">
          <div
            className={`${textSizeClasses[size]} font-medium text-white truncate text-center`}
          >
            {hero.name}
          </div>
        </div>

        {/* Role Badge */}
        <div className="absolute top-1 right-1">
          <span
            className={`
              px-1 py-0.5 rounded text-xs font-medium border
              ${
                roleColors[hero.role] ||
                "bg-gray-500/20 text-gray-300 border-gray-400/30"
              }
            `}
          >
            {hero.role?.[0] || "U"}
          </span>
        </div>

        {/* Selected Overlay */}
        {isSelected && (
          <div className="absolute inset-0 border-2 border-cyan-400 rounded-xl bg-cyan-400/10"></div>
        )}

        {/* Disabled Overlay */}
        {isDisabled && (
          <div className="absolute inset-0 bg-gray-900/70 rounded-xl flex items-center justify-center">
            <span className="text-red-400 text-xs font-bold">PICKED</span>
          </div>
        )}

        {/* Hover Glow */}
        <div className="absolute inset-0 rounded-xl bg-linear-to-r from-cyan-400/0 via-violet-400/0 to-emerald-400/0 group-hover:from-cyan-400/20 group-hover:via-violet-400/20 group-hover:to-emerald-400/20 transition-all duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default HeroCard;
