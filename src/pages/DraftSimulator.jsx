import React, { useState, useEffect } from "react";
import HeroGrid from "../components/HeroGrid";
import DraftBoard from "../components/DraftBoard";
import SuggestionPanel from "../components/SuggestionPanel";
import { heroesAPI, draftAPI } from "../services/api";
import {
  ArrowsRightLeftIcon,
  ArrowPathIcon,
  XMarkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

const DRAFT_PHASES = {
  SETUP: "setup",
  BAN_PHASE_1: "ban_phase_1", // 3+3 bans
  BAN_PHASE_2: "ban_phase_2", // 2+2 bans
  PICK_PHASE: "pick_phase",
  COMPLETE: "complete",
};

const DraftSimulator = () => {
  const [heroes, setHeroes] = useState([]);
  const [allyPicks, setAllyPicks] = useState([]);
  const [enemyPicks, setEnemyPicks] = useState([]);
  const [allyBans, setAllyBans] = useState([]);
  const [enemyBans, setEnemyBans] = useState([]);
  const [currentPhase, setCurrentPhase] = useState(DRAFT_PHASES.SETUP);
  const [hasFirstPick, setHasFirstPick] = useState(null); // true if ally has first pick
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [selectedBanTeam, setSelectedBanTeam] = useState(null); // 'ally' or 'enemy' for manual ban selection
  const [suggestions, setSuggestions] = useState([]);
  const [teamAnalysis, setTeamAnalysis] = useState({
    synergyScore: 0,
    counterScore: 0,
    roleBalance: {},
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [error, setError] = useState(null);

  // Pick order: [1, 2, 2, 2, 1] - true means ally turn, false means enemy turn
  const getPickOrder = (firstPick) => {
    if (firstPick) {
      return [true, false, false, true, true, false, false, true, true, false];
    } else {
      return [false, true, true, false, false, true, true, false, false, true];
    }
  };

  const getCurrentAction = () => {
    if (currentPhase === DRAFT_PHASES.SETUP) {
      return "Select who has first pick";
    }

    if (currentPhase === DRAFT_PHASES.BAN_PHASE_1) {
      const allyBansLeft = Math.max(0, 3 - allyBans.length);
      const enemyBansLeft = Math.max(0, 3 - enemyBans.length);
      return `Ban Phase 1: Ally needs ${allyBansLeft} bans, Enemy needs ${enemyBansLeft} bans`;
    }

    if (currentPhase === DRAFT_PHASES.BAN_PHASE_2) {
      const allyBansLeft = Math.max(0, 5 - allyBans.length);
      const enemyBansLeft = Math.max(0, 5 - enemyBans.length);
      return `Ban Phase 2: Ally needs ${allyBansLeft} bans, Enemy needs ${enemyBansLeft} bans`;
    }

    if (currentPhase === DRAFT_PHASES.PICK_PHASE) {
      const pickOrder = getPickOrder(hasFirstPick);
      const totalPicks = allyPicks.length + enemyPicks.length;

      if (totalPicks < 10) {
        const isAllyTurn = pickOrder[totalPicks];
        const remainingForTeam = isAllyTurn
          ? 5 - allyPicks.length
          : 5 - enemyPicks.length;
        return `Pick Phase: ${
          isAllyTurn ? "Your" : "Enemy"
        } turn to pick (${remainingForTeam} remaining)`;
      }
    }

    if (currentPhase === DRAFT_PHASES.COMPLETE) {
      return "Draft Complete!";
    }

    return "Unknown phase";
  };

  useEffect(() => {
    loadHeroes();
  }, []);

  useEffect(() => {
    if (heroes.length > 0) {
      updateSuggestions();
    }
  }, [allyPicks, enemyPicks, allyBans, enemyBans, heroes, currentPhase]);

  useEffect(() => {
    // Listen for ban team selection events from DraftBoard
    const handleBanTeamSelection = (event) => {
      setSelectedBanTeam(event.detail);
    };

    window.addEventListener("selectBanTeam", handleBanTeamSelection);

    return () => {
      window.removeEventListener("selectBanTeam", handleBanTeamSelection);
    };
  }, []);

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

  const updateSuggestions = async () => {
    if (currentPhase === DRAFT_PHASES.SETUP) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoadingSuggestions(true);
      const bannedHeroes = [...allyBans, ...enemyBans];
      const pickedHeroes = [...allyPicks, ...enemyPicks];
      const unavailableHeroes = [...bannedHeroes, ...pickedHeroes];

      const availableHeroes = heroes.filter(
        (hero) =>
          !unavailableHeroes.some((unavailable) => unavailable.id === hero.id)
      );

      let result;
      if (
        currentPhase === DRAFT_PHASES.BAN_PHASE_1 ||
        currentPhase === DRAFT_PHASES.BAN_PHASE_2
      ) {
        // For ban phase, suggest meta heroes to ban
        result = {
          suggested_picks: availableHeroes
            .sort((a, b) => (b.winRate || 50) - (a.winRate || 50))
            .slice(0, 5)
            .map((hero, index) => ({
              ...hero,
              confidence: 0.9 - index * 0.1,
              reason: `High priority ban - ${hero.winRate?.toFixed(
                1
              )}% win rate`,
            })),
        };
      } else {
        // For pick phase, get normal suggestions
        result = await draftAPI.getSuggestions(
          allyPicks.map((h) => h.id),
          enemyPicks.map((h) => h.id),
          availableHeroes.map((h) => h.id)
        );
      }

      // Match suggestion IDs with hero objects
      const suggestionsWithHeroes = result.suggested_picks.map((suggestion) => {
        const hero = heroes.find((h) => h.id === suggestion.id);
        return { ...hero, ...suggestion };
      });

      setSuggestions(suggestionsWithHeroes);

      if (result.synergy_score !== undefined) {
        setTeamAnalysis({
          synergyScore: result.synergy_score || 0,
          counterScore: result.counter_score || 0,
          roleBalance: result.role_balance || {},
        });
      }
    } catch (err) {
      console.error("Error getting suggestions:", err);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const startDraft = (allyFirst) => {
    setHasFirstPick(allyFirst);
    setCurrentPhase(DRAFT_PHASES.BAN_PHASE_1);
  };

  const handleHeroAction = (hero, forceTeam = null) => {
    const pickedHeroes = [...allyPicks, ...enemyPicks];

    // Only prevent picking already picked heroes, allow duplicate bans
    if (
      currentPhase === DRAFT_PHASES.PICK_PHASE &&
      pickedHeroes.some((h) => h.id === hero.id)
    ) {
      return; // Hero already picked
    }

    if (
      currentPhase === DRAFT_PHASES.BAN_PHASE_1 ||
      currentPhase === DRAFT_PHASES.BAN_PHASE_2
    ) {
      // Use selectedBanTeam if no forceTeam provided
      const teamToBanFor = forceTeam || selectedBanTeam;
      handleBan(hero, teamToBanFor);
      setSelectedBanTeam(null); // Reset selection after ban
    } else if (currentPhase === DRAFT_PHASES.PICK_PHASE) {
      handlePick(hero);
    }
  };

  const handleBan = (hero, forceTeam = null) => {
    if (currentPhase === DRAFT_PHASES.BAN_PHASE_1) {
      if (allyBans.length < 3 && (forceTeam === "ally" || forceTeam === null)) {
        setAllyBans([...allyBans, hero]);
      } else if (
        enemyBans.length < 3 &&
        (forceTeam === "enemy" || forceTeam === null)
      ) {
        setEnemyBans([...enemyBans, hero]);
      }

      // Check if phase 1 is complete
      const newAllyBans =
        forceTeam === "ally" ? allyBans.length + 1 : allyBans.length;
      const newEnemyBans =
        forceTeam === "enemy" ? enemyBans.length + 1 : enemyBans.length;

      if (newAllyBans >= 3 && newEnemyBans >= 3) {
        setCurrentPhase(DRAFT_PHASES.BAN_PHASE_2);
      }
    } else if (currentPhase === DRAFT_PHASES.BAN_PHASE_2) {
      if (allyBans.length < 5 && (forceTeam === "ally" || forceTeam === null)) {
        setAllyBans([...allyBans, hero]);
      } else if (
        enemyBans.length < 5 &&
        (forceTeam === "enemy" || forceTeam === null)
      ) {
        setEnemyBans([...enemyBans, hero]);
      }

      // Check if phase 2 is complete
      const newAllyBans =
        forceTeam === "ally" ? allyBans.length + 1 : allyBans.length;
      const newEnemyBans =
        forceTeam === "enemy" ? enemyBans.length + 1 : enemyBans.length;

      if (newAllyBans >= 5 && newEnemyBans >= 5) {
        setCurrentPhase(DRAFT_PHASES.PICK_PHASE);
      }
    }
  };

  const handlePick = (hero) => {
    const pickOrder = getPickOrder(hasFirstPick);
    const totalPicks = allyPicks.length + enemyPicks.length;

    if (totalPicks < 10) {
      const isAllyTurn = pickOrder[totalPicks];

      if (isAllyTurn && allyPicks.length < 5) {
        setAllyPicks([...allyPicks, hero]);
      } else if (!isAllyTurn && enemyPicks.length < 5) {
        setEnemyPicks([...enemyPicks, hero]);
      }

      if (totalPicks + 1 >= 10) {
        setCurrentPhase(DRAFT_PHASES.COMPLETE);
      }
    }
  };

  const isHeroUnavailable = (hero) => {
    const bannedHeroes = [...allyBans, ...enemyBans];
    const pickedHeroes = [...allyPicks, ...enemyPicks];
    return [...bannedHeroes, ...pickedHeroes].some((h) => h.id === hero.id);
  };

  const handleRemoveHero = (hero, team, type) => {
    if (type === "ban") {
      if (team === "ally") {
        setAllyBans(allyBans.filter((h) => h.id !== hero.id));
      } else {
        setEnemyBans(enemyBans.filter((h) => h.id !== hero.id));
      }
    } else if (type === "pick") {
      if (team === "ally") {
        setAllyPicks(allyPicks.filter((h) => h.id !== hero.id));
      } else {
        setEnemyPicks(enemyPicks.filter((h) => h.id !== hero.id));
      }
    }
  };

  const resetDraft = () => {
    setAllyPicks([]);
    setEnemyPicks([]);
    setAllyBans([]);
    setEnemyBans([]);
    setCurrentPhase(DRAFT_PHASES.SETUP);
    setHasFirstPick(null);
    setCurrentPickIndex(0);
    setSelectedBanTeam(null);
    setSuggestions([]);
    setTeamAnalysis({
      synergyScore: 0,
      counterScore: 0,
      roleBalance: {},
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-gray-300">Loading draft simulator...</p>
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
            Draft Simulator
          </h1>
          <p className="text-gray-300">
            Experience real Mobile Legends draft with ban and pick phases
          </p>
        </div>

        {/* Phase Indicator */}
        <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Current Phase:</span>
              <span
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  currentPhase === DRAFT_PHASES.SETUP
                    ? "bg-blue-500/20 text-blue-300"
                    : currentPhase === DRAFT_PHASES.BAN_PHASE_1 ||
                      currentPhase === DRAFT_PHASES.BAN_PHASE_2
                    ? "bg-red-500/20 text-red-300"
                    : currentPhase === DRAFT_PHASES.PICK_PHASE
                    ? "bg-green-500/20 text-green-300"
                    : "bg-violet-500/20 text-violet-300"
                }`}
              >
                {currentPhase === DRAFT_PHASES.SETUP && "Setup"}
                {currentPhase === DRAFT_PHASES.BAN_PHASE_1 && "Ban Phase 1"}
                {currentPhase === DRAFT_PHASES.BAN_PHASE_2 && "Ban Phase 2"}
                {currentPhase === DRAFT_PHASES.PICK_PHASE && "Pick Phase"}
                {currentPhase === DRAFT_PHASES.COMPLETE && "Complete"}
              </span>
            </div>
            <div className="text-sm text-gray-300">{getCurrentAction()}</div>
            <button
              onClick={resetDraft}
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white border border-gray-600/30 rounded-xl hover:border-cyan-400/50 transition-all duration-200"
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Setup Phase */}
        {currentPhase === DRAFT_PHASES.SETUP && (
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/30 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Who has first pick?
            </h2>
            <p className="text-gray-300 mb-8">
              This determines the pick order for the entire draft.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => startDraft(true)}
                className="flex items-center space-x-2 px-8 py-4 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-xl hover:bg-emerald-500/30 transition-all duration-200"
              >
                <CheckIcon className="h-5 w-5" />
                <span>We have first pick</span>
              </button>
              <button
                onClick={() => startDraft(false)}
                className="flex items-center space-x-2 px-8 py-4 bg-red-500/20 text-red-300 border border-red-400/30 rounded-xl hover:bg-red-500/30 transition-all duration-200"
              >
                <XMarkIcon className="h-5 w-5" />
                <span>Enemy has first pick</span>
              </button>
            </div>
          </div>
        )}

        {/* Draft Interface */}
        {currentPhase !== DRAFT_PHASES.SETUP && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Draft Board */}
            <div className="lg:col-span-2 space-y-6">
              <DraftBoard
                allyPicks={allyPicks}
                enemyPicks={enemyPicks}
                allyBans={allyBans}
                enemyBans={enemyBans}
                currentPhase={currentPhase}
                onRemoveHero={handleRemoveHero}
                onBanForTeam={(hero, team) => handleHeroAction(hero, team)}
              />

              {/* Hero Selection Grid */}
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-600/30">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    {currentPhase === DRAFT_PHASES.BAN_PHASE_1 ||
                    currentPhase === DRAFT_PHASES.BAN_PHASE_2
                      ? "Select Heroes to Ban"
                      : "Select Hero to Pick"}
                  </h3>
                  <div className="flex items-center space-x-4">
                    {(currentPhase === DRAFT_PHASES.BAN_PHASE_1 ||
                      currentPhase === DRAFT_PHASES.BAN_PHASE_2) &&
                      selectedBanTeam && (
                        <span
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            selectedBanTeam === "ally"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                              : "bg-red-500/20 text-red-300 border border-red-400/30"
                          }`}
                        >
                          Banning for{" "}
                          {selectedBanTeam === "ally" ? "Ally" : "Enemy"}
                        </span>
                      )}
                    <span className="text-sm text-gray-400">
                      {heroes.length -
                        (currentPhase === DRAFT_PHASES.PICK_PHASE
                          ? [...allyPicks, ...enemyPicks].length
                          : 0)}{" "}
                      available
                    </span>
                  </div>
                </div>

                <HeroGrid
                  heroes={heroes}
                  onSelectHero={handleHeroAction}
                  disabledHeroes={
                    currentPhase === DRAFT_PHASES.PICK_PHASE
                      ? [...allyPicks, ...enemyPicks] // Only disable picked heroes during pick phase
                      : [] // Allow duplicate bans
                  }
                />
              </div>
            </div>

            {/* Right Column - Suggestions Panel */}
            <div className="lg:col-span-1">
              <SuggestionPanel
                suggestions={suggestions}
                synergyScore={teamAnalysis.synergyScore}
                counterScore={teamAnalysis.counterScore}
                roleBalance={teamAnalysis.roleBalance}
                isLoading={isLoadingSuggestions}
                currentPhase={currentPhase}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftSimulator;
