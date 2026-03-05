import React from "react";
import { useGame } from "./GameContext";

import Home from "./pages/Home";
import Story from "./pages/Story";
import GameLevel1 from "./pages/GameLevel1";
import GameLevel2 from "./pages/GameLevel2";
import GameLevel3 from "./pages/GameLevel3";
import GameLevel4 from "./pages/GameLevel4";
import GameLevel5 from "./pages/GameLevel5";
import Result from "./pages/Result";
import GameOverScreen from "./components/GameOverScreen";

export default function AppInner() {
  const { gameState } = useGame();
  const { currentLevel, lives } = gameState;

  // Game over — no lives left and mid-game
  if (lives === 0 && currentLevel >= 2 && currentLevel <= 6) {
    return <GameOverScreen />;
  }

  switch (currentLevel) {
    case 0:
      return <Home />;
    case 1:
      return <Story />;
    case 2:
      return <GameLevel1 />;
    case 3:
      return <GameLevel2 />;
    case 4:
      return <GameLevel3 />;
    case 5:
      return <GameLevel4 />;
    case 6:
      return <GameLevel5 />;
    case 7:
      return <Result />;
    default:
      return <Home />;
  }
}
