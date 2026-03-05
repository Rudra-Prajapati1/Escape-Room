import React, { useState } from "react";
import Typewriter from "./Typewriter";

export default function TransitionScreen({ title, narrative, onContinue }) {
  const [showButton, setShowButton] = useState(false);

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-gray-950 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-amber-400 text-sm tracking-[0.3em] uppercase mb-6 font-medium">
          {title}
        </h2>
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-8">
          <Typewriter
            text={narrative}
            speed={30}
            onComplete={() => setShowButton(true)}
            className="text-slate-300 text-lg leading-relaxed font-light"
          />
        </div>
        {showButton && (
          <button
            onClick={onContinue}
            className="mt-8 px-8 py-3 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded hover:bg-amber-500/20 transition-all duration-300"
          >
            Continue →
          </button>
        )}
      </div>
    </section>
  );
}
