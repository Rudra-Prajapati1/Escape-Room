import React, { useState } from "react";
import { useGame, formatTime } from "../GameContext";

export default function Home() {
  const { gameState, setUsername, goToLevel, getLeaderboard } = useGame();
  const [name, setName] = useState(gameState.username);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [editing, setEditing] = useState(!gameState.username);
  const leaderboard = getLeaderboard();

  const handlePlay = () => {
    if (!name.trim()) return;
    setUsername(name.trim());
    goToLevel(1);
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-12">
          <p className="text-amber-500/60 text-xs tracking-[0.4em] uppercase mb-4">
            A Story-Based Puzzle Game
          </p>
          <h1
            className="text-5xl font-bold text-white mb-2"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Escape Room
          </h1>
          <p className="text-slate-500 text-sm italic">
            Inspired by "An O Level"
          </p>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/40 rounded-lg p-6 mb-6">
          {editing ? (
            <div>
              <label className="text-slate-400 text-xs tracking-wider uppercase block mb-3">
                Enter Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && name.trim() && setEditing(false)
                }
                placeholder="Your name..."
                maxLength={20}
                className="w-full bg-slate-900/60 border border-slate-600/40 rounded px-4 py-3 text-white text-center text-lg outline-none focus:border-amber-500/50 transition-colors placeholder:text-slate-600"
                autoFocus
              />
              {name.trim() && (
                <button
                  onClick={() => setEditing(false)}
                  className="mt-3 text-amber-400 text-sm hover:text-amber-300 transition-colors"
                >
                  Confirm ✓
                </button>
              )}
            </div>
          ) : (
            <div>
              <p className="text-slate-400 text-xs tracking-wider uppercase mb-1">
                Player
              </p>
              <p className="text-white text-xl font-medium">{name}</p>
              <button
                onClick={() => setEditing(true)}
                className="mt-2 text-slate-500 text-xs hover:text-slate-300 transition-colors underline"
              >
                edit name
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handlePlay}
          disabled={!name.trim() || editing}
          className="w-full py-4 bg-amber-500 text-gray-900 font-bold text-lg rounded hover:bg-amber-400 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed mb-4"
        >
          PLAY
        </button>

        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="text-slate-500 text-sm hover:text-slate-300 transition-colors"
        >
          {showLeaderboard ? "Hide Leaderboard" : "View Leaderboard"}
        </button>

        {showLeaderboard && (
          <div className="mt-4 bg-slate-800/30 border border-slate-700/40 rounded-lg p-4">
            <h3 className="text-amber-400 text-xs tracking-[0.2em] uppercase mb-4">
              Top Escapes
            </h3>
            {leaderboard.length === 0 ? (
              <p className="text-slate-600 text-sm italic">
                No escapes yet. Be the first.
              </p>
            ) : (
              <div className="space-y-2">
                {leaderboard.map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm px-2 py-1"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-600 w-5">{i + 1}.</span>
                      <span className="text-slate-300">{entry.username}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-xs">
                        {entry.difficulty}
                      </span>
                      <span className="text-amber-400 font-mono">
                        {formatTime(entry.totalTime)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
