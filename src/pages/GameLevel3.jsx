import React, { useState, useCallback } from "react";
import { useGame } from "../GameContext";
import TransitionScreen from "../components/TransitionScreen";
import GameHUD from "../components/GameHUD";

const COLORS = [
  "#ef4444",
  "#3b82f6",
  "#22c55e",
  "#eab308",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];
const GRID_SIZE = 9;

export default function GameLevel3() {
  const { nextLevel, config, loseLife } = useGame();
  const [phase, setPhase] = useState("intro");
  const [sequence, setSequence] = useState([]);
  const [playerSeq, setPlayerSeq] = useState([]);
  const [isShowing, setIsShowing] = useState(false);
  const [activeCell, setActiveCell] = useState(null);
  const [round, setRound] = useState(0);
  const [message, setMessage] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const WIN_ROUNDS = config.sequenceStart + 3;

  const startRound = useCallback((currentSeq) => {
    const newItem = Math.floor(Math.random() * GRID_SIZE);
    const newSeq = [...currentSeq, newItem];
    setSequence(newSeq);
    setPlayerSeq([]);
    setIsShowing(true);
    setMessage("Watch carefully...");

    newSeq.forEach((item, i) => {
      setTimeout(() => setActiveCell(item), (i + 1) * 600);
      setTimeout(() => setActiveCell(null), (i + 1) * 600 + 400);
    });

    setTimeout(
      () => {
        setIsShowing(false);
        setActiveCell(null);
        setMessage("Your turn — repeat the sequence");
      },
      (newSeq.length + 1) * 600,
    );
  }, []);

  const handleStart = () => {
    setGameStarted(true);
    setRound(1);
    startRound([]);
  };

  const handleCellClick = (index) => {
    if (isShowing) return;
    setActiveCell(index);
    setTimeout(() => setActiveCell(null), 200);

    const newPlayerSeq = [...playerSeq, index];
    setPlayerSeq(newPlayerSeq);
    const pos = newPlayerSeq.length - 1;

    if (sequence[pos] !== index) {
      setMessage("Wrong! Starting this round over...");
      loseLife();
      setTimeout(() => startRound(sequence.slice(0, -1)), 1200);
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      const newRound = round + 1;
      if (newRound > WIN_ROUNDS) {
        setMessage("Sequence complete!");
        setTimeout(() => nextLevel(), 1500);
      } else {
        setRound(newRound);
        setMessage("Correct! Next sequence...");
        setTimeout(() => startRound(sequence), 1200);
      }
    }
  };

  if (phase === "intro") {
    return (
      <TransitionScreen
        title="Test 3 — The Sequence Lock"
        narrative="The corridor leads to a heavy vault door. Nine panels glow on its surface — a sequence lock. The panels light up in a pattern. Remember the order. Repeat it back. Each round adds one more to the sequence. Get it wrong and you start the round over. The warden designed this to be unbreakable. Prove him wrong."
        onContinue={() => setPhase("game")}
      />
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 pt-16 pb-8 px-4">
      <GameHUD level={3} />
      <div className="max-w-sm mx-auto text-center">
        <div className="mb-6">
          <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-2">
            Test 3
          </p>
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "Georgia, serif" }}
          >
            The Sequence Lock
          </h2>
          {gameStarted && (
            <p className="text-slate-500 text-sm mt-2">
              Round {Math.min(round, WIN_ROUNDS)} / {WIN_ROUNDS}
            </p>
          )}
        </div>

        {!gameStarted ? (
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-amber-500 text-gray-900 font-bold rounded hover:bg-amber-400 transition-all"
          >
            Start Sequence
          </button>
        ) : (
          <>
            <p className="text-slate-400 text-sm mb-6 h-6">{message}</p>
            <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
              {[...Array(GRID_SIZE)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleCellClick(i)}
                  disabled={isShowing}
                  className={`aspect-square rounded-lg border-2 transition-all duration-200 ${
                    activeCell === i
                      ? "scale-95 border-white/50"
                      : "border-slate-700/30 hover:border-slate-500/40"
                  }`}
                  style={{
                    backgroundColor:
                      activeCell === i ? COLORS[i] : "rgba(30,41,59,0.5)",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
