import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

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
      const response = await api.get("/heroes");
      return response.data;
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

// Mock data for development
const mockHeroes = [
  {
    id: 1,
    name: "Alucard",
    role: "Fighter",
    image: "/heroes/alucard.jpg",
    winRate: 52.5,
  },
  {
    id: 2,
    name: "Miya",
    role: "Marksman",
    image: "/heroes/miya.jpg",
    winRate: 48.3,
  },
  {
    id: 3,
    name: "Eudora",
    role: "Mage",
    image: "/heroes/eudora.jpg",
    winRate: 51.2,
  },
  {
    id: 4,
    name: "Tigreal",
    role: "Tank",
    image: "/heroes/tigreal.jpg",
    winRate: 49.8,
  },
  {
    id: 5,
    name: "Fanny",
    role: "Assassin",
    image: "/heroes/fanny.jpg",
    winRate: 45.6,
  },
  {
    id: 6,
    name: "Rafaela",
    role: "Support",
    image: "/heroes/rafaela.jpg",
    winRate: 53.1,
  },
  {
    id: 7,
    name: "Layla",
    role: "Marksman",
    image: "/heroes/layla.jpg",
    winRate: 47.9,
  },
  {
    id: 8,
    name: "Gord",
    role: "Mage",
    image: "/heroes/gord.jpg",
    winRate: 50.4,
  },
  {
    id: 9,
    name: "Franco",
    role: "Tank",
    image: "/heroes/franco.jpg",
    winRate: 51.7,
  },
  {
    id: 10,
    name: "Karina",
    role: "Assassin",
    image: "/heroes/karina.jpg",
    winRate: 49.2,
  },
  {
    id: 11,
    name: "Alice",
    role: "Mage",
    image: "/heroes/alice.jpg",
    winRate: 52.8,
  },
  {
    id: 12,
    name: "Nana",
    role: "Mage",
    image: "/heroes/nana.jpg",
    winRate: 48.7,
  },
  {
    id: 13,
    name: "Saber",
    role: "Assassin",
    image: "/heroes/saber.jpg",
    winRate: 50.1,
  },
  {
    id: 14,
    name: "Minotaur",
    role: "Tank",
    image: "/heroes/minotaur.jpg",
    winRate: 49.5,
  },
  {
    id: 15,
    name: "Bruno",
    role: "Marksman",
    image: "/heroes/bruno.jpg",
    winRate: 51.3,
  },
  {
    id: 16,
    name: "Clint",
    role: "Marksman",
    image: "/heroes/clint.jpg",
    winRate: 50.8,
  },
  {
    id: 17,
    name: "Zilong",
    role: "Fighter",
    image: "/heroes/zilong.jpg",
    winRate: 48.9,
  },
  {
    id: 18,
    name: "Bane",
    role: "Fighter",
    image: "/heroes/bane.jpg",
    winRate: 47.6,
  },
  {
    id: 19,
    name: "Cyclops",
    role: "Mage",
    image: "/heroes/cyclops.jpg",
    winRate: 52.4,
  },
  {
    id: 20,
    name: "Freya",
    role: "Fighter",
    image: "/heroes/freya.jpg",
    winRate: 49.7,
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
    id: 11,
    name: "Alice",
    role: "Mage",
    confidence: 0.78,
    reason: "Good synergy with current picks and counters enemy",
  },
  {
    id: 19,
    name: "Cyclops",
    role: "Mage",
    confidence: 0.72,
    reason: "Safe pick with consistent damage output",
  },
];

export default api;
