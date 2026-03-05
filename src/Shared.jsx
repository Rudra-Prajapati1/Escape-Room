export const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Special+Elite&family=Share+Tech+Mono&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#080810;color:#e8e0d0;font-family:'EB Garamond',Georgia,serif;overflow-x:hidden}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#080810}::-webkit-scrollbar-thumb{background:#b8922a;border-radius:2px}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes blink{50%{opacity:0}}
@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
@keyframes glowPulse{0%,100%{text-shadow:0 0 12px rgba(184,146,42,0.4)}50%{text-shadow:0 0 32px rgba(184,146,42,0.9),0 0 64px rgba(184,146,42,0.2)}}
@keyframes dangerFlash{0%,100%{background:rgba(127,29,29,0.3)}50%{background:rgba(220,38,38,0.55)}}
@keyframes starPop{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.25) rotate(4deg)}100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
@keyframes borderFlow{0%{border-color:rgba(184,146,42,0.15)}50%{border-color:rgba(184,146,42,0.7)}100%{border-color:rgba(184,146,42,0.15)}}
.fu{animation:fadeUp .55s ease-out forwards}
.fu1{animation:fadeUp .55s ease-out 0.05s both}.fu2{animation:fadeUp .55s ease-out 0.15s both}.fu3{animation:fadeUp .55s ease-out 0.28s both}
.fu4{animation:fadeUp .55s ease-out 0.42s both}.fu5{animation:fadeUp .55s ease-out 0.58s both}.fu6{animation:fadeUp .55s ease-out 0.75s both}
.fi{animation:fadeIn .5s ease-out forwards}.fis{animation:fadeIn .4s ease-out forwards}.sd{animation:slideDown .4s ease-out forwards}
.shake{animation:shake .4s ease-in-out}.glow{animation:glowPulse 2.5s ease-in-out infinite}
.sp1{animation:starPop .4s ease-out 0.1s both}.sp2{animation:starPop .4s ease-out 0.3s both}.sp3{animation:starPop .4s ease-out 0.55s both}
.danger{animation:dangerFlash .6s ease-in-out infinite}
.serif{font-family:'Playfair Display',Georgia,serif}.special{font-family:'Special Elite',cursive}.mono{font-family:'Share Tech Mono',monospace}
.t-gold{color:#b8922a;text-shadow:0 0 20px rgba(184,146,42,0.6)}.t-red{color:#ef4444;text-shadow:0 0 20px rgba(239,68,68,0.6)}.t-green{color:#4ade80}
.wall-bg{background-color:#0c0c18;background-image:linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px);background-size:48px 24px}
.bars-overlay{background-image:repeating-linear-gradient(90deg,transparent,transparent 36px,rgba(0,0,0,0.5) 36px,rgba(0,0,0,0.5) 40px)}
.flip-wrap{perspective:900px}.flip-inner{transform-style:preserve-3d;transition:transform 0.45s cubic-bezier(0.4,0,0.2,1);position:relative;width:100%;height:100%}
.flip-wrap.flipped .flip-inner{transform:rotateY(180deg)}.flip-front,.flip-back{backface-visibility:hidden;position:absolute;inset:0;border-radius:inherit;display:flex;align-items:center;justify-content:center}
.flip-back{transform:rotateY(180deg)}
.cursor::after{content:'▌';animation:blink 1s step-end infinite;color:#b8922a}
input{outline:none}button{cursor:pointer}button:disabled{cursor:not-allowed}
.gold-line{height:1px;background:linear-gradient(90deg,transparent,#b8922a,transparent)}
.border-pulse{animation:borderFlow 2s ease-in-out infinite}
`;

export const GlobalStyles = () => <style>{css}</style>;

export const GoldBtn = ({
  children,
  onClick,
  className = "",
  disabled = false,
  size = "md",
}) => {
  const pad =
    size === "lg"
      ? "px-10 py-4 text-base"
      : size === "sm"
        ? "px-4 py-2 text-xs"
        : "px-7 py-3 text-sm";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`mono tracking-widest uppercase border transition-all duration-200 ${pad} ${disabled ? "opacity-30" : "hover:scale-105 active:scale-95"} ${className}`}
      style={{
        borderColor: "#b8922a",
        color: "#b8922a",
        background: "rgba(184,146,42,0.07)",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = "#b8922a";
          e.currentTarget.style.color = "#080810";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.background = "rgba(184,146,42,0.07)";
          e.currentTarget.style.color = "#b8922a";
        }
      }}
    >
      {children}
    </button>
  );
};

export const TimerBar = ({ timeLeft, maxTime }) => {
  const pct = Math.max(0, (timeLeft / maxTime) * 100);
  const color = pct > 50 ? "#b8922a" : pct > 25 ? "#f59e0b" : "#ef4444";
  return (
    <div
      style={{
        height: 3,
        background: "rgba(255,255,255,0.07)",
        width: "100%",
        borderRadius: 2,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct}%`,
          background: color,
          borderRadius: 2,
          transition: "width 1s linear, background 0.5s",
        }}
      />
    </div>
  );
};

export const fmtTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
