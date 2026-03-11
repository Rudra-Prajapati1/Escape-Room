import React, { useState, useEffect } from "react";
import { useGame } from "../GameContext";
import TransitionScreen from "../components/TransitionScreen";
import GameHUD from "../components/GameHUD";

const EMOJIS = [
  "📕",
  "🔑",
  "🕯️",
  "🗝️",
  "💀",
  "🪙",
  "📜",
  "🔒",
  "⚙️",
  "🧩",
  "🎭",
  "🏴",
];

function getGridLayout(totalCards) {
  const layouts = {
    12: [4, 3],
    16: [4, 4],
    20: [5, 4],
  };
  return layouts[totalCards] || [4, Math.ceil(totalCards / 4)];
}

export default function GameLevel2() {
  const { nextLevel, config } = useGame();
  const [phase, setPhase] = useState("intro");
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [canFlip, setCanFlip] = useState(true);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const pairs = config.memoryPairs;
    const selected = EMOJIS.slice(0, pairs);
    const deck = [...selected, ...selected]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji }));
    setCards(deck);
  }, [config.memoryPairs]);

  const flipCard = (id) => {
    if (!canFlip || flipped.includes(id) || matched.includes(id)) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setCanFlip(false);
      setMoves((m) => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        const newMatched = [...matched, first, second];
        setMatched(newMatched);
        setFlipped([]);
        setCanFlip(true);
        if (newMatched.length === cards.length) {
          setTimeout(() => nextLevel(), 1000);
        }
      } else {
        setTimeout(() => {
          setFlipped([]);
          setCanFlip(true);
        }, 800);
      }
    }
  };

  if (phase === "intro") {
    return (
      <TransitionScreen
        title="Test 2 — The Memory Archive"
        narrative="You're in now. The system reveals a grid of encoded tiles — the warden's filing system. Each tile hides a symbol. Find all matching pairs to decrypt the prisoner manifest and locate the exit route. Focus. Remember. Match."
        onContinue={() => setPhase("game")}
      />
    );
  }

  const [cols] = getGridLayout(cards.length);
  const cardSize = cols === 5 ? 68 : 76;

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 pt-16 pb-8 px-4">
      <GameHUD level={2} />
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <p className="text-amber-400 text-xs tracking-[0.3em] uppercase mb-2">
            Test 2
          </p>
          <h2
            className="text-2xl font-bold text-white"
            style={{ fontFamily: "Georgia, serif" }}
          >
            The Memory Archive
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Match all pairs — Moves: {moves}
          </p>
        </div>

        <div
          className="grid gap-2 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${cols}, ${cardSize}px)`,
            width: "fit-content",
          }}
        >
          {cards.map((card) => {
            const isFlipped =
              flipped.includes(card.id) || matched.includes(card.id);
            const isMatched = matched.includes(card.id);
            return (
              <button
                key={card.id}
                onClick={() => flipCard(card.id)}
                style={{ width: cardSize, height: cardSize }}
                className={`rounded-lg border text-2xl flex items-center justify-center transition-all duration-300 ${
                  isMatched
                    ? "bg-green-900/30 border-green-500/40 scale-95"
                    : isFlipped
                      ? "bg-amber-500/10 border-amber-500/40"
                      : "bg-slate-800/50 border-slate-700/30 hover:border-slate-500/50 cursor-pointer"
                }`}
              >
                {isFlipped ? (
                  card.emoji
                ) : (
                  <span className="text-slate-700 text-lg">?</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <p className="text-slate-600 text-sm">
            {matched.length / 2} / {cards.length / 2} pairs found
          </p>
        </div>
      </div>
    </section>
  );
}
