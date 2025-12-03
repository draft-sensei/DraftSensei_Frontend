import React from "react";
import HeroCard from "./HeroCard";
import {
  SparklesIcon,
  ShieldCheckIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";

const SuggestionPanel = ({
  suggestions = [],
  synergyScore = 0,
  counterScore = 0,
  roleBalance = {},
  isLoading = false,
  currentPhase = "setup",
}) => {
  const ScoreBar = ({ label, value, color, icon: Icon }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <span className="text-sm text-gray-300">{label}</span>
        </div>
        <span className="text-sm font-medium text-white">
          {Math.round(value * 100)}%
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${color.replace(
            "text-",
            "bg-"
          )}`}
          style={{ width: `${value * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const RoleIcon = ({ role, count }) => {
    const roleIcons = {
      tank: "🛡️",
      fighter: "⚔️",
      assassin: "🗡️",
      mage: "🔮",
      marksman: "🏹",
      support: "💚",
    };

    const roleColors = {
      tank:
        count > 0
          ? "bg-blue-500/20 text-blue-300"
          : "bg-gray-600/20 text-gray-500",
      fighter:
        count > 0
          ? "bg-red-500/20 text-red-300"
          : "bg-gray-600/20 text-gray-500",
      assassin:
        count > 0
          ? "bg-purple-500/20 text-purple-300"
          : "bg-gray-600/20 text-gray-500",
      mage:
        count > 0
          ? "bg-indigo-500/20 text-indigo-300"
          : "bg-gray-600/20 text-gray-500",
      marksman:
        count > 0
          ? "bg-yellow-500/20 text-yellow-300"
          : "bg-gray-600/20 text-gray-500",
      support:
        count > 0
          ? "bg-green-500/20 text-green-300"
          : "bg-gray-600/20 text-gray-500",
    };

    return (
      <div
        className={`flex flex-col items-center p-2 rounded-lg ${roleColors[role]}`}
      >
        <span className="text-lg">{roleIcons[role]}</span>
        <span className="text-xs font-medium capitalize">{role}</span>
        <span className="text-sm font-bold">{count}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30 h-full">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <SparklesIcon className="h-6 w-6 text-cyan-400" />
        <h2 className="text-xl font-bold text-white">
          {currentPhase === "ban_phase_1" || currentPhase === "ban_phase_2"
            ? "AI Ban Suggestions"
            : "AI Pick Suggestions"}
        </h2>
      </div>

      {/* Suggested Picks */}
      {suggestions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
            {currentPhase === "ban_phase_1" || currentPhase === "ban_phase_2"
              ? "Priority Bans"
              : "Recommended Picks"}
          </h3>
          <div className="space-y-3">
            {suggestions.slice(0, 3).map((suggestion, index) => (
              <div
                key={suggestion.id}
                className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div className="shrink-0">
                  <HeroCard hero={suggestion} size="small" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-white truncate">
                      {suggestion.name}
                    </p>
                    <span className="text-xs text-cyan-400 font-medium">
                      {Math.round((suggestion.confidence || 0) * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {suggestion.reason || "Good synergy with team composition"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team Analysis */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
          Team Analysis
        </h3>

        {/* Score Bars */}
        <div className="space-y-4">
          <ScoreBar
            label="Team Synergy"
            value={synergyScore}
            color="text-emerald-400"
            icon={ShieldCheckIcon}
          />
          <ScoreBar
            label="Counter Potential"
            value={counterScore}
            color="text-violet-400"
            icon={BoltIcon}
          />
        </div>

        {/* Role Balance */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Role Balance
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(roleBalance).map(([role, count]) => (
              <RoleIcon key={role} role={role} count={count || 0} />
            ))}
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="border-t border-gray-600/30 pt-4">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
          Tips
        </h4>
        <p className="text-xs text-gray-400">
          {currentPhase === "setup"
            ? "Choose who has first pick to start the draft."
            : currentPhase === "ban_phase_1" || currentPhase === "ban_phase_2"
            ? "Ban meta heroes and champions that counter your strategy."
            : suggestions.length > 0
            ? "Consider the recommended picks to optimize your team composition."
            : "Select heroes to get AI-powered suggestions and team analysis."}
        </p>
      </div>
    </div>
  );
};

export default SuggestionPanel;
