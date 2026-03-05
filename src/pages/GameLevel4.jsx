import React, { useState, useEffect } from "react";
import { useGame } from "../GameContext";
import TransitionScreen from "../components/TransitionScreen";
import GameHUD from "../components/GameHUD";

function toggleGrid(g, r, c) {
  const newG = g.map((row) => [...row]);
  const size = newG.length;
  newG[r][c] = !newG[r][c];
  if (r > 0) newG[r - 1][c] = !newG[r - 1][c];
  if (r < size - 1) newG[r + 1][c] = !newG[r + 1][c];
  if (c > 0) newG[r][c - 1] = !newG[r][c - 1];
  if (c < size - 1) newG[r][c + 1] = !newG[r][c + 1];
  return newG;
}

export default function GameLevel4() {
  const { nextLevel, config } = useGame();
  const [phase, setPhase] = useState("intro");
  const [grid, setGrid] = useState([]);
  const [moves, setMoves] = useState(0);
  const SIZE = config.switchGrid;

  useEffect(() => {
    let g = Array(SIZE)
      .fill(null)
      .map(() => Array(SIZE).fill(true));
    const toggleCount = SIZE * 2 + Math.floor(Math.random() * SIZE);
    for (let t = 0; t < toggleCount; t++) {
      const r = Math.floor(Math.random() * SIZE);
      const c = Math.floor(Math.random() * SIZE);
      g = toggleGrid(g, r, c);
    }
    if (g.every((row) => row.every((cell) => cell))) {
      g = toggleGrid(g, 0, 0);
    }
    setGrid(g);
  }, [SIZE]);

  const handleClick = (r, c) => {
    const newGrid = toggleGrid(grid, r, c);
    setGrid(newGrid);
    setMoves((m) => m + 1);
    if (newGrid.every((row) => row.every((cell) => cell))) {
      setTimeout(() => nextLevel(), 1000);
    }
  };

  if (phase === "intro") {
    return (
      <TransitionScreen
        title="Test 4 — The Switch Grid"
        narrative="Almost there. A panel of switches blocks the final corridor. Each switch toggles itself and its neighbors. Turn them all ON to open the gate. But be careful — every move changes more than you expect. Think logically. The warden built this to frustrate. Don't let it."
        onContinue={() => setPhase("game")}
      />
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 pt-16 pb-8 px-4">
      <GameHUD level={4} />
      <div className="max-w-sm mx-auto text-center">
        <div className="mb-6">
          <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-2">
            Test 4
          </p>
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "Georgia, serif" }}
          >
            The Switch Grid
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Turn all switches ON — Moves: {moves}
          </p>
        </div>

        <div
          className="inline-grid gap-3"
          style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                onClick={() => handleClick(r, c)}
                className={`w-16 h-16 rounded-lg border-2 transition-all duration-200 ${
                  cell
                    ? "bg-amber-400 border-amber-300 shadow-lg shadow-amber-500/20"
                    : "bg-slate-800 border-slate-700/40 hover:border-slate-500"
                }`}
              >
                <span className="text-xs font-mono text-gray-900">
                  {cell ? "ON" : "OFF"}
                </span>
              </button>
            )),
          )}
        </div>
        <p className="text-slate-600 text-xs mt-6">
          Toggling a switch flips its neighbors too
        </p>
      </div>
    </section>
  );
}
