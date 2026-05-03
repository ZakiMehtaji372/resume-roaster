"use client";

import { useEffect, useState } from "react";
import type { RoastResult } from "@/lib/parseRoast";

interface ScoreCardProps {
  result: RoastResult;
}

function getScoreConfig(score: number) {
  if (score < 50) {
    return {
      color: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-100",
      ringColor: "ring-red-200",
      label: "Needs Work",
      emoji: "🔥",
      glowClass: "score-glow-red",
      trackColor: "bg-red-100",
      fillColor: "bg-red-500",
    };
  } else if (score < 75) {
    return {
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-100",
      ringColor: "ring-amber-200",
      label: "Getting There",
      emoji: "⚡",
      glowClass: "score-glow-amber",
      trackColor: "bg-amber-100",
      fillColor: "bg-amber-500",
    };
  } else {
    return {
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-100",
      ringColor: "ring-emerald-200",
      label: "Solid",
      emoji: "✦",
      glowClass: "score-glow-green",
      trackColor: "bg-emerald-100",
      fillColor: "bg-emerald-500",
    };
  }
}

export function ScoreCard({ result }: ScoreCardProps) {
  const { score, verdict, strengths, weaknesses } = result;
  const config = getScoreConfig(score);

  // Animate score counting up
  const [displayScore, setDisplayScore] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = score / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="animate-fade-up">
      {/* Score hero */}
      <div className={`rounded-2xl border ${config.borderColor} ${config.bgColor} px-8 py-10 text-center mb-6`}>
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-2xl">{config.emoji}</span>
          <span className={`text-xs font-semibold tracking-widest uppercase ${config.color}`}>
            Resume Score
          </span>
          <span className="text-2xl">{config.emoji}</span>
        </div>

        <div className={`font-display text-9xl font-black leading-none mb-2 ${config.color} ${config.glowClass} tabular-nums`}>
          {displayScore}
        </div>

        <div className={`text-xs font-mono font-medium tracking-widest uppercase mb-1 ${config.color} opacity-60`}>
          out of 100 · {config.label}
        </div>

        {/* Progress bar */}
        <div className={`mt-5 mx-auto max-w-xs h-1.5 rounded-full ${config.trackColor}`}>
          <div
            className={`h-1.5 rounded-full ${config.fillColor} transition-all duration-1000 ease-out`}
            style={{ width: `${displayScore}%` }}
          />
        </div>

        <p className="mt-6 text-stone-700 font-body text-base leading-relaxed max-w-lg mx-auto text-balance italic">
          "{verdict}"
        </p>
      </div>

      {/* Strengths + Weaknesses */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-2 animate-fade-up">
        {/* Strengths */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <h3 className="font-display text-sm font-bold text-emerald-700 uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Strengths
          </h3>
          <ul className="space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-emerald-900">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-200 flex-shrink-0 flex items-center justify-center text-emerald-700 text-[10px] font-bold">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
          <h3 className="font-display text-sm font-bold text-red-600 uppercase tracking-widest mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l1.664 9.143A2.25 2.25 0 006.91 14.25h10.18a2.25 2.25 0 002.246-2.107L20.25 6H6M12 18v3M9 21h6" />
            </svg>
            Red Flags
          </h3>
          <ul className="space-y-2">
            {weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-red-900">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-red-200 flex-shrink-0 flex items-center justify-center text-red-700 text-[10px] font-bold">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
