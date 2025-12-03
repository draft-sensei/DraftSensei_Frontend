import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import DraftSimulator from "./pages/DraftSimulator";
import HeroList from "./pages/HeroList";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/draft-simulator" element={<DraftSimulator />} />
          <Route path="/hero-list" element={<HeroList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
