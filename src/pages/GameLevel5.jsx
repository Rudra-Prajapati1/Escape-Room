import React, { useState, useEffect } from "react";
import { useGame, formatTime } from "../GameContext";
import TransitionScreen from "../components/TransitionScreen";
import GameHUD from "../components/GameHUD";

const WORD_BANK = [
  "FREEDOM",
  "ESCAPE",
  "PRISON",
  "WARDEN",
  "CIPHER",
  "UNLOCK",
  "PASSAGE",
  "TUNNEL",
  "GUARD",
  "CELL",
  "KEY",
  "GATE",
  "EXILE",
  "VAULT",
  "CHAIN",
  "IRON",
  "NIGHT",
  "SHADOW",
];

export default function GameLevel5() {
  const { nextLevel, config, loseLife } = useGame();
  const [phase, setPhase] = useState("intro");
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const shuffled = [...WORD_BANK].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, config.cipherWords);
    const shift = Math.floor(Math.random() * 5) + 1;
    const encoded = selected.map((word) => ({
      original: word,
      cipher: word
        .split("")
        .map((ch) => {
          const code = ((ch.charCodeAt(0) - 65 + shift) % 26) + 65;
          return String.fromCharCode(code);
        })
        .join(""),
      shift,
    }));
    setWords(encoded);
  }, [config.cipherWords]);

  useEffect(() => {
    if (!started || gameOver || currentIndex >= words.length) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, gameOver, timeLeft, currentIndex, words.length]);

  const checkWord = () => {
    if (inputVal.toUpperCase().trim() === words[currentIndex].original) {
      setInputVal("");
      if (currentIndex + 1 >= words.length) {
        setTimeout(() => nextLevel(), 1000);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    } else {
      loseLife();
      setInputVal("");
    }
  };

  if (phase === "intro") {
    return (
      <TransitionScreen
        title="Test 5 — The Final Exam"
        narrative="The last door. A screen displays encrypted words — a Caesar cipher. Each word is shifted by the same number of letters. Decode them all before time runs out. This is the warden's ultimate test. The one nobody passes. Your O Level. Your freedom depends on it."
        onContinue={() => setPhase("game")}
      />
    );
  }

  if (gameOver) {
    return (
      <section className="min-h-screen bg-red-950 flex items-center justify-center p-6">
        <div className="text-center">
          <h2
            className="text-4xl font-bold text-red-400 mb-4"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Time's Up
          </h2>
          <p className="text-red-300/60 text-lg mb-8">
            The alarm sounds. Guards are coming.
          </p>
          <button
            onClick={() => {
              setGameOver(false);
              setTimeLeft(config.timeLimit);
              setCurrentIndex(0);
              setInputVal("");
              setStarted(true);
            }}
            className="px-8 py-3 bg-red-500/20 border border-red-500/30 text-red-300 rounded hover:bg-red-500/30 transition-all"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  const current = words[currentIndex];
  const progress = words.length > 0 ? (currentIndex / words.length) * 100 : 0;
  const timePercent = (timeLeft / config.timeLimit) * 100;

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 pt-16 pb-8 px-4">
      <GameHUD level={5} />
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6">
          <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-2">
            Test 5 — Final
          </p>
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "Georgia, serif" }}
          >
            The Final Exam
          </h2>
        </div>

        {!started ? (
          <div>
            <div className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-6 mb-6 text-left">
              <p className="text-slate-400 text-sm mb-3">
                Each word is encoded with a{" "}
                <span className="text-amber-400">Caesar cipher</span>.
              </p>
              <p className="text-slate-400 text-sm mb-3">
                Each letter is shifted forward by a fixed number.
              </p>
              <p className="text-slate-400 text-sm">
                Example: If shift is 1, then A→B, B→C, ..., Z→A
              </p>
              <p className="text-slate-400 text-sm mt-3">
                Decode all {words.length} words before time runs out.
              </p>
              <p className="text-slate-400 text-sm mt-1">
                You have{" "}
                <span className="text-amber-400 font-bold">
                  {config.timeLimit}
                </span>{" "}
                seconds.
              </p>
            </div>
            <button
              onClick={() => setStarted(true)}
              className="px-8 py-4 bg-amber-500 text-gray-900 font-bold rounded hover:bg-amber-400 transition-all"
            >
              Start Decoding
            </button>
          </div>
        ) : current ? (
          <>
            <div className="w-full bg-slate-800 rounded-full h-2 mb-6">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${timePercent > 30 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${timePercent}%` }}
              />
            </div>

            <p
              className={`text-2xl font-mono mb-2 ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-slate-300"}`}
            >
              {formatTime(timeLeft)}
            </p>

            <div className="bg-slate-800/50 border border-slate-700/40 rounded-lg p-8 mb-6">
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">
                Cipher (shift: {current.shift})
              </p>
              <p className="text-4xl font-mono text-amber-400 tracking-[0.3em] font-bold">
                {current.cipher}
              </p>
            </div>

            <div className="flex gap-2 max-w-xs mx-auto mb-4">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value.toUpperCase())}
                onKeyDown={(e) =>
                  e.key === "Enter" && inputVal.trim() && checkWord()
                }
                placeholder="Decoded word..."
                className="flex-1 bg-slate-900 border border-slate-600/40 rounded px-4 py-3 text-white text-center font-mono tracking-wider outline-none focus:border-amber-500/50 transition-colors uppercase placeholder:text-slate-700"
                autoFocus
              />
              <button
                onClick={checkWord}
                disabled={!inputVal.trim()}
                className="px-6 py-3 bg-amber-500 text-gray-900 font-bold rounded hover:bg-amber-400 transition-all disabled:opacity-30"
              >
                ↵
              </button>
            </div>

            <p className="text-slate-600 text-sm">
              {currentIndex + 1} / {words.length}
            </p>
            <div className="w-full bg-slate-800 rounded-full h-1 mt-4">
              <div
                className="h-1 rounded-full bg-green-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : null}
      </div>
    </section>
  );
}
