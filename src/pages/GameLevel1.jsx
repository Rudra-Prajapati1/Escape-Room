import React, { useState, useEffect } from "react";
import { useGame } from "../GameContext";
import TransitionScreen from "../components/TransitionScreen";
import GameHUD from "../components/GameHUD";

function generateGuaranteedHints(pwd, count) {
  // Always include at least 2 direct digit hints so puzzle is always solvable
  const direct = [
    { text: `The first digit is ${pwd[0]}`, location: "Scratched on the wall" },
    {
      text: `The last digit is ${pwd[3]}`,
      location: "Etched on the window frame",
    },
    {
      text: `The second digit is ${pwd[1]}`,
      location: "Written inside a book cover",
    },
    {
      text: `The third digit is ${pwd[2]}`,
      location: "Carved on the chair leg",
    },
  ];

  const extra = [
    {
      text: `The sum of all digits is ${pwd.split("").reduce((a, b) => a + parseInt(b), 0)}`,
      location: "Torn paper under the bed",
    },
    {
      text: `The first two digits form ${pwd.slice(0, 2)}`,
      location: "Note in the desk drawer",
    },
    {
      text: `The last two digits form ${pwd.slice(2)}`,
      location: "Hidden behind the calendar",
    },
    {
      text: `Digit 1 + Digit 2 = ${parseInt(pwd[0]) + parseInt(pwd[1])}`,
      location: "Scrawled on the ceiling tile",
    },
    {
      text: `Digit 3 + Digit 4 = ${parseInt(pwd[2]) + parseInt(pwd[3])}`,
      location: "Torn note in the mattress",
    },
    {
      text: `The password reversed is ${pwd.split("").reverse().join("")}`,
      location: "Mirror inscription",
    },
  ];

  // Always start with 2 guaranteed direct hints, fill rest from extras
  const base = direct.slice(0, Math.min(2, count));
  const remaining = [...direct.slice(2), ...extra]
    .sort(() => Math.random() - 0.5)
    .slice(0, count - base.length);

  return [...base, ...remaining].sort(() => Math.random() - 0.5);
}

export default function GameLevel1() {
  const { nextLevel, config, loseLife } = useGame();
  const [phase, setPhase] = useState("intro");
  const [password, setPassword] = useState("");
  const [inputVal, setInputVal] = useState("");
  const [hints, setHints] = useState([]);
  const [revealedHints, setRevealedHints] = useState([]);
  const [message, setMessage] = useState("");
  const [shakeInput, setShakeInput] = useState(false);
  const [showRevealConfirm, setShowRevealConfirm] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const pwd = String(Math.floor(1000 + Math.random() * 9000));
    setPassword(pwd);
    setHints(generateGuaranteedHints(pwd, config.hints));
  }, [config.hints]);

  const revealHint = (index) => {
    if (!revealedHints.includes(index)) {
      setRevealedHints((prev) => [...prev, index]);
    }
  };

  const checkPassword = () => {
    if (inputVal === password) {
      setMessage("Correct! The computer unlocks...");
      setTimeout(() => nextLevel(), 1500);
    } else {
      setAttempts((a) => a + 1);
      setMessage("Wrong password. Try again.");
      setShakeInput(true);
      loseLife();
      setTimeout(() => {
        setShakeInput(false);
        setMessage("");
      }, 1200);
      setInputVal("");
    }
  };

  const handleRevealAnswer = () => {
    setAnswerRevealed(true);
    setShowRevealConfirm(false);
    setInputVal(password);
  };

  if (phase === "intro") {
    return (
      <TransitionScreen
        title="Test 1 — The Warden's Computer"
        narrative="The first thing you notice is the warden's old computer on the desk, still glowing. It's locked with a 4-digit code. Search the cell for clues — the warden was careless, he left hints everywhere. Find them, piece together the password, and access the system."
        onContinue={() => setPhase("game")}
      />
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 pt-16 pb-8 px-4">
      <GameHUD level={1} />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-2">
            Test 1
          </p>
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "Georgia, serif" }}
          >
            The Warden's Computer
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Search the cell. Find the 4-digit password.
          </p>
        </div>

        {/* Hint grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {hints.map((hint, i) => (
            <button
              key={i}
              onClick={() => revealHint(i)}
              className={`p-4 rounded border text-left transition-all duration-300 ${
                revealedHints.includes(i)
                  ? "bg-amber-500/10 border-amber-500/30"
                  : "bg-slate-800/40 border-slate-700/30 hover:border-slate-500/50 hover:bg-slate-800/60"
              }`}
            >
              <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                {hint.location}
              </p>
              {revealedHints.includes(i) ? (
                <p className="text-amber-400 text-sm font-medium">
                  {hint.text}
                </p>
              ) : (
                <p className="text-slate-600 text-sm italic">
                  Click to search...
                </p>
              )}
            </button>
          ))}
        </div>

        {/* Password input */}
        <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-6 max-w-sm mx-auto">
          <div className="bg-slate-900 rounded p-4 mb-4 border border-slate-700/30">
            <p className="text-green-400 text-xs font-mono mb-2">
              WARDEN_OS v2.1
            </p>
            <p className="text-green-400/60 text-xs font-mono">
              Enter 4-digit access code:
            </p>
          </div>

          <div
            className={`flex gap-2 mb-4 ${shakeInput ? "animate-shake" : ""}`}
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) =>
                setInputVal(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              onKeyDown={(e) =>
                e.key === "Enter" && inputVal.length === 4 && checkPassword()
              }
              placeholder="_ _ _ _"
              className="flex-1 bg-slate-900 border border-slate-600/40 rounded px-4 py-3 text-white text-center text-xl font-mono tracking-[0.5em] outline-none focus:border-amber-500/50 transition-colors placeholder:text-slate-700"
              maxLength={4}
              readOnly={answerRevealed}
            />
            <button
              onClick={checkPassword}
              disabled={inputVal.length !== 4}
              className="px-6 py-3 bg-amber-500 text-gray-900 font-bold rounded hover:bg-amber-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ↵
            </button>
          </div>

          {message && (
            <p
              className={`text-sm text-center mb-3 ${message.includes("Correct") ? "text-green-400" : "text-red-400"}`}
            >
              {message}
            </p>
          )}

          {/* Reveal answer section — shows after 2 failed attempts */}
          {attempts >= 2 && !answerRevealed && (
            <div className="border-t border-slate-700/30 pt-4 mt-2">
              {!showRevealConfirm ? (
                <button
                  onClick={() => setShowRevealConfirm(true)}
                  className="w-full text-slate-600 text-xs hover:text-slate-400 transition-colors underline"
                >
                  Struggling? Reveal the answer
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-slate-500 text-xs mb-3">
                    This will show the password. No lives penalty, but it won't
                    count as a clean solve.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={handleRevealAnswer}
                      className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 text-xs rounded hover:bg-red-500/30 transition-all"
                    >
                      Yes, reveal it
                    </button>
                    <button
                      onClick={() => setShowRevealConfirm(false)}
                      className="px-4 py-2 bg-slate-700/30 border border-slate-600/30 text-slate-400 text-xs rounded hover:bg-slate-700/50 transition-all"
                    >
                      Keep trying
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {answerRevealed && (
            <p className="text-slate-500 text-xs text-center mt-2 italic">
              Answer revealed — press ↵ to continue
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </section>
  );
}
