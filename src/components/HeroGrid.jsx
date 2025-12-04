import React from "react";
import HeroCard from "./HeroCard";

const HeroGrid = ({
  heroes = [],
  onSelectHero,
  selectedHeroes = [],
  disabledHeroes = [],
  className = "",
}) => {
  const isSelected = (hero) => selectedHeroes.some((h) => h.id === hero.id);
  const isDisabled = (hero) => disabledHeroes.some((h) => h.id === hero.id);

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 ${className}`}
    >
      {heroes.map((hero) => (
        <HeroCard
          key={hero.id}
          hero={hero}
          onSelect={onSelectHero}
          isSelected={isSelected(hero)}
          isDisabled={isDisabled(hero)}
        />
      ))}
    </div>
  );
};

export default HeroGrid;
