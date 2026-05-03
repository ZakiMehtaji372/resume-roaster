"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Judging your life choices...",
  "Finding all the buzzwords...",
  "Counting how many times you wrote 'synergy'...",
  "Wondering who approved this formatting...",
  "Consulting the ghost of Steve Jobs...",
  "Verifying that 'passionate' adds zero value...",
  "Googling what 'detail-oriented' even means...",
  "Checking if 'ninja' is still a job title...",
  "Asking why you used Comic Sans... just kidding...",
  "Preparing the constructive criticism...",
];

export function LoadingRoast() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % MESSAGES.length);
        setFade(true);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
      {/* Flame animation */}
      <div className="relative">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center shadow-lg shadow-red-200 animate-pulse-slow">
          <span className="text-4xl animate-wiggle inline-block">🔥</span>
        </div>
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400" />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }}>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-400" />
        </div>
      </div>

      {/* Message */}
      <div className="text-center max-w-xs">
        <p className="font-display text-xl font-bold text-stone-800 mb-2">
          Roasting your résumé
        </p>
        <p
          className={`text-sm text-stone-500 font-mono transition-opacity duration-300 cursor-blink ${fade ? "opacity-100" : "opacity-0"}`}
          style={{ minHeight: "1.5rem" }}
        >
          {MESSAGES[msgIndex]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-red-500 rounded-full animate-bounce"
          style={{
            animation: "loadingBar 2s ease-in-out infinite",
            width: "40%",
          }}
        />
      </div>

      <style>{`
        @keyframes loadingBar {
          0% { transform: translateX(-150%); }
          50% { transform: translateX(150%); }
          100% { transform: translateX(-150%); }
        }
      `}</style>
    </div>
  );
}
