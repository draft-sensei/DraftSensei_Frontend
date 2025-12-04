import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Heroes API
export const heroesAPI = {
  getAllHeroes: async () => {
    try {
      const response = await api.get("/heroes/list");
      return response.data.heroes; // Extract the heroes array from the response
    } catch (error) {
      console.error("Error fetching heroes:", error);
      // Return mock data for development
      return mockHeroes;
    }
  },
};

// Draft suggestions API
export const draftAPI = {
  getSuggestions: async (allyPicks, enemyPicks, availableHeroes) => {
    try {
      const response = await api.post("/suggest_pick", {
        ally_picks: allyPicks,
        enemy_picks: enemyPicks,
        available_heroes: availableHeroes,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      // Return mock data for development
      return {
        suggested_picks: mockSuggestions,
        synergy_score: 0.75,
        counter_score: 0.65,
        role_balance: {
          tank: 1,
          fighter: 2,
          assassin: 1,
          mage: 1,
          marksman: 0,
          support: 0,
        },
      };
    }
  },
};

// Mock data for development (matching backend structure)
const mockHeroes = [
  {
    id: 1,
    name: "Lolita",
    role: "Tank",
    image:
      "https://kgapbcqtdpyhonznxwyu.supabase.co/storage/v1/object/public/hero-images/lolita.png",
    stats: {
      hp: 2709,
      mana: 430,
      attack_damage: 123,
      physical_defense: 22,
      magic_defense: 15,
      movement_speed: 240,
      attack_speed: 0.85,
    },
    counters: {
      Fanny: 75.0,
      Gusion: 70.0,
      Lancelot: 65.0,
      Ling: 60.0,
    },
    synergy: {
      Yin: 85.0,
      "Chang'e": 82.0,
      Hanabi: 75.0,
      Granger: 77.0,
    },
    created_at: "2025-12-04T09:53:42.862194+05:45",
    updated_at: null,
  },
  {
    id: 2,
    name: "Khufra",
    role: "Tank",
    image:
      "https://kgapbcqtdpyhonznxwyu.supabase.co/storage/v1/object/public/hero-images/khufra.png",
    stats: {
      hp: 2798,
      mana: 440,
      attack_damage: 130,
      physical_defense: 25,
      magic_defense: 15,
      movement_speed: 240,
      attack_speed: 0.9,
    },
    counters: {
      Fanny: 95.0,
      Gusion: 88.0,
      Ling: 90.0,
      Lancelot: 85.0,
      Hayabusa: 82.0,
    },
    synergy: {
      Yin: 90.0,
      Franco: 85.0,
      Hanabi: 82.0,
      Pharsa: 84.0,
    },
    created_at: "2025-12-04T09:53:42.862194+05:45",
    updated_at: null,
  },
  {
    id: 3,
    name: "Eudora",
    role: "Mage",
    image:
      "https://kgapbcqtdpyhonznxwyu.supabase.co/storage/v1/object/public/hero-images/eudora.png",
    stats: {
      hp: 2511,
      mana: 490,
      attack_damage: 115,
      physical_defense: 17,
      magic_defense: 25,
      movement_speed: 250,
      attack_speed: 0.8,
    },
    counters: {
      Hayabusa: 70.0,
      Fanny: 65.0,
      Gusion: 68.0,
    },
    synergy: {
      Tigreal: 80.0,
      Johnson: 75.0,
      Franco: 72.0,
    },
    created_at: "2025-12-04T09:53:42.862194+05:45",
    updated_at: null,
  },
  {
    id: 4,
    name: "Fanny",
    role: "Assassin",
    image:
      "https://kgapbcqtdpyhonznxwyu.supabase.co/storage/v1/object/public/hero-images/fanny.png",
    stats: {
      hp: 2491,
      mana: 0,
      attack_damage: 140,
      physical_defense: 18,
      magic_defense: 15,
      movement_speed: 260,
      attack_speed: 0.96,
    },
    counters: {
      Miya: 75.0,
      Layla: 80.0,
      Eudora: 70.0,
    },
    synergy: {
      Johnson: 85.0,
      Angela: 80.0,
      Estes: 75.0,
    },
    created_at: "2025-12-04T09:53:42.862194+05:45",
    updated_at: null,
  },
  {
    id: 5,
    name: "Miya",
    role: "Marksman",
    image:
      "https://kgapbcqtdpyhonznxwyu.supabase.co/storage/v1/object/public/hero-images/miya.png",
    stats: {
      hp: 2541,
      mana: 430,
      attack_damage: 125,
      physical_defense: 16,
      magic_defense: 15,
      movement_speed: 250,
      attack_speed: 0.95,
    },
    counters: {
      Gusion: 65.0,
      Lancelot: 70.0,
      Hayabusa: 68.0,
    },
    synergy: {
      Tigreal: 82.0,
      Lolita: 78.0,
      Minotaur: 75.0,
    },
    created_at: "2025-12-04T09:53:42.862194+05:45",
    updated_at: null,
  },
];

const mockSuggestions = [
  {
    id: 3,
    name: "Eudora",
    role: "Mage",
    confidence: 0.85,
    reason: "High burst damage complements team composition",
  },
  {
    id: 1,
    name: "Lolita",
    role: "Tank",
    confidence: 0.78,
    reason: "Good synergy with current picks and counters enemy",
  },
  {
    id: 4,
    name: "Fanny",
    role: "Assassin",
    confidence: 0.72,
    reason: "High mobility assassin for quick eliminations",
  },
];

export default api;
