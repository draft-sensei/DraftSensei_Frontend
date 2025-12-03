import React from "react";
import HeroCard from "./HeroCard";

const DraftBoard = ({
  allyPicks = [],
  enemyPicks = [],
  allyBans = [],
  enemyBans = [],
  currentPhase,
  onRemoveHero,
  onBanForTeam,
}) => {
  const EmptySlot = ({ onClick, team, index, type = "pick" }) => (
    <div
      className="w-20 h-24 border-2 border-dashed border-gray-600/50 rounded-xl flex items-center justify-center cursor-pointer hover:border-cyan-400/50 transition-all duration-300 group"
      onClick={onClick}
    >
      <div className="text-gray-500 text-xs font-medium group-hover:text-cyan-400 transition-colors duration-300 text-center">
        <div>{team}</div>
        <div>
          {type} {index + 1}
        </div>
      </div>
    </div>
  );

  const BanSlot = ({ hero, team, index }) => {
    if (hero) {
      return (
        <div className="relative group">
          <HeroCard hero={hero} size="small" />
          <div className="absolute inset-0 bg-red-900/80 rounded-xl flex items-center justify-center">
            <span className="text-red-300 text-xs font-bold">BANNED</span>
          </div>
          {/* Remove button */}
          <button
            onClick={() => onRemoveHero?.(hero, team.toLowerCase(), "ban")}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 flex items-center justify-center"
          >
            ×
          </button>
        </div>
      );
    }

    // Show empty slot with ban option during ban phases
    if (currentPhase === "ban_phase_1" || currentPhase === "ban_phase_2") {
      const canBan =
        (currentPhase === "ban_phase_1" &&
          ((team === "Ally" && allyBans.length < 3) ||
            (team === "Enemy" && enemyBans.length < 3))) ||
        (currentPhase === "ban_phase_2" &&
          ((team === "Ally" && allyBans.length < 5) ||
            (team === "Enemy" && enemyBans.length < 5)));

      return (
        <EmptySlot
          team={team}
          index={index}
          type="ban"
          onClick={() => canBan && console.log(`Ready to ban for ${team}`)}
        />
      );
    }

    return (
      <EmptySlot team={team} index={index} type="ban" onClick={() => {}} />
    );
  };

  const renderTeamSlots = (picks, team, teamColor) => {
    return (
      <div className="space-y-4">
        <h3 className={`text-lg font-bold text-center ${teamColor}`}>
          {team} Team
        </h3>
        <div className="flex gap-2 justify-center">
          {Array.from({ length: 5 }, (_, index) => {
            const hero = picks[index];
            if (hero) {
              return (
                <div key={index} className="relative group">
                  <HeroCard
                    hero={hero}
                    size="normal"
                    onSelect={() =>
                      onRemoveHero?.(hero, team.toLowerCase(), "pick")
                    }
                  />
                  <button
                    onClick={() =>
                      onRemoveHero?.(hero, team.toLowerCase(), "pick")
                    }
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              );
            }
            return (
              <EmptySlot
                key={index}
                team={team}
                index={index}
                onClick={() => {}}
              />
            );
          })}
        </div>
      </div>
    );
  };

  const renderBanSection = (bans, team, teamColor) => {
    return (
      <div className="space-y-2">
        <h4 className={`text-sm font-semibold text-center ${teamColor}`}>
          {team} Bans
        </h4>
        <div className="flex gap-1 justify-center">
          {Array.from({ length: 5 }, (_, index) => (
            <BanSlot key={index} hero={bans[index]} team={team} index={index} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30">
      <div className="space-y-6">
        {/* Ban Section */}
        {(currentPhase === "ban_phase_1" ||
          currentPhase === "ban_phase_2" ||
          currentPhase === "pick_phase" ||
          currentPhase === "complete") && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-center text-red-400">
                Banned Heroes
              </h2>

              {/* Team Ban Buttons */}
              {(currentPhase === "ban_phase_1" ||
                currentPhase === "ban_phase_2") && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const event = new CustomEvent("selectBanTeam", {
                        detail: "ally",
                      });
                      window.dispatchEvent(event);
                    }}
                    disabled={
                      (currentPhase === "ban_phase_1" &&
                        allyBans.length >= 3) ||
                      (currentPhase === "ban_phase_2" && allyBans.length >= 5)
                    }
                    className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
                      (currentPhase === "ban_phase_1" &&
                        allyBans.length >= 3) ||
                      (currentPhase === "ban_phase_2" && allyBans.length >= 5)
                        ? "bg-gray-600/30 text-gray-500 cursor-not-allowed"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30"
                    }`}
                  >
                    Ban for Ally ({allyBans.length}/
                    {currentPhase === "ban_phase_1" ? "3" : "5"})
                  </button>
                  <button
                    onClick={() => {
                      const event = new CustomEvent("selectBanTeam", {
                        detail: "enemy",
                      });
                      window.dispatchEvent(event);
                    }}
                    disabled={
                      (currentPhase === "ban_phase_1" &&
                        enemyBans.length >= 3) ||
                      (currentPhase === "ban_phase_2" && enemyBans.length >= 5)
                    }
                    className={`px-3 py-1 text-xs rounded-lg transition-all duration-200 ${
                      (currentPhase === "ban_phase_1" &&
                        enemyBans.length >= 3) ||
                      (currentPhase === "ban_phase_2" && enemyBans.length >= 5)
                        ? "bg-gray-600/30 text-gray-500 cursor-not-allowed"
                        : "bg-red-500/20 text-red-300 border border-red-400/30 hover:bg-red-500/30"
                    }`}
                  >
                    Ban for Enemy ({enemyBans.length}/
                    {currentPhase === "ban_phase_1" ? "3" : "5"})
                  </button>
                </div>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {renderBanSection(allyBans, "Ally", "text-emerald-400")}
              {renderBanSection(enemyBans, "Enemy", "text-red-400")}
            </div>
          </div>
        )}

        {/* Picks Section */}
        {(currentPhase === "pick_phase" || currentPhase === "complete") && (
          <div className="space-y-8">
            <div className="flex items-center justify-center">
              <div className="h-px bg-linear-to-r from-transparent via-gray-500 to-transparent w-full"></div>
              <span className="px-4 text-gray-400 font-bold text-lg">
                PICKS
              </span>
              <div className="h-px bg-linear-to-r from-transparent via-gray-500 to-transparent w-full"></div>
            </div>

            {/* Ally Team */}
            {renderTeamSlots(allyPicks, "Ally", "text-emerald-400")}

            {/* VS Divider */}
            <div className="flex items-center justify-center">
              <div className="h-px bg-linear-to-r from-transparent via-gray-500 to-transparent w-full"></div>
              <span className="px-4 text-gray-400 font-bold text-lg">VS</span>
              <div className="h-px bg-linear-to-r from-transparent via-gray-500 to-transparent w-full"></div>
            </div>

            {/* Enemy Team */}
            {renderTeamSlots(enemyPicks, "Enemy", "text-red-400")}
          </div>
        )}

        {/* Ban Phase Only - Show simplified view */}
        {(currentPhase === "ban_phase_1" || currentPhase === "ban_phase_2") &&
          !(currentPhase === "pick_phase" || currentPhase === "complete") && (
            <div className="text-center py-8">
              <p className="text-gray-400">Picks will appear after ban phase</p>
            </div>
          )}
      </div>
    </div>
  );
};

export default DraftBoard;
