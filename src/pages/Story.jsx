import React, { useState } from "react";
import { useGame } from "../GameContext";
import TransitionScreen from "../components/TransitionScreen";

export default function Story() {
  const { gameState, setDifficulty, startGame, DIFFICULTIES } = useGame();
  const [phase, setPhase] = useState("story");
  const [selectedDiff, setSelectedDiff] = useState(gameState.difficulty);

  const storyText = `${gameState.username}, you are prisoner 7491. You've been locked in Cell Block D for longer than you can remember. Tonight is different — the warden has left for the evening, and a series of tests stand between you and freedom. Five tests. Five chances. Each one harder than the last. The other inmates say nobody has ever passed them all. But you've been studying. You've been waiting. Tonight, you escape.`;

  if (phase === "story") {
    return (
      <TransitionScreen
        title="The Night of the Exam"
        narrative={storyText}
        onContinue={() => setPhase("difficulty")}
      />
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-gray-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <p className="text-amber-400/60 text-xs tracking-[0.3em] uppercase mb-6">
          Choose Your Challenge
        </p>
        <h2
          className="text-3xl font-bold text-white mb-2"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Difficulty
        </h2>
        <p className="text-slate-500 text-sm mb-10">
          How hard do you want your escape to be?
        </p>

        <div className="space-y-3 mb-10">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDiff(d)}
              className={`w-full py-4 px-6 rounded border transition-all duration-300 text-left flex items-center justify-between ${
                selectedDiff === d
                  ? "bg-amber-500/10 border-amber-500/40 text-amber-400"
                  : "bg-slate-800/30 border-slate-700/30 text-slate-400 hover:border-slate-600"
              }`}
            >
              <span className="font-medium">{d}</span>
              <span className="text-xs text-slate-500">
                {d === "Easy" && "More hints, larger grids, more time"}
                {d === "Medium" && "Balanced challenge"}
                {d === "Hard" && "Fewer hints, smaller margin for error"}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setDifficulty(selectedDiff);
            startGame();
          }}
          className="w-full py-4 bg-amber-500 text-gray-900 font-bold text-lg rounded hover:bg-amber-400 transition-all duration-300"
        >
          BEGIN ESCAPE
        </button>
      </div>
    </section>
  );
}
