import React, { useState, useEffect } from "react";
import { useGame, formatTime } from "../GameContext";

const LEVEL_NAMES = {
  2: "The Warden's Computer",
  3: "The Memory Archive",
  4: "The Sequence Lock",
  5: "The Switch Grid",
  6: "The Final Exam",
};

export default function Result() {
  const { gameState, resetGame, saveToLeaderboard } = useGame();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) {
      saveToLeaderboard({
        username: gameState.username,
        difficulty: gameState.difficulty,
        totalTime: gameState.totalTime,
        date: new Date().toISOString(),
      });

      setSaved(true);
    }
  }, [
    saved,
    gameState.username,
    gameState.difficulty,
    gameState.totalTime,
    saveToLeaderboard,
  ]);

  const achievements = [];
  if (gameState.totalTime < 180)
    achievements.push({ label: "Speed Runner", icon: "⚡", color: "amber" });
  if (gameState.lives === 3)
    achievements.push({ label: "Perfect Escape", icon: "💚", color: "green" });
  if (gameState.difficulty === "Hard")
    achievements.push({ label: "Hardened Criminal", icon: "🔥", color: "red" });
  achievements.push({ label: "O Level Passed", icon: "🎓", color: "purple" });
  if (gameState.totalTime < 300 && gameState.lives >= 2)
    achievements.push({ label: "Sharp Mind", icon: "🧠", color: "blue" });

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <p className="text-green-400 text-xs tracking-[0.4em] uppercase mb-4">
          Congratulations
        </p>
        <h1
          className="text-4xl font-bold text-white mb-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          You Escaped
        </h1>
        <p className="text-slate-500 text-sm italic mb-10">
          Prisoner {gameState.username} has passed the O Level. Freedom is
          granted.
        </p>

        <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                Total Time
              </p>
              <p className="text-amber-400 text-2xl font-mono font-bold">
                {formatTime(gameState.totalTime)}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                Difficulty
              </p>
              <p className="text-white text-lg font-medium">
                {gameState.difficulty}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">
                Lives Left
              </p>
              <div className="flex justify-center gap-1 mt-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`text-xl ${i < gameState.lives ? "text-red-400" : "text-slate-700"}`}
                  >
                    ♥
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700/30 pt-4">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-3">
              Level Breakdown
            </p>
            <div className="space-y-2">
              {[2, 3, 4, 5, 6].map((level) => (
                <div
                  key={level}
                  className="flex items-center justify-between text-sm px-2"
                >
                  <span className="text-slate-400">{LEVEL_NAMES[level]}</span>
                  <span className="text-slate-300 font-mono">
                    {formatTime(gameState.levelTimes[level] || 0)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-6 mb-8">
          <p className="text-amber-400 text-xs tracking-[0.2em] uppercase mb-4">
            Achievements
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {achievements.map((a, i) => (
              <span
                key={i}
                className={`px-3 py-1 bg-${a.color}-500/10 border border-${a.color}-500/30 text-${a.color}-400 text-xs rounded-full`}
              >
                {a.icon} {a.label}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={resetGame}
          className="px-8 py-4 bg-amber-500 text-gray-900 font-bold rounded hover:bg-amber-400 transition-all"
        >
          Play Again
        </button>
      </div>
    </section>
  );
}
