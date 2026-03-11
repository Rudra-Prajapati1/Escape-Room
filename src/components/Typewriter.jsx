import React, { useEffect, useRef } from "react";

export default function Typewriter({
  text,
  speed = 35,
  onComplete,
  className = "",
}) {
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    onCompleteRef.current?.();
  }, [text]);

  return (
    <div className="cursor-pointer">
      <p className={className}>{text}</p>
    </div>
  );
}
