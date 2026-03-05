import React from "react";
import { GameProvider } from "./GameContext";
import AppInner from "./AppInner";

export default function App() {
  return (
    <GameProvider>
      <AppInner />
    </GameProvider>
  );
}
