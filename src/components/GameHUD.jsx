import React from "react";
import { useGame } from "../GameContext";

export default function GameHUD({ level }) {
  const { gameState } = useGame();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 flex items-center justify-between text-sm">
      <div className="flex items-center gap-4">
        <span className="text-slate-500">Prisoner:</span>
        <span className="text-slate-200 font-medium">{gameState.username}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-amber-400 tracking-wide">Test {level}/5</span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-400">{gameState.difficulty}</span>
        <span className="text-slate-500">|</span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={
                i < gameState.lives ? "text-red-400" : "text-slate-700"
              }
            >
              ♥
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
