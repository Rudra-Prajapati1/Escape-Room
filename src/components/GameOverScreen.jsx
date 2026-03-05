import React from "react";
import { useGame } from "../GameContext";

export default function GameOverScreen() {
  const { resetGame, gameState } = useGame();

  return (
    <section className="min-h-screen bg-gradient-to-b from-red-950 via-gray-950 to-gray-950 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1
          className="text-5xl font-bold text-red-400 mb-4"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Game Over
        </h1>
        <p className="text-red-300/50 text-lg mb-2">
          Prisoner {gameState.username} failed the tests.
        </p>
        <p className="text-slate-600 text-sm italic mb-10">
          The guards have been alerted. Back to the cell.
        </p>
        <button
          onClick={resetGame}
          className="px-8 py-4 bg-red-500/20 border border-red-500/30 text-red-300 rounded hover:bg-red-500/30 transition-all"
        >
          Try Again
        </button>
      </div>
    </section>
  );
}
