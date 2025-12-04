import React from "react";

const HeroCard = ({
  hero,
  onSelect,
  isSelected,
  isDisabled,
  size = "normal",
}) => {
  const sizeClasses = {
    small: "w-20 h-24",
    normal: "w-24 h-28",
    large: "w-28 h-32",
  };

  const textSizeClasses = {
    small: "text-xs",
    normal: "text-sm",
    large: "text-base",
  };

  const roleColors = {
    Tank: "bg-blue-500/60 text-blue-100 border-blue-400/30",
    Fighter: "bg-red-500/60 text-red-100 border-red-400/30",
    Assassin: "bg-purple-500/60 text-purple-100 border-purple-400/30",
    Mage: "bg-indigo-500/60 text-indigo-100 border-indigo-400/30",
    Marksman: "bg-yellow-500/60 text-yellow-100 border-yellow-400/30",
    Support: "bg-green-500/60 text-green-100 border-green-400/30",
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
        <div className="h-3/4 w-full overflow-hidden flex items-start justify-center bg-gradient-to-br from-gray-700 to-gray-800">
          {hero.image ? (
            <img
              src={hero.image}
              alt={hero.name}
              className="w-full min-h-[240] object-cover object-top"
              onError={(e) => {
                e.target.style.display = "none";
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = "flex";
                }
              }}
            />
          ) : null}
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
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-violet-400/0 to-emerald-400/0 group-hover:from-cyan-400/20 group-hover:via-violet-400/20 group-hover:to-emerald-400/20 transition-all duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default HeroCard;
