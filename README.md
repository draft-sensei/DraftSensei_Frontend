# DraftSensei Frontend

A professional React + Tailwind CSS frontend for Mobile Legends Draft AI project.

## Features

### 🎮 Gaming Dashboard Design

- Dark theme with neon accents (cyan, violet, emerald)
- Smooth animations and hover effects
- Glassmorphism UI components with backdrop blur
- Gaming-inspired gradient borders and glows

### 🏠 Home Page

- Welcome screen with feature cards
- Navigation to Draft Simulator and Hero List
- Clean, modern design with call-to-action

### ⚔️ Draft Simulator

- Hero selection grid with role badges
- Ally and Enemy team slots (5 each)
- Real-time AI suggestions panel showing:
  - Top 3 recommended picks with confidence scores
  - Team synergy score bar
  - Counter potential score bar
  - Role balance indicators
- Toggle between "Pick for Ally" / "Pick for Enemy"
- Reset functionality

### 📋 Hero List

- Comprehensive hero database with search and filters
- Role-based filtering (Tank, Fighter, Assassin, Mage, Marksman, Support)
- Responsive grid layout
- Hero cards with role badges and hover effects

## Components

### Core Components

- **Navbar**: Navigation with gaming theme
- **HeroCard**: Reusable hero display with multiple sizes
- **HeroGrid**: Responsive grid layout for heroes
- **DraftBoard**: Team composition display (5v5)
- **SuggestionPanel**: AI recommendations and analysis

## API Integration

### Heroes API

- `GET /api/heroes` - Fetch all heroes
- Mock data included for development

### Draft Suggestions API

- `POST /api/suggest_pick` - Get AI recommendations
- Includes synergy/counter analysis and role balance

## Styling

### Tailwind Customization

- Custom gradient utilities
- Gaming-themed glow effects
- Dark color palette with neon accents
- Responsive design patterns

### CSS Classes

- `.glow-cyan`, `.glow-violet`, `.glow-emerald` - Neon glow effects
- `.gaming-border` - Gradient border styling

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Tech Stack

- React 19 with functional components and hooks
- React Router for navigation
- Tailwind CSS 4 for styling
- Axios for API calls
- Hero Icons for UI elements
- Vite for development and building

## File Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── HeroCard.jsx
│   ├── HeroGrid.jsx
│   ├── DraftBoard.jsx
│   └── SuggestionPanel.jsx
├── pages/
│   ├── Home.jsx
│   ├── DraftSimulator.jsx
│   └── HeroList.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

## Features Implemented

- ✅ Responsive design for all screen sizes
- ✅ Dark gaming theme with neon accents
- ✅ Component-based architecture
- ✅ React Router navigation
- ✅ API integration with mock data fallback
- ✅ Hero selection and team management
- ✅ AI suggestion panel with analysis
- ✅ Search and filter functionality
- ✅ Loading states and error handling
- ✅ Smooth animations and transitions
