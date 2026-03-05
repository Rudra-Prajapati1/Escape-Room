import React, { useState, useEffect, useRef } from "react";

export default function Typewriter({
  text,
  speed = 35,
  onComplete,
  className = "",
}) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(intervalRef.current);
        setDone(true);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(intervalRef.current);
  }, [text, speed]);

  const skip = () => {
    if (done) return;
    clearInterval(intervalRef.current);
    setDisplayed(text);
    setDone(true);
    if (onComplete) onComplete();
  };

  return (
    <div onClick={skip} className="cursor-pointer">
      <p className={className}>
        {displayed}
        {!done && <span className="animate-pulse">|</span>}
      </p>
      {!done && (
        <p className="text-slate-600 text-xs mt-4 text-right">
          Click to skip →
        </p>
      )}
    </div>
  );
}
