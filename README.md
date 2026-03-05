import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

// ============================================================
// FONTS + STYLES
// ============================================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Special+Elite&family=Share+Tech+Mono&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0f; color: #f5f0e8; font-family: 'Crimson Text', serif; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #0a0a0f; }
    ::-webkit-scrollbar-thumb { background: #c9a227; border-radius: 3px; }
    @keyframes floatUp { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes blink { 50%{opacity:0} }
    @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
    @keyframes pulseGlow { 0%,100%{box-shadow:0 0 8px rgba(201,162,39,.4)} 50%{box-shadow:0 0 28px rgba(201,162,39,.9),0 0 50px rgba(201,162,39,.3)} }
    @keyframes fadeInScale { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
    @keyframes highlightBurst { 0%{transform:scale(1);filter:brightness(1)} 40%{transform:scale(1.12);filter:brightness(2.8)} 100%{transform:scale(1);filter:brightness(1)} }
    @keyframes dangerPulse { 0%,100%{background:rgba(139,26,26,.35)} 50%{background:rgba(220,38,38,.65)} }
    @keyframes starPop { 0%{transform:scale(0) rotate(-30deg);opacity:0} 60%{transform:scale(1.3) rotate(5deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
    @keyframes slideDown { from{transform:translateY(-18px);opacity:0} to{transform:translateY(0);opacity:1} }
    @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    @keyframes scanline { 0%{top:0} 100%{top:100%} }
    @keyframes doorReveal { from{clip-path:inset(0 100% 0 0)} to{clip-path:inset(0 0% 0 0)} }
    @keyframes countDown { 0%{transform:scale(1.3);color:#f87171} 100%{transform:scale(1)} }
    .fu{animation:floatUp .6s ease-out forwards}
    .fu1{animation:floatUp .6s ease-out .1s both}
    .fu2{animation:floatUp .6s ease-out .2s both}
    .fu3{animation:floatUp .6s ease-out .3s both}
    .fu4{animation:floatUp .6s ease-out .4s both}
    .fu5{animation:floatUp .6s ease-out .5s both}
    .fu6{animation:floatUp .6s ease-out .65s both}
    .fis{animation:fadeInScale .4s ease-out forwards}
    .shake{animation:shake .45s ease-in-out}
    .pg{animation:pulseGlow 2s ease-in-out infinite}
    .hb{animation:highlightBurst .55s ease-in-out}
    .dp{animation:dangerPulse .5s ease-in-out infinite}
    .sp1{animation:starPop .4s ease-out .2s both}
    .sp2{animation:starPop .4s ease-out .45s both}
    .sp3{animation:starPop .4s ease-out .7s both}
    .sd{animation:slideDown .4s ease-out forwards}
    .cd{animation:countDown .3s ease-out}
    .tgold{text-shadow:0 0 20px rgba(201,162,39,.8),0 0 40px rgba(201,162,39,.3)}
    .tred{text-shadow:0 0 20px rgba(220,38,38,.8)}
    .flip-wrap{perspective:1000px}
    .flip-inner{transform-style:preserve-3d;transition:transform .5s cubic-bezier(.4,0,.2,1)}
    .flip-wrap.flipped .flip-inner{transform:rotateY(180deg)}
    .flip-front,.flip-back{backface-visibility:hidden;position:absolute;inset:0;border-radius:inherit}
    .flip-back{transform:rotateY(180deg)}
    .bars{background:repeating-linear-gradient(90deg,transparent,transparent 38px,rgba(0,0,0,.45) 38px,rgba(0,0,0,.45) 42px)}
    .wall{background-color:#1a1a2e;background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:60px 30px,60px 30px}
    .paper{background:#f5f0e8}
    .mono{font-family:'Share Tech Mono',monospace}
    .serif{font-family:'Playfair Display',serif}
    .special{font-family:'Special Elite',cursive}
    .cursor::after{content:'|';animation:blink 1s step-end infinite;color:#c9a227}
    input:focus{outline:none}
    button:active{transform:scale(.97)}
  `}</style>
);

// ============================================================
// GAME CONTEXT
// ============================================================
const GameContext = createContext();
const INIT = { username:'', difficulty:'Easy', level:0, scores:{}, total:0, startTime:null, hintsUsed:0 };

const GameProvider = ({children}) => {
  const [g, setG] = useState(INIT);

  const getLB = () => { try { return JSON.parse(localStorage.getItem('evans_lb_v3'))||[]; } catch { return []; } };
  const saveLB = (entry) => {
    const b = getLB(); b.push(entry); b.sort((a,z)=>z.score-a.score);
    const t=b.slice(0,10); localStorage.setItem('evans_lb_v3',JSON.stringify(t)); return t;
  };

  const api = {
    g, getLB, saveLB,
    setName: n => setG(p=>({...p,username:n})),
    setDiff: d => setG(p=>({...p,difficulty:d})),
    goto: lv => setG(p=>({...p,level:lv})),
    next: () => setG(p=>({...p,level:p.level+1})),
    back: () => setG(p=>({...p,level:Math.max(0,p.level-1)})),
    hint: () => setG(p=>({...p,hintsUsed:p.hintsUsed+1})),
    start: () => setG(p=>({...p,startTime:Date.now()})),
    reset: () => setG(INIT),
    score: (lv,data) => setG(prev => {
      const s={...prev.scores,[lv]:data};
      return {...prev,scores:s,total:Object.values(s).reduce((a,v)=>a+(v.score||0),0)};
    }),
  };
  return <GameContext.Provider value={api}>{children}</GameContext.Provider>;
};
const useGame = () => useContext(GameContext);

// ============================================================
// SHARED COMPONENTS
// ============================================================
const GoldBtn = ({children, onClick, className='', disabled=false}) => (
  <button
    onClick={onClick} disabled={disabled}
    className={`px-8 py-3 font-bold tracking-widest uppercase text-sm border transition-all duration-300 ${disabled?'opacity-40 cursor-not-allowed':'hover:scale-105 active:scale-95'} ${className}`}
    style={{fontFamily:"'Share Tech Mono',monospace",borderColor:'#c9a227',color:'#c9a227',background:'rgba(201,162,39,0.08)'}}
    onMouseEnter={e=>{if(!disabled){e.currentTarget.style.background='#c9a227';e.currentTarget.style.color='#0a0a0f'}}}
    onMouseLeave={e=>{if(!disabled){e.currentTarget.style.background='rgba(201,162,39,0.08)';e.currentTarget.style.color='#c9a227'}}}
  >{children}</button>
);

const HUD = ({level, totalLevels=5}) => {
  const {g} = useGame();
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 py-2" style={{background:'rgba(10,10,15,0.92)',borderBottom:'1px solid rgba(201,162,39,0.2)'}}>
      <div className="flex items-center gap-3">
        <span className="text-xs mono" style={{color:'#c9a227'}}>EVANS</span>
        <span className="text-xs opacity-40 mono">|</span>
        <span className="text-xs opacity-60 mono">{g.username||'PRISONER'}</span>
      </div>
      <div className="flex gap-1">
        {Array.from({length:totalLevels}).map((_,i)=>(
          <div key={i} className="w-8 h-1 rounded-full transition-all duration-500" style={{background:i<level?'#c9a227':i===level-1?'rgba(201,162,39,0.5)':'rgba(255,255,255,0.1)'}}/>
        ))}
      </div>
      <div className="text-xs mono" style={{color:'#c9a227'}}>SCORE: {g.total}</div>
    </div>
  );
};

const LockIcon = ({size=24,color='#c9a227'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

// ============================================================
// SCREEN 0: HOME
// ============================================================
const Home = () => {
  const {g, setName, goto, getLB} = useGame();
  const [name, setName2] = useState(g.username||'');
  const [editing, setEditing] = useState(!g.username);
  const [showLB, setShowLB] = useState(false);
  const lb = getLB();

  const handlePlay = () => {
    if(!name.trim()) return;
    setName(name.trim());
    goto(1);
  };

  return (
    <div className="min-h-screen fis relative overflow-hidden" style={{background:'linear-gradient(135deg,#0a0a0f 0%,#0d1117 40%,#0a0a0f 100%)'}}>
      <GlobalStyles/>
      {/* Prison bar overlay */}
      <div className="absolute inset-0 bars opacity-30 pointer-events-none"/>

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none" style={{background:'radial-gradient(circle,rgba(201,162,39,0.06) 0%,transparent 70%)'}}/>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative z-10">

        {/* Logo/Title */}
        <div className="text-center mb-12">
          <p className="fu1 text-xs tracking-[0.5em] uppercase mb-4 opacity-50 mono">Oxford H.M. Prison · June 8</p>
          <div className="fu2 relative inline-block">
            <h1 className="text-6xl md:text-8xl font-black tgold" style={{fontFamily:"'Playfair Display',serif",lineHeight:1}}>
              EVANS
            </h1>
            <div className="absolute -bottom-1 left-0 right-0 h-px" style={{background:'linear-gradient(90deg,transparent,#c9a227,transparent)'}}/>
          </div>
          <h2 className="fu3 text-xl md:text-2xl mt-3 tracking-widest uppercase opacity-70 special">Tries An O-Level</h2>
          <p className="fu4 mt-4 text-base opacity-50 italic max-w-sm mx-auto" style={{fontFamily:"'Crimson Text',serif"}}>
            A story-driven escape room inspired by Colin Dexter
          </p>
        </div>

        {/* Name Input */}
        <div className="fu5 w-full max-w-sm mb-8">
          <label className="block text-xs tracking-widest uppercase mb-2 opacity-50 mono">Your Identity</label>
          {editing ? (
            <div className="flex gap-2">
              <input
                className="flex-1 px-4 py-3 text-base border bg-transparent transition-all"
                style={{borderColor:'rgba(201,162,39,0.4)',color:'#f5f0e8',fontFamily:"'Crimson Text',serif",outline:'none'}}
                onFocus={e=>e.target.style.borderColor='#c9a227'}
                onBlur={e=>e.target.style.borderColor='rgba(201,162,39,0.4)'}
                placeholder="Enter your name..."
                value={name}
                onChange={e=>setName2(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&name.trim()&&setEditing(false)}
                autoFocus
              />
              <button className="px-4 py-3 text-sm mono transition-all hover:opacity-80"
                style={{background:'#c9a227',color:'#0a0a0f',fontWeight:'bold'}}
                onClick={()=>name.trim()&&setEditing(false)}>OK</button>
            </div>
          ) : (
            <div className="flex items-center justify-between px-4 py-3 border" style={{borderColor:'rgba(201,162,39,0.4)'}}>
              <span className="text-lg" style={{fontFamily:"'Crimson Text',serif"}}>{name}</span>
              <button onClick={()=>setEditing(true)} className="text-xs mono opacity-50 hover:opacity-100 transition-opacity" style={{color:'#c9a227'}}>EDIT</button>
            </div>
          )}
        </div>

        {/* Play Button */}
        <div className="fu6 flex flex-col items-center gap-4">
          <GoldBtn onClick={handlePlay} disabled={!name.trim()} className="text-lg px-12 py-4">
            ▶ PLAY
          </GoldBtn>
          <button onClick={()=>setShowLB(v=>!v)} className="text-xs mono opacity-40 hover:opacity-70 transition-opacity" style={{color:'#c9a227'}}>
            {showLB?'HIDE':'SHOW'} LEADERBOARD
          </button>
        </div>

        {/* Leaderboard */}
        {showLB && (
          <div className="sd mt-8 w-full max-w-sm">
            <div className="border p-4" style={{borderColor:'rgba(201,162,39,0.25)',background:'rgba(201,162,39,0.04)'}}>
              <h3 className="text-xs tracking-widest uppercase mb-4 mono text-center" style={{color:'#c9a227'}}>— Hall of Escapees —</h3>
              {lb.length===0 ? (
                <p className="text-center opacity-40 text-sm italic">No one has escaped yet...</p>
              ) : lb.map((e,i)=>(
                <div key={i} className="flex justify-between items-center py-2 border-b" style={{borderColor:'rgba(255,255,255,0.05)'}}>
                  <div className="flex items-center gap-3">
                    <span className="text-xs mono opacity-40" style={{minWidth:'1.5rem'}}>#{i+1}</span>
                    <span className="text-sm" style={{fontFamily:"'Crimson Text',serif"}}>{e.name}</span>
                    <span className="text-xs opacity-40 mono">{e.difficulty}</span>
                  </div>
                  <span className="text-sm mono" style={{color:'#c9a227'}}>{e.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom lore */}
        <p className="absolute bottom-4 left-0 right-0 text-center text-xs opacity-20 mono">"I may surprise everybody." — Evans</p>
      </div>
    </div>
  );
};

// ============================================================
// SCREEN 1: STORY INTRO + DIFFICULTY
// ============================================================
const storyLines = [
  { text: "Oxford H.M. Prison. June 8th.", delay: 0 },
  { text: "You are James Roderick Evans.", delay: 800 },
  { text: "Three escapes. Not bad for a congenital kleptomaniac.", delay: 1600 },
  { text: "Today, under the guise of a German O-level examination...", delay: 2600 },
  { text: "...you will attempt your fourth.", delay: 3400 },
  { text: "The Governor thinks he's clever. You know better.", delay: 4400 },
  { text: "Choose your approach carefully, Evans.", delay: 5200 },
];

const StoryIntro = () => {
  const {g, setDiff, goto, start} = useGame();
  const [shown, setShown] = useState(0);
  const [ready, setReady] = useState(false);
  const [chosen, setChosen] = useState(g.difficulty);

  useEffect(()=>{
    storyLines.forEach((_,i) => setTimeout(()=>setShown(i+1), storyLines[i].delay));
    setTimeout(()=>setReady(true), 6000);
  },[]);

  const handleBegin = (diff) => {
    setDiff(diff); setChosen(diff); start(); goto(2);
  };

  const diffConfig = {
    Easy:   { label:'Easy',   sub:'Warden on a coffee break', color:'#4ade80', clue:'More hints, longer time' },
    Medium: { label:'Medium', sub:'Jackson is watching',      color:'#facc15', clue:'Fewer hints, tighter time' },
    Hard:   { label:'Hard',   sub:'Governor himself is alert',color:'#f87171', clue:'No hints, maximum pressure' },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden fis" style={{background:'#0a0a0f'}}>
      <GlobalStyles/>
      <div className="absolute inset-0 wall opacity-60 pointer-events-none"/>
      <div className="absolute inset-0 bars opacity-20 pointer-events-none"/>

      {/* Story text */}
      <div className="relative z-10 w-full max-w-xl px-6 mb-12">
        <div className="border-l-2 pl-6 space-y-4" style={{borderColor:'rgba(201,162,39,0.3)'}}>
          {storyLines.map((line, i) => (
            i < shown && (
              <p key={i} className="fu text-lg leading-relaxed"
                style={{fontFamily:"'Crimson Text',serif",color: i===0?'rgba(201,162,39,0.7)':i===1?'#c9a227':'#f5f0e8',fontStyle:i===4?'italic':'normal'}}>
                {line.text}
              </p>
            )
          ))}
          {shown < storyLines.length && <span className="cursor"/>}
        </div>
      </div>

      {/* Difficulty selection */}
      {ready && (
        <div className="sd relative z-10 w-full max-w-xl px-6">
          <h3 className="text-xs tracking-[0.4em] uppercase mb-6 text-center opacity-50 mono">Select Difficulty</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(diffConfig).map(([key,conf])=>(
              <button key={key} onClick={()=>handleBegin(key)}
                className="p-4 border text-left transition-all duration-300 hover:scale-105 active:scale-95 group"
                style={{borderColor:`${conf.color}40`,background:`${conf.color}08`}}
                onMouseEnter={e=>{e.currentTarget.style.background=`${conf.color}18`;e.currentTarget.style.borderColor=conf.color}}
                onMouseLeave={e=>{e.currentTarget.style.background=`${conf.color}08`;e.currentTarget.style.borderColor=`${conf.color}40`}}
              >
                <div className="font-bold text-base mb-1 mono" style={{color:conf.color}}>{conf.label}</div>
                <div className="text-xs opacity-60 italic mb-2" style={{fontFamily:"'Crimson Text',serif"}}>{conf.sub}</div>
                <div className="text-xs opacity-40 mono">{conf.clue}</div>
              </button>
            ))}
          </div>
          <button onClick={()=>goto(0)} className="mt-6 w-full text-center text-xs mono opacity-30 hover:opacity-60 transition-opacity py-2" style={{color:'#f5f0e8'}}>← Back to Home</button>
        </div>
      )}
    </div>
  );
};

// ============================================================
// SCREEN 2: LEVEL TRANSITION
// ============================================================
const levelMeta = {
  1: { title:"The Locked Cell",     sub:"Find the password hidden in the clues",   icon:"🔒", lines:["Jackson has cleared the cell. Or so he thinks.","The password to the Governor's terminal is hidden somewhere in this room.","Look carefully at the notes. Read between the lines.","You have one chance, Evans. Don't waste it."], accent:'#c9a227' },
  2: { title:"The Memory Wall",     sub:"Remember the pattern. Flip the tiles.",    icon:"🃏", lines:["The guards rotate every twelve cards.","The exam room is full of familiar faces — but which ones match?","McLeery watches. Your mind must be sharper.","Remember. Flip. Escape."], accent:'#60a5fa' },
  3: { title:"Governor's Signal",   sub:"Mimic the sequence to fool the system",    icon:"🔔", lines:["The prison's alarm system uses a rotating signal code.","To disable it, you must repeat the exact sequence.","One wrong button and the alarm sounds.","Watch carefully. Then follow precisely."], accent:'#a78bfa' },
  4: { title:"The Switch Room",     sub:"Align every switch to open the gate",      icon:"⚡", lines:["The gate to the outer yard is controlled by a logic board.","Every switch affects others. There is a hidden pattern.","The warden will be back in minutes.","Figure out the pattern. Flip the right switches. Go."], accent:'#34d399' },
  5: { title:"The Final Decoding",  sub:"Decode the escape route before time runs out", icon:"📜", lines:["You're almost out. But the route is encrypted.","The German question paper holds the key — quite literally.","Decode it before the Governor realises what's happening.","This is your last chance. Don't let him catch you, Evans."], accent:'#f87171' },
};

const LevelTransition = ({lv, next}) => {
  const {goto} = useGame();
  const m = levelMeta[lv];
  const [shown, setShown] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(()=>{
    let t = 600;
    m.lines.forEach((_,i) => { setTimeout(()=>setShown(i+1), t); t+=800; });
    setTimeout(()=>setReady(true), t+300);
  },[]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden fis" style={{background:`linear-gradient(135deg,#0a0a0f,#0d1117)`}}>
      <GlobalStyles/>
      <HUD level={lv}/>
      <div className="absolute inset-0 bars opacity-25 pointer-events-none"/>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none" style={{background:`radial-gradient(circle,${m.accent}08 0%,transparent 70%)`}}/>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg w-full pt-16">
        <p className="fu1 text-xs tracking-[0.5em] uppercase mb-6 opacity-40 mono" style={{color:m.accent}}>Chapter {lv} / 5</p>
        <div className="fu2 text-7xl mb-6" style={{filter:`drop-shadow(0 0 20px ${m.accent})`}}>{m.icon}</div>
        <h1 className="fu3 text-4xl font-black mb-2" style={{fontFamily:"'Playfair Display',serif",color:m.accent,textShadow:`0 0 30px ${m.accent}50`}}>{m.title}</h1>
        <p className="fu4 text-sm tracking-widest uppercase opacity-40 mb-10 mono">{m.sub}</p>

        <div className="min-h-40 w-full space-y-3 mb-10">
          {m.lines.slice(0,shown).map((line,i)=>(
            <p key={i} className="fu text-base leading-relaxed opacity-80" style={{fontFamily:"'Crimson Text',serif"}}>{line}</p>
          ))}
        </div>

        {ready && (
          <GoldBtn onClick={()=>goto(next)} className="px-12 py-4 text-base" style={{borderColor:m.accent,color:m.accent}}>
            Begin Level {lv} →
          </GoldBtn>
        )}
      </div>
      <div className="absolute bottom-4 left-4 text-xs opacity-15 mono">OXFORD PRISON // JUNE 8</div>
      <div className="absolute bottom-4 right-4 text-xs opacity-15 mono">OPERATION: BREAK</div>
    </div>
  );
};

// ============================================================
// LEVEL 1: PASSWORD HUNT
// ============================================================
const WORD_POOL = [
  {word:'GOBLIN',hints:{Easy:["The creature that guards treasure begins with G","It rhymes with 'roblin'","A mischievous fantasy creature, 6 letters"],Medium:["A classic literary villain, __ king","Tolkien wrote about these creatures"],Hard:["'The __ King rode at midnight'"]},},
  {word:'OXFORD',hints:{Easy:["This city has a famous university","The city where this prison is located","6 letters, a famous English city"],Medium:["Dreaming spires. Home of scholars."],Hard:["The city in the question paper's header"]},},
  {word:'ESCAPE',hints:{Easy:["What Evans is famous for","To flee from captivity","6 letters: E_C_P_"],Medium:["Evans has done this three times already"],Hard:["The title of his permanent ambition"]},},
  {word:'GERMAN',hints:{Easy:["The O-level subject Evans is taking","A European language","6 letters, spoken in Berlin"],Medium:["'Guten Glück' is in this language"],Hard:["The language of the correction slip"]},},
  {word:'PARSON',hints:{Easy:["A man of the cloth","A church minister, 6 letters","McLeery's profession"],Medium:["The man who came to invigilate"],Hard:["He wore a collar and carried a suitcase"]},},
  {word:'HAMMER',hints:{Easy:["A tool used to hit nails","6 letters: H_M_E_","Found in every toolbox"],Medium:["Thor's weapon of choice"],Hard:["The sound it makes: 'knock knock knock'"]},},
  {word:'CANDLE',hints:{Easy:["Provides light in darkness","You blow it out on a birthday cake","6 letters, starts with C"],Medium:["Burns at both ends... or just one"],Hard:["Jackson lit one when the power failed"]},},
  {word:'MIRROR',hints:{Easy:["Reflects your face","Snow White's stepmother had a magic one","6 letters: M_R_O_"],Medium:["Evans used one to check his disguise"],Hard:["What gives a reversed image"]},},
];

const generateLevel1Data = (difficulty) => {
  const pw = WORD_POOL[Math.floor(Math.random()*WORD_POOL.length)];
  const numHints = difficulty==='Easy'?3:difficulty==='Medium'?2:1;
  const hints = pw.hints[difficulty].slice(0,numHints);
  const shuffled = [...pw.word].sort(()=>Math.random()-.5);
  return { word:pw.word, hints, shuffled, maxAttempts:difficulty==='Easy'?5:difficulty==='Medium'?3:2 };
};

const Level1 = () => {
  const {g, goto, score, hint} = useGame();
  const [data] = useState(()=>generateLevel1Data(g.difficulty));
  const [input, setInput] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState(1);
  const [status, setStatus] = useState('playing'); // playing | success | fail
  const [shake, setShake] = useState(false);
  const [timeLeft, setTimeLeft] = useState(g.difficulty==='Easy'?240:g.difficulty==='Medium'?180:120);
  const [startTime] = useState(Date.now());

  useEffect(()=>{
    if(status!=='playing') return;
    const t = setInterval(()=>setTimeLeft(p=>{
      if(p<=1){ setStatus('fail'); return 0; }
      return p-1;
    }),1000);
    return ()=>clearInterval(t);
  },[status]);

  const handleSubmit = () => {
    if(!input.trim()) return;
    if(input.trim().toUpperCase()===data.word){
      const time = Math.round((Date.now()-startTime)/1000);
      const pts = Math.max(100, 500 - attempts*50 - (hintsRevealed-1)*30 - Math.floor(time/10)*5);
      score(1,{score:pts,attempts:attempts+1,hintsUsed:hintsRevealed-1,time});
      setStatus('success');
    } else {
      const newA = attempts+1;
      setAttempts(newA);
      setShake(true);
      setTimeout(()=>setShake(false),500);
      setInput('');
      if(newA>=data.maxAttempts) setStatus('fail');
    }
  };

  const revealHint = () => {
    if(hintsRevealed<data.hints.length){ setHintsRevealed(h=>h+1); hint(); }
  };

  const mins = Math.floor(timeLeft/60), secs = timeLeft%60;
  const danger = timeLeft<30;

  if(status==='success') return (
    <div className="min-h-screen flex flex-col items-center justify-center fis" style={{background:'#0a0a0f'}}>
      <GlobalStyles/><HUD level={1}/>
      <div className="text-center pt-16">
        <div className="text-6xl mb-4 sp1">🔓</div>
        <h2 className="text-3xl font-black mb-2 sp2 tgold serif">ACCESS GRANTED</h2>
        <p className="sp3 opacity-60 mb-8">The password was <strong style={{color:'#c9a227'}}>{data.word}</strong></p>
        <GoldBtn onClick={()=>goto(4)}>Continue →</GoldBtn>
      </div>
    </div>
  );

  if(status==='fail') return (
    <div className="min-h-screen flex flex-col items-center justify-center fis" style={{background:'#0a0a0f'}}>
      <GlobalStyles/><HUD level={1}/>
      <div className="text-center pt-16">
        <div className="text-6xl mb-4">🚨</div>
        <h2 className="text-3xl font-black mb-2 tred serif">BUSTED</h2>
        <p className="opacity-60 mb-2">The password was <strong style={{color:'#c9a227'}}>{data.word}</strong></p>
        <p className="opacity-40 text-sm mb-8">Jackson has called the Governor...</p>
        <GoldBtn onClick={()=>goto(3)}>Try Again</GoldBtn>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen fis wall relative" style={{background:'#0d0d1a'}}>
      <GlobalStyles/><HUD level={1}/>
      <div className="absolute inset-0 bars opacity-20 pointer-events-none"/>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-24 pb-12">
        {/* Timer */}
        <div className={`flex justify-between items-center mb-6 ${danger?'dp rounded px-3 py-1':''}`}>
          <span className="text-xs uppercase tracking-widest opacity-50 mono">Level 1 — Password Hunt</span>
          <span className={`text-xl mono font-bold ${danger?'tred':''}`} style={{color:danger?'#f87171':'#c9a227'}}>
            {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
          </span>
        </div>

        {/* Cell scene header */}
        <div className="mb-6 p-4 border" style={{borderColor:'rgba(201,162,39,0.2)',background:'rgba(201,162,39,0.04)'}}>
          <p className="text-sm italic opacity-70 leading-relaxed" style={{fontFamily:"'Crimson Text',serif"}}>
            You scan the cell walls. Jackson has been thorough — but not thorough enough. Somewhere in these objects, the Governor's terminal password is concealed. Find it.
          </p>
        </div>

        {/* Scrambled letters */}
        <div className="mb-6">
          <p className="text-xs tracking-widest uppercase opacity-40 mb-3 mono">Scrambled Letters</p>
          <div className="flex gap-2 flex-wrap">
            {data.shuffled.map((ch,i)=>(
              <div key={i} className="w-10 h-10 flex items-center justify-center border font-bold text-lg special transition-all"
                style={{borderColor:'rgba(201,162,39,0.4)',background:'rgba(201,162,39,0.06)',color:'#c9a227'}}>
                {ch}
              </div>
            ))}
          </div>
        </div>

        {/* Hints */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs tracking-widest uppercase opacity-40 mono">Clues on the Wall</p>
            {hintsRevealed<data.hints.length && (
              <button onClick={revealHint} className="text-xs mono hover:opacity-80 transition-opacity" style={{color:'#c9a227'}}>
                + Reveal Hint ({data.hints.length-hintsRevealed} left)
              </button>
            )}
          </div>
          <div className="space-y-2">
            {data.hints.slice(0,hintsRevealed).map((h,i)=>(
              <div key={i} className="sd flex gap-3 items-start p-3 border" style={{borderColor:'rgba(255,255,255,0.07)',background:'rgba(255,255,255,0.02)'}}>
                <span className="text-xs mono opacity-40 mt-0.5">#{i+1}</span>
                <p className="text-sm italic leading-relaxed" style={{fontFamily:"'Crimson Text',serif"}}>{h}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Attempts */}
        <div className="flex gap-1 mb-6">
          {Array.from({length:data.maxAttempts}).map((_,i)=>(
            <div key={i} className="w-3 h-3 rounded-full" style={{background:i<attempts?'#f87171':i<data.maxAttempts?'rgba(201,162,39,0.3)':'rgba(255,255,255,0.1)'}}/>
          ))}
          <span className="text-xs opacity-40 ml-2 mono">{data.maxAttempts-attempts} attempts left</span>
        </div>

        {/* Input */}
        <div className={`flex gap-2 ${shake?'shake':''}`}>
          <input
            className="flex-1 px-4 py-3 text-base border bg-transparent uppercase tracking-widest"
            style={{borderColor:'rgba(201,162,39,0.4)',color:'#f5f0e8',fontFamily:"'Share Tech Mono',monospace",letterSpacing:'0.3em'}}
            onFocus={e=>e.target.style.borderColor='#c9a227'}
            onBlur={e=>e.target.style.borderColor='rgba(201,162,39,0.4)'}
            placeholder="TYPE PASSWORD"
            value={input}
            onChange={e=>setInput(e.target.value.toUpperCase())}
            onKeyDown={e=>e.key==='Enter'&&handleSubmit()}
            maxLength={10}
          />
          <GoldBtn onClick={handleSubmit}>ENTER</GoldBtn>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// LEVEL 2: MEMORY FLIP
// ============================================================
const CARD_SETS = {
  Easy:   ['🔒','⚖️','📜','🕯️','🗝️','🔍','📖','🎩'],
  Medium: ['🔒','⚖️','📜','🕯️','🗝️','🔍','📖','🎩','🖊️','🧤'],
  Hard:   ['🔒','⚖️','📜','🕯️','🗝️','🔍','📖','🎩','🖊️','🧤','👀','🏛️'],
};

const makeCards = (diff) => {
  const pool = CARD_SETS[diff];
  const pairs = [...pool,...pool].sort(()=>Math.random()-.5);
  return pairs.map((sym,i)=>({id:i,sym,flipped:false,matched:false}));
};

const Level2 = () => {
  const {g, goto, score} = useGame();
  const [cards, setCards] = useState(()=>makeCards(g.difficulty));
  const [selected, setSelected] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [timeLeft, setTimeLeft] = useState(g.difficulty==='Easy'?120:g.difficulty==='Medium'?90:60);
  const [startTime] = useState(Date.now());
  const [locked, setLocked] = useState(false);
  const [status, setStatus] = useState('preview'); // preview | playing | success | fail
  const total = cards.length/2;

  // Brief preview
  useEffect(()=>{
    setCards(p=>p.map(c=>({...c,flipped:true})));
    const t=setTimeout(()=>{
      setCards(p=>p.map(c=>({...c,flipped:false})));
      setStatus('playing');
    }, g.difficulty==='Easy'?3000:g.difficulty==='Medium'?2000:1200);
    return ()=>clearTimeout(t);
  },[]);

  useEffect(()=>{
    if(status!=='playing') return;
    const t=setInterval(()=>setTimeLeft(p=>{
      if(p<=1){setStatus('fail');return 0;}
      return p-1;
    }),1000);
    return ()=>clearInterval(t);
  },[status]);

  const flipCard = (id) => {
    if(locked||status!=='playing') return;
    const card = cards.find(c=>c.id===id);
    if(card.flipped||card.matched) return;
    if(selected.length===1&&selected[0]===id) return;

    const newSel = [...selected,id];
    setCards(p=>p.map(c=>c.id===id?{...c,flipped:true}:c));

    if(newSel.length===2){
      setMoves(m=>m+1);
      setLocked(true);
      const [a,b] = newSel.map(sid=>cards.find(c=>c.id===sid));
      if(a.sym===b.sym){
        setCards(p=>p.map(c=>newSel.includes(c.id)?{...c,matched:true}:c));
        const newMatch = matched+1;
        setMatched(newMatch);
        if(newMatch===total){
          const time=Math.round((Date.now()-startTime)/1000);
          const pts=Math.max(100,500-moves*5-Math.floor(time/5)*3);
          score(2,{score:pts,moves,time});
          setStatus('success');
        }
        setSelected([]);
        setLocked(false);
      } else {
        setTimeout(()=>{
          setCards(p=>p.map(c=>newSel.includes(c.id)&&!c.matched?{...c,flipped:false}:c));
          setSelected([]);
          setLocked(false);
        },900);
      }
      setSelected([]);
    } else {
      setSelected(newSel);
    }
  };

  const mins=Math.floor(timeLeft/60),secs=timeLeft%60;
  const cols = g.difficulty==='Hard'?6:g.difficulty==='Medium'?5:4;

  if(status==='success') return (
    <div className="min-h-screen flex flex-col items-center justify-center fis" style={{background:'#0a0a0f'}}>
      <GlobalStyles/><HUD level={2}/>
      <div className="text-center pt-16">
        <div className="sp1 text-6xl mb-4">✨</div>
        <h2 className="sp2 text-3xl font-black mb-2 tgold serif">PERFECT MEMORY</h2>
        <p className="sp3 opacity-60 mb-2">{moves} moves · {Math.round((Date.now()-startTime)/1000)}s</p>
        <p className="opacity-40 text-sm mb-8 italic" style={{fontFamily:"'Crimson Text',serif"}}>"Evans never forgets a face." — Jackson</p>
        <GoldBtn onClick={()=>goto(6)}>Continue →</GoldBtn>
      </div>
    </div>
  );

  if(status==='fail') return (
    <div className="min-h-screen flex flex-col items-center justify-center fis" style={{background:'#0a0a0f'}}>
      <GlobalStyles/><HUD level={2}/>
      <div className="text-center pt-16">
        <div className="text-6xl mb-4">🕐</div>
        <h2 className="text-3xl font-black mb-2 tred serif">TIME'S UP</h2>
        <p className="opacity-60 mb-8">You matched {matched} of {total} pairs</p>
        <GoldBtn onClick={()=>goto(5)}>Try Again</GoldBtn>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen fis" style={{background:'#0a0a0f'}}>
      <GlobalStyles/><HUD level={2}/>
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs uppercase tracking-widest opacity-50 mono">Level 2 — Memory Wall</span>
          <span className={`text-xl mono font-bold`} style={{color:timeLeft<20?'#f87171':'#c9a227'}}>
            {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
          </span>
        </div>

        <div className="flex justify-between text-xs opacity-40 mb-6 mono">
          <span>Pairs: {matched}/{total}</span>
          <span>Moves: {moves}</span>
          {status==='preview'&&<span style={{color:'#c9a227'}} className="animate-pulse">MEMORISE NOW...</span>}
        </div>

        {/* Grid */}
        <div className={`grid gap-3`} style={{gridTemplateColumns:`repeat(${cols},1fr)`}}>
          {cards.map(card=>(
            <div key={card.id} className={`flip-wrap aspect-square cursor-pointer ${card.matched?'opacity-30':''}`}
              onClick={()=>flipCard(card.id)} style={{userSelect:'none'}}>
              <div className={`flip-inner w-full h-full relative ${card.flipped||card.matched?'flipped':''}`}>
                <div className="flip-front w-full h-full flex items-center justify-center rounded border"
                  style={{background:'rgba(201,162,39,0.06)',borderColor:'rgba(201,162,39,0.25)'}}>
                  <span className="text-lg opacity-40">?</span>
                </div>
                <div className="flip-back w-full h-full flex items-center justify-center rounded border"
                  style={{background:'rgba(201,162,39,0.12)',borderColor:'#c9a227'}}>
                  <span className="text-2xl">{card.sym}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// LEVEL 3: SEQUENCE GAME
// ============================================================
const SEQ_COLORS = [
  {id:0,color:'#c9a227',name:'Gold'},
  {id:1,color:'#60a5fa',name:'Blue'},
  {id:2,color:'#f87171',name:'Red'},
  {id:3,color:'#4ade80',name:'Green'},
];

const Level3 = () => {
  const {g, goto, score} = useGame();
  const [sequence, setSequence] = useState([]);
  const [playerSeq, setPlayerSeq] = useState([]);
  const [phase, setPhase] = useState('start'); // start|showing|input|success|fail|gameover
  const [active, setActive] = useState(null);
  const [round, setRound] = useState(0);
  const [message, setMessage] = useState('');
  const [startTime] = useState(Date.now());
  const maxRounds = g.difficulty==='Easy'?5:g.difficulty==='Medium'?7:10;

  const showSequence = useCallback((seq) => {
    setPhase('showing');
    setPlayerSeq([]);
    let i=0;
    const interval = g.difficulty==='Hard'?450:g.difficulty==='Medium'?550:700;
    const flash = () => {
      if(i<seq.length){
        setActive(seq[i]);
        setTimeout(()=>setActive(null),interval-100);
        setTimeout(flash,interval);
        i++;
      } else {
        setTimeout(()=>setPhase('input'),300);
      }
    };
    setTimeout(flash,500);
  },[g.difficulty]);

  const startRound = useCallback((seq) => {
    const newSeq = [...seq, SEQ_COLORS[Math.floor(Math.random()*SEQ_COLORS.length)].id];
    setSequence(newSeq);
    setRound(r=>r+1);
    showSequence(newSeq);
  },[showSequence]);

  useEffect(()=>{
    if(phase==='start') {
      setMessage('Watch the sequence carefully...');
      const t = setTimeout(()=>startRound([]),1200);
      return ()=>clearTimeout(t);
    }
  },[]);

  const handlePress = (id) => {
    if(phase!=='input') return;
    const newP = [...playerSeq,id];
    setPlayerSeq(newP);
    setActive(id);
    setTimeout(()=>setActive(null),200);

    const idx = newP.length-1;
    if(sequence[idx]!==id){
      setPhase('fail');
      setMessage('Wrong! Jackson heard that.');
      setTimeout(()=>{
        if(round<=1){ setPhase('gameover'); } else {
          setPlayerSeq([]);
          showSequence(sequence);
        }
      },1200);
      return;
    }
    if(newP.length===sequence.length){
      if(round>=maxRounds){
        const time=Math.round((Date.now()-startTime)/1000);
        const pts=Math.max(100,600-Math.floor(time/5)*5);
        score(3,{score:pts,rounds:round,time});
        setPhase('success');
      } else {
        setPhase('showing');
        setMessage(`Round ${round} complete! Next sequence...`);
        setTimeout(()=>startRound(sequence),900);
      }
    }
  };

  if(phase==='success') return (
    <div className="min-h-screen flex flex-col items-center justify-center fis" style={{background:'#0a0a0f'}}>
      <GlobalStyles/><HUD level={3}/>
      <div className="text-center pt-16">
        <div className="sp1 text-6xl mb-4">🏆</div>
        <h2 className="sp2 text-3xl font-black mb-2 tgold serif">SIGNAL MATCHED</h2>
        <p className="sp3 opacity-60 mb-2">All {maxRounds} rounds completed</p>
        <p className="opacity-40 text-sm mb-8 italic" style={{fontFamily:"'Crimson Text',serif"}}>"The alarm system thinks you're McLeery."</p>
        <GoldBtn onClick={()=>goto(8)}>Continue →</GoldBtn>
      </div>
    </div>
  );

  if(phase==='gameover') return (
    <div className="min-h-screen flex flex-col items-center justify-center fis" style={{background:'#0a0a0f'}}>
      <GlobalStyles/><HUD level={3}/>
      <div className="text-center pt-16">
        <div className="text-6xl mb-4">🚨</div>
        <h2 className="text-3xl font-black mb-2 tred serif">ALARM TRIGGERED</h2>
        <p className="opacity-60 mb-8">You made it to round {round}</p>
        <GoldBtn onClick={()=>goto(7)}>Try Again</GoldBtn>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen fis flex flex-col items-center justify-center" style={{background:'#0a0a0f'}}>
      <GlobalStyles/><HUD level={3}/>
      <div className="w-full max-w-md px-4 pt-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs uppercase tracking-widest opacity-50 mono">Level 3 — Signal Sequence</span>
          <span className="text-xs mono" style={{color:'#c9a227'}}>Round {round}/{maxRounds}</span>
        </div>

        {/* Progress */}
        <div className="flex gap-1 mb-8">
          {Array.from({length:maxRounds}).map((_,i)=>(
            <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{background:i<round?'#c9a227':i===round-1?'rgba(201,162,39,0.5)':'rgba(255,255,255,0.1)'}}/>
          ))}
        </div>

        {/* Status */}
        <div className="text-center mb-8">
          <p className={`text-sm mono ${phase==='fail'?'tred':''}`} style={{color:phase==='input'?'#4ade80':'rgba(255,255,255,0.5)'}}>
            {phase==='showing'?'👁 WATCH THE SEQUENCE':phase==='input'?'👆 YOUR TURN — REPEAT IT':message||'...'}
          </p>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {SEQ_COLORS.map(btn=>(
            <button key={btn.id}
              onClick={()=>handlePress(btn.id)}
              className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all duration-150 ${phase!=='input'?'cursor-not-allowed':''}`}
              style={{
                borderColor:active===btn.id?btn.color:`${btn.color}40`,
                background:active===btn.id?`${btn.color}50`:`${btn.color}10`,
                transform:active===btn.id?'scale(1.08)':'scale(1)',
                filter:active===btn.id?'brightness(2)':'brightness(1)',
                boxShadow:active===btn.id?`0 0 24px ${btn.color}90`:'none',
                color:btn.color,
                transition:'all 0.15s',
              }}
            >
              {active===btn.id?'●':'○'}
            </button>
          ))}
        </div>

        {/* Player sequence progress */}
        {phase==='input' && (
          <div className="flex justify-center gap-2">
            {sequence.map((_,i)=>(
              <div key={i} className="w-3 h-3 rounded-full transition-all duration-200"
                style={{background:i<playerSeq.length?SEQ_COLORS[sequence[i]].color:'rgba(255,255,255,0.15)'}}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// LEVEL 4: SWITCH PUZZLE
// ============================================================
const makeSwitchPuzzle = (diff) => {
  const size = diff==='Easy'?3:diff==='Medium'?4:5;
  const rules = [];

  // Generate toggle rules (each switch affects itself + neighbours)
  for(let r=0;r<size;r++) for(let c=0;c<size;c++){
    const affected = [[r,c]];
    if(r>0) affected.push([r-1,c]);
    if(r<size-1) affected.push([r+1,c]);
    if(c>0) affected.push([r,c-1]);
    if(c<size-1) affected.push([r,c+1]);
    rules.push(affected);
  }

  // Generate a solvable puzzle by starting solved and doing random moves
  const solved = Array(size).fill(null).map(()=>Array(size).fill(true));
  let state = solved.map(r=>[...r]);
  const moves = diff==='Easy'?3:diff==='Medium'?5:7;
  for(let m=0;m<moves;m++){
    const r=Math.floor(Math.random()*size),c=Math.floor(Math.random()*size);
    const idx=r*size+c;
    rules[idx].forEach(([rr,cc])=>{ state[rr][cc]=!state[rr][cc]; });
  }

  return { size, state, rules, solved };
};

const Level4 = () => {
  const {g, goto, score} = useGame();
  const [puzzle] = useState(()=>makeSwitchPuzzle(g.difficulty));
  const [state, setState] = useState(()=>puzzle.state.map(r=>[...r]));
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState('playing');
  const [startTime] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState(g.difficulty==='Easy'?180:g.difficulty==='Medium'?120:90);
  const [lastFlipped, setLastFlipped] = useState(null);

  useEffect(()=>{
    if(status!=='playing') return;
    const t=setInterval(()=>setTimeLeft(p=>{ if(p<=1){setStatus('fail');return 0;} return p-1; }),1000);
    return ()=>clearInterval(t);
  },[status]);

  const toggle = (row,col) => {
    if(status!=='playing') return;
    const idx=row*puzzle.size+col;
    const newState = state.map(r=>[...r]);
    puzzle.rules[idx].forEach(([r,c])=>{ newState[r][c]=!newState[r][c]; });
    setState(newState);
    setMoves(m=>m+1);
    setLastFlipped(idx);

    // Check solved
    if(newState.every(r=>r.every(v=>v))){
      const time=Math.round((Date.now()-startTime)/1000);
      const pts=Math.max(100,600-moves*10-Math.floor(time/5)*5);
      score(4,{score:pts,moves:moves+1,time});
      setStatus('success');
    }
  };

  const all = state.every(r=>r.every(v=>v));
  const mins=Math.floor(timeLeft/60),secs=timeLeft%60;
  const danger=timeLeft<20;

  if(status==='success') return (
    <div className="min-h-screen flex flex-col items-center justify-center fis" style={{background:'#0a0a0f'}}>
      <GlobalStyles/><HUD level={4}/>
      <div className="text-center pt-16">
        <div className="sp1 text-6xl mb-4">⚡</div>
        <h2 className="sp2 text-3xl font-black mb-2 tgold serif">GATE UNLOCKED</h2>
        <p className="sp3 opacity-60 mb-2">{moves} switches · {Math.round((Date.now()-startTime)/1000)}s</p>
        <p className="opacity-40 text-sm mb-8 italic" style={{fontFamily:"'Crimson Text',serif"}}>"The outer yard is clear. Run, Evans."</p>
        <GoldBtn onClick={()=>goto(10)}>Final Level →</GoldBtn>
      </div>
    </div>
  );

  if(status==='fail') return (
    <div className="min-h-screen flex flex-col items-center justify-center fis" style={{background:'#0a0a0f'}}>
      <GlobalStyles/><HUD level={4}/>
      <div className="text-center pt-16">
        <div className="text-6xl mb-4">⏰</div>
        <h2 className="text-3xl font-black mb-2 tred serif">TIME'S UP</h2>
        <p className="opacity-60 mb-8">The warden returned too soon</p>
        <GoldBtn onClick={()=>goto(9)}>Try Again</GoldBtn>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen fis flex flex-col items-center justify-center" style={{background:'#0a0a0f'}}>
      <GlobalStyles/><HUD level={4}/>
      <div className="w-full max-w-md px-4 pt-20">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs uppercase tracking-widest opacity-50 mono">Level 4 — Switch Room</span>
          <span className={`text-xl mono font-bold`} style={{color:danger?'#f87171':'#c9a227'}}>
            {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
          </span>
        </div>

        <p className="text-xs opacity-40 mb-6 text-center mono">Light ALL switches. Each switch toggles its neighbours.</p>

        {/* Switch grid */}
        <div className="flex justify-center mb-6">
          <div style={{display:'grid',gridTemplateColumns:`repeat(${puzzle.size},1fr)`,gap:'10px'}}>
            {state.map((row,r)=>row.map((val,c)=>{
              const idx=r*puzzle.size+c;
              return (
                <button key={idx} onClick={()=>toggle(r,c)}
                  className="transition-all duration-200 rounded border-2 flex flex-col items-center justify-center font-bold"
                  style={{
                    width:60,height:60,
                    borderColor:val?'#c9a227':'rgba(255,255,255,0.15)',
                    background:val?'rgba(201,162,39,0.2)':'rgba(255,255,255,0.04)',
                    boxShadow:val?'0 0 16px rgba(201,162,39,0.5)':'none',
                    transform:lastFlipped===idx?'scale(0.95)':'scale(1)',
                  }}>
                  <span className="text-xl">{val?'●':'○'}</span>
                  <span className="text-xs mono mt-1" style={{color:val?'#c9a227':'rgba(255,255,255,0.3)'}}>{val?'ON':'OFF'}</span>
                </button>
              );
            }))}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="text-center">
          <p className="text-sm mono opacity-40">
            {state.flat().filter(Boolean).length} / {puzzle.size*puzzle.size} switches on
            <span className="ml-4" style={{color:'#c9a227'}}>Moves: {moves}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// LEVEL 5: THE FINAL DECODING (Time-Pressure Cipher)
// ============================================================
// Inspired by the German correction slip in the story.
// Evans must decode an encrypted message to find his escape route.
// Wrong characters reveal "guards" moving in. Correct ones clear the path.

const CIPHER_SHIFT = 3; // Caesar cipher shift
const ENCODED_MESSAGES = [
  { encoded: "IURP HOVEILHOG ZDB GULYH WR WKH KHDGLQJWRQ URXQGDERXW", decoded: "FROM ELSFIELD WAY DRIVE TO THE HEADINGTON ROUNDABOUT", route: "HEADINGTON" },
  { encoded: "OHDYH WKH SULVRQ JDWHV DQG WXUQ OHIW DW FDUIDU", decoded: "LEAVE THE PRISON GATES AND TURN LEFT AT CARFAX", route: "CARFAX" },
  { encoded: "WKH JROGHQ OLRQ LV DW FKLSSLQJ QRUWRQ", decoded: "THE GOLDEN LION IS AT CHIPPING NORTON", route: "CHIPPING NORTON" },
];

const decode = (encoded, shift=CIPHER_SHIFT) =>
  encoded.split('').map(ch => {
    if(ch>='A'&&ch<='Z') return String.fromCharCode(((ch.charCodeAt(0)-65-shift+26)%26)+65);
    return ch;
  }).join('');

const Level5 = () => {
  const {g, goto, score} = useGame();
  const [msgData] = useState(()=>ENCODED_MESSAGES[Math.floor(Math.random()*ENCODED_MESSAGES.length)]);
  const [input, setInput] = useState('');
  const [revealed, setRevealed] = useState(Array(msgData.decoded.length).fill(false));
  const [guards, setGuards] = useState(0); // wrong attempts
  const [timeLeft, setTimeLeft] = useState(g.difficulty==='Easy'?120:g.difficulty==='Medium'?90:60);
  const [status, setStatus] = useState('playing');
  const [startTime] = useState(Date.now());
  const [phase, setPhase] = useState('intro'); // intro | playing
  const maxGuards = g.difficulty==='Easy'?6:g.difficulty==='Medium'?4:3;
  const inputRef = useRef();

  const target = msgData.decoded.replace(/\s/g,'');

  useEffect(()=>{ const t=setTimeout(()=>setPhase('playing'),2500); return()=>clearTimeout(t); },[]);

  useEffect(()=>{
    if(status!=='playing'||phase!=='playing') return;
    const t=setInterval(()=>setTimeLeft(p=>{ if(p<=1){setStatus('timeout');return 0;} return p-1; }),1000);
    return()=>clearInterval(t);
  },[status,phase]);

  const handleKey = (ch) => {
    if(status!=='playing') return;
    const current = input + ch;
    const targetSlice = target.slice(0, current.length);

    if(current.toUpperCase()===targetSlice){
      setInput(current.toUpperCase());
      // Reveal matching characters in original decoded message
      let count=0;
      const newRevealed=[...revealed];
      for(let i=0;i<msgData.decoded.length;i++){
        if(msgData.decoded[i]===' '){newRevealed[i]=true;continue;}
        if(count<current.length){newRevealed[i]=true;count++;}
      }
      setRevealed(newRevealed);

      if(current.length===target.length){
        const time=Math.round((Date.now()-startTime)/1000);
        const pts=Math.max(200,800-guards*80-Math.floor(time/5)*10);
        score(5,{score:pts,guards,time});
        setStatus('success');
      }
    } else {
      const newG=guards+1;
      setGuards(newG);
      if(newG>=maxGuards) setStatus('caught');
    }
  };

  const handleInputChange = (e) => {
    const val=e.target.value.toUpperCase().replace(/[^A-Z]/g,'');
    if(val.length<=input.length) return; // don't allow deletion breaking logic
    const newCh=val[val.length-1];
    handleKey(newCh);
  };

  const mins=Math.floor(timeLeft/60),secs=timeLeft%60;
  const progress=Math.round((input.length/target.length)*100);

  if(phase==='intro') return (
    <div className="min-h-screen flex flex-col items-center justify-center fis" style={{background:'#0a0a0f'}}>
      <GlobalStyles/><HUD level={5}/>
      <div className="text-center px-6 max-w-lg pt-16">
        <div className="text-5xl mb-6 animate-pulse">📜</div>
        <h2 className="text-3xl font-black mb-4 serif" style={{color:'#f87171'}}>THE FINAL DECODING</h2>
        <p className="text-base opacity-70 leading-relaxed mb-4" style={{fontFamily:"'Crimson Text',serif"}}>
          The German question paper contains your escape route, encrypted in a Caesar cipher.
        </p>
        <p className="text-sm opacity-50 italic" style={{fontFamily:"'Crimson Text',serif"}}>
          "You must follow the plan already arranged..."
        </p>
      </div>
    </div>
  );

  if(status==='success') return (
    <div className="min-h-screen flex flex-col items-center justify-center fis" style={{background:'#0a0a0f'}}>
      <GlobalStyles/><HUD level={5}/>
      <div className="text-center pt-16 px-6">
        <div className="sp1 text-6xl mb-4">🏃</div>
        <h2 className="sp2 text-3xl font-black mb-2 tgold serif">ROUTE DECODED</h2>
        <p className="sp3 text-lg mb-2" style={{color:'#c9a227'}}>{msgData.decoded}</p>
        <p className="opacity-40 text-sm mb-8 italic" style={{fontFamily:"'Crimson Text',serif"}}>"Evans is out. Head for the Golden Lion."</p>
        <GoldBtn onClick={()=>goto(12)}>See Results →</GoldBtn>
      </div>
    </div>
  );

  if(status==='caught'||status==='timeout') return (
    <div className="min-h-screen flex flex-col items-center justify-center fis" style={{background:'#0a0a0f'}}>
      <GlobalStyles/><HUD level={5}/>
      <div className="text-center pt-16">
        <div className="text-6xl mb-4">👮</div>
        <h2 className="text-3xl font-black mb-2 tred serif">{status==='caught'?'RECAPTURED':'TOO SLOW'}</h2>
        <p className="opacity-60 mb-8">{status==='caught'?'Too many wrong characters exposed you.':'The Governor closed in before you decoded the route.'}</p>
        <GoldBtn onClick={()=>goto(11)}>Try Again</GoldBtn>
      </div>
    </div>
  );

  // Playing state
  const KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className={`min-h-screen fis flex flex-col ${timeLeft<15?'dp':''}`} style={{background:'#0a0a0f'}}>
      <GlobalStyles/><HUD level={5}/>
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-8 w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs uppercase tracking-widest opacity-50 mono">Level 5 — Final Decoding</span>
          <div className="flex items-center gap-4">
            <span className="text-xs mono opacity-50">Guards: {guards}/{maxGuards}</span>
            <span className={`text-xl mono font-bold`} style={{color:timeLeft<20?'#f87171':'#c9a227'}}>
              {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
            </span>
          </div>
        </div>

        {/* Guard danger bar */}
        <div className="flex gap-1 mb-4">
          {Array.from({length:maxGuards}).map((_,i)=>(
            <div key={i} className="flex-1 h-1.5 rounded transition-all duration-300"
              style={{background:i<guards?'#f87171':'rgba(255,255,255,0.1)'}}/>
          ))}
        </div>

        {/* Encoded message */}
        <div className="mb-4 p-3 border" style={{borderColor:'rgba(201,162,39,0.2)',background:'rgba(0,0,0,0.3)'}}>
          <p className="text-xs mono opacity-40 mb-1">ENCODED MESSAGE (Caesar +{CIPHER_SHIFT}):</p>
          <p className="text-sm mono tracking-widest" style={{color:'rgba(201,162,39,0.6)',wordBreak:'break-all'}}>{msgData.encoded}</p>
        </div>

        {/* Decoded message reveal */}
        <div className="mb-4 p-4 border min-h-16" style={{borderColor:'rgba(201,162,39,0.3)',background:'rgba(201,162,39,0.04)'}}>
          <p className="text-xs mono opacity-40 mb-2">DECODING IN PROGRESS:</p>
          <div className="flex flex-wrap gap-1">
            {msgData.decoded.split('').map((ch,i)=>(
              ch===' ' ? <span key={i} className="w-3"/> :
              <span key={i} className="mono font-bold text-base transition-all duration-200"
                style={{color:revealed[i]?'#c9a227':'rgba(255,255,255,0.15)',textShadow:revealed[i]?'0 0 10px rgba(201,162,39,0.8)':'none'}}>
                {revealed[i]?ch:'_'}
              </span>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mono opacity-40 mb-1">
            <span>Progress</span><span>{progress}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{background:'rgba(255,255,255,0.1)'}}>
            <div className="h-full rounded-full transition-all duration-300" style={{width:`${progress}%`,background:'#c9a227'}}/>
          </div>
        </div>

        {/* Keyboard */}
        <div className="mb-3">
          <p className="text-xs mono opacity-30 mb-2 text-center">Type the decoded message (A–Z shifts back by {CIPHER_SHIFT})</p>
          <div className="grid grid-cols-9 gap-1.5">
            {KEYS.map(k=>(
              <button key={k} onClick={()=>handleKey(k)}
                className="py-2 text-sm mono font-bold rounded border transition-all duration-150 hover:scale-105 active:scale-90"
                style={{borderColor:'rgba(201,162,39,0.3)',background:'rgba(201,162,39,0.06)',color:'#c9a227'}}>
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Hint */}
        <p className="text-xs opacity-20 text-center mono">
          Hint: each letter is shifted by {CIPHER_SHIFT}. E.g. D→A, F→C
        </p>
      </div>
    </div>
  );
};

// ============================================================
// RESULTS
// ============================================================
const Results = () => {
  const {g, resetGame, goto, saveToLeaderboard, getLB} = useGame();
  const [lb, setLb] = useState([]);
  const [saved, setSaved] = useState(false);
  const totalTime = g.startTime ? Math.round((Date.now()-g.startTime)/1000) : 0;
  const mins=Math.floor(totalTime/60),secs=totalTime%60;

  const stars = g.total>2000?3:g.total>1000?2:1;

  useEffect(()=>{
    if(!saved){
      const entry={name:g.username,score:g.total,difficulty:g.difficulty,time:totalTime,date:new Date().toLocaleDateString()};
      const updated=saveToLeaderboard(entry);
      setLb(updated);
      setSaved(true);
    }
  },[]);

  const myRank=(lb.findIndex(e=>e.name===g.username&&e.score===g.total)+1)||'?';

  return (
    <div className="min-h-screen fis relative overflow-hidden" style={{background:'linear-gradient(135deg,#0a0a0f,#0d1117)'}}>
      <GlobalStyles/>
      <div className="absolute inset-0 bars opacity-20 pointer-events-none"/>
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none" style={{background:'radial-gradient(circle,rgba(201,162,39,0.07) 0%,transparent 70%)'}}/>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-16 flex flex-col items-center">
        {/* Stars */}
        <div className="flex gap-2 mb-6">
          {[1,2,3].map(s=>(
            <span key={s} className={`text-4xl sp${s}`} style={{opacity:s<=stars?1:0.15}}>⭐</span>
          ))}
        </div>

        <p className="fu1 text-xs tracking-[0.5em] uppercase opacity-40 mb-2 mono">Case Closed</p>
        <h1 className="fu2 text-5xl font-black mb-2 tgold serif">ESCAPED</h1>
        <p className="fu3 text-lg opacity-60 italic mb-8" style={{fontFamily:"'Crimson Text',serif"}}>
          "I may surprise everybody." — Evans
        </p>

        {/* Stats */}
        <div className="fu4 w-full grid grid-cols-2 gap-3 mb-8">
          {[
            {label:'Final Score',value:g.total,accent:'#c9a227'},
            {label:'Total Time',value:`${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`,accent:'#60a5fa'},
            {label:'Difficulty',value:g.difficulty,accent:g.difficulty==='Hard'?'#f87171':g.difficulty==='Medium'?'#facc15':'#4ade80'},
            {label:'Leaderboard Rank',value:`#${myRank}`,accent:'#a78bfa'},
          ].map(({label,value,accent})=>(
            <div key={label} className="p-4 border" style={{borderColor:`${accent}30`,background:`${accent}07`}}>
              <p className="text-xs mono opacity-40 mb-1">{label}</p>
              <p className="text-2xl font-bold mono" style={{color:accent}}>{value}</p>
            </div>
          ))}
        </div>

        {/* Level breakdown */}
        <div className="fu5 w-full mb-8">
          <h3 className="text-xs tracking-widest uppercase opacity-40 mb-3 mono">Level Scores</h3>
          {[1,2,3,4,5].map(lv=>{
            const s=g.scores[lv];
            return (
              <div key={lv} className="flex justify-between items-center py-2 border-b" style={{borderColor:'rgba(255,255,255,0.06)'}}>
                <span className="text-sm opacity-60" style={{fontFamily:"'Crimson Text',serif"}}>{levelMeta[lv]?.title||`Level ${lv}`}</span>
                <span className="mono text-sm" style={{color:'#c9a227'}}>{s?.score||'—'}</span>
              </div>
            );
          })}
        </div>

        {/* Story outro */}
        <div className="fu6 w-full mb-8 p-4 border italic text-sm leading-relaxed opacity-60" style={{borderColor:'rgba(201,162,39,0.2)',fontFamily:"'Crimson Text',serif"}}>
          As the prison van turned right from Chipping Norton, Evans settled comfortably and grinned. "I just happened to notice," he said, "that you've got some O-level Italian classes coming up next September." The Governor sighed. He knew what that meant.
        </div>

        {/* Actions */}
        <div className="flex gap-4 flex-wrap justify-center">
          <GoldBtn onClick={()=>{resetGame();goto(0);}}>Play Again</GoldBtn>
          <button onClick={()=>goto(0)} className="px-8 py-3 border text-sm mono opacity-40 hover:opacity-70 transition-opacity" style={{borderColor:'rgba(255,255,255,0.15)',color:'#f5f0e8'}}>Home</button>
        </div>

        {/* Leaderboard */}
        {lb.length>0 && (
          <div className="w-full mt-10">
            <h3 className="text-xs tracking-widest uppercase opacity-40 mb-4 mono text-center">— Hall of Escapees —</h3>
            {lb.map((e,i)=>(
              <div key={i} className={`flex justify-between py-2 border-b ${e.name===g.username&&e.score===g.total?'':'opacity-60'}`}
                style={{borderColor:'rgba(255,255,255,0.05)'}}>
                <div className="flex items-center gap-3">
                  <span className="text-xs mono opacity-40 w-5">#{i+1}</span>
                  <span className="text-sm" style={{fontFamily:"'Crimson Text',serif",color:e.name===g.username&&e.score===g.total?'#c9a227':'#f5f0e8'}}>{e.name}</span>
                  <span className="text-xs mono opacity-30">{e.difficulty}</span>
                </div>
                <span className="mono text-sm" style={{color:'#c9a227'}}>{e.score}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// APP ROUTER
// ============================================================
const AppInner = () => {
  const {g, goto} = useGame();
  const lv = g.level;
  return (
    <>
      {lv===0  && <Home/>}
      {lv===1  && <StoryIntro/>}
      {lv===2  && <LevelTransition lv={1} next={3}/>}
      {lv===3  && <Level1/>}
      {lv===4  && <LevelTransition lv={2} next={5}/>}
      {lv===5  && <Level2/>}
      {lv===6  && <LevelTransition lv={3} next={7}/>}
      {lv===7  && <Level3/>}
      {lv===8  && <LevelTransition lv={4} next={9}/>}
      {lv===9  && <Level4/>}
      {lv===10 && <LevelTransition lv={5} next={11}/>}
      {lv===11 && <Level5/>}
      {lv===12 && <Results/>}
    </>
  );
};

export default function App() {
  return (
    <GameProvider>
      <AppInner/>
    </GameProvider>
  );
}