"use client";

import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { ScoreCard } from "@/components/ScoreCard";
import { BulletRewriter } from "@/components/BulletRewriter";
import { LoadingRoast } from "@/components/LoadingRoast";
import { extractPdf } from "@/lib/extractPdf";
import type { RoastResult } from "@/lib/parseRoast";

// --- Default sample roast shown before any upload ---
const SAMPLE_ROAST: RoastResult = {
  score: 41,
  verdict:
    "A graveyard of vague responsibilities dressed up in corporate jargon — this résumé tells recruiters what you did, not why they should care.",
  strengths: [
    "Strong educational background from a recognizable institution that at least establishes baseline credibility.",
    "Tenure at well-known companies adds implicit social proof, even if the bullets don't back it up.",
  ],
  weaknesses: [
    "Every bullet starts with a verb but ends with nothing quantifiable — 'led initiatives' and 'managed projects' mean absolutely nothing without numbers.",
    "The skills section reads like a keyword dump. Any recruiter who's seen more than ten résumés will skim straight past it.",
    "No clear narrative thread — a recruiter can't tell whether you're a generalist, a specialist, or just lost.",
  ],
  bullets: [
    {
      original:
        "Responsible for managing a team of engineers to deliver product features on time.",
      rewritten:
        "Led a 6-person engineering team to ship 14 product features across 3 quarters, reducing release cycle from 3 weeks to 8 days.",
      reason:
        "The original tells recruiters you had a responsibility. The rewrite proves you executed on it. Specific team size, output count, and time improvement make the impact impossible to ignore.",
    },
    {
      original:
        "Worked closely with stakeholders to improve the customer onboarding experience.",
      rewritten:
        "Partnered with Product and CX teams to redesign onboarding flow, cutting median time-to-activate from 11 days to 4 and increasing 30-day retention by 18%.",
      reason:
        "'Worked closely with stakeholders' is what every single résumé says. The rewrite names the teams, the specific outcome, and the business metric that proves the work actually mattered.",
    },
    {
      original: "Helped drive adoption of new internal tools across the organization.",
      rewritten:
        "Championed rollout of Notion + Linear across 4 departments (120+ employees), achieving 87% weekly active usage within 60 days of launch.",
      reason:
        "'Helped drive adoption' is deliberately vague — it sounds like you attended one Zoom call. The rewrite shows scale, timeline, and the adoption metric that proves the initiative succeeded.",
    },
  ],
};

type AppState = "idle" | "extracting" | "roasting" | "done" | "error";

export default function Home() {
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<RoastResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setErrorMsg("");
    setResult(null);

    try {
      // Step 1: Extract PDF text in browser
      setState("extracting");
      const text = await extractPdf(file);

      if (!text || text.length < 50) {
        throw new Error(
          "Could not extract text from this PDF. Make sure it's a text-based PDF, not a scanned image."
        );
      }

      // Step 2: Send to API
      setState("roasting");
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Server error: ${res.status}`);
      }

      const data: RoastResult = await res.json();
      setResult(data);
      setState("done");
    } catch (err) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  };

  const reset = () => {
    setState("idle");
    setResult(null);
    setErrorMsg("");
    setFileName("");
  };

  const isLoading = state === "extracting" || state === "roasting";
  const displayResult = result ?? SAMPLE_ROAST;
  const isSample = result === null;

  return (
    <div className="noise min-h-screen">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <span className="font-display font-bold text-stone-900 text-lg tracking-tight">
              Résumé Roaster
            </span>
          </div>
          <span className="text-xs font-mono text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">
            Made by Zaki Mehtaji
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pb-24">
        {/* Hero */}
        <section className="pt-12 pb-10 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-indigo-600 bg-indigo-50 rounded-full px-3 py-1.5 mb-6 border border-indigo-100">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            Brutally honest · Constructively useful
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-stone-900 leading-[1.1] mb-4 text-balance">
            Your résumé deserves
            <span className="italic text-red-500"> honest</span> feedback.
          </h1>
          <p className="text-stone-500 text-base max-w-md mx-auto leading-relaxed">
            Upload your PDF and get a score, a verdict, and rewritten bullets
            that actually land interviews — not just vibes.
          </p>
        </section>

        {/* Upload zone */}
        <section className="mb-10">
          {!isLoading && state !== "done" && (
            <UploadZone onFile={handleFile} disabled={isLoading} />
          )}

          {state === "extracting" && (
            <div className="text-center py-6 text-sm text-stone-500 font-mono flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Reading {fileName || "your PDF"}...
            </div>
          )}

          {isLoading && state === "roasting" && <LoadingRoast />}

          {state === "error" && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
              <p className="text-2xl mb-2">😬</p>
              <p className="font-semibold text-red-700 mb-1">That didn't work</p>
              <p className="text-sm text-red-600 mb-4">{errorMsg}</p>
              <button
                onClick={reset}
                className="text-sm font-medium text-red-700 underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          )}

          {state === "done" && (
            <div className="flex items-center justify-between bg-white rounded-xl border border-stone-200 px-4 py-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-stone-600">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="font-medium">{fileName}</span>
                <span className="text-stone-400">— roasted successfully</span>
              </div>
              <button
                onClick={reset}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Upload new →
              </button>
            </div>
          )}
        </section>

        {/* Sample notice */}
        {isSample && state === "idle" && (
          <div className="mb-8 rounded-2xl border border-dashed border-amber-200 bg-amber-50 px-5 py-4 flex items-start gap-3">
            <span className="text-lg mt-0.5">👇</span>
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-0.5">
                This is a sample roast
              </p>
              <p className="text-sm text-amber-700">
                Upload your own résumé above to get your personal score and rewritten bullets.
              </p>
            </div>
          </div>
        )}

        {/* Results */}
{(state === "done" || isSample) && !isLoading && (
  <div className="space-y-10">

    {/* Score Card (Enhanced) */}
    <section className="animate-fade-up stagger-1">
      <div className="bg-white border border-stone-200 rounded-2xl p-7 shadow-sm">

        {/* SCORE */}
        <div className="text-center mb-8">
  <h1
    className={`text-7xl font-black tracking-tight ${
      displayResult.score < 50
        ? "text-red-500 score-glow-red"
        : displayResult.score < 70
        ? "text-amber-500 score-glow-amber"
        : "text-green-500 score-glow-green"
    }`}
  >
    {displayResult.score}
  </h1>

  <p className="text-sm text-stone-400 mt-2 uppercase tracking-wide">
    Resume Score
  </p>

  <p className="text-sm text-stone-500 mt-1">
    {displayResult.score < 50
      ? "Below average — needs serious improvement"
      : displayResult.score < 70
      ? "Decent but needs work"
      : "Strong resume"}
  </p>


          <p className="text-sm text-stone-500 mt-2 uppercase tracking-wide">
            Resume Score
          </p>

          <p className="mt-4 text-stone-700 font-medium leading-relaxed max-w-md mx-auto text-balance">
            {displayResult.verdict}
          </p>
        </div>

        {/* BREAKDOWN */}
        {displayResult.breakdown && (
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-stone-400 mb-4 uppercase tracking-widest">
              Score Breakdown
            </h3>

            <div className="space-y-4">
              {Object.entries(displayResult.breakdown).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs text-stone-500 mb-1">
                    <span className="capitalize">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>

                  <div className="w-full bg-stone-100 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STRENGTHS & WEAKNESSES */}
        <div className="grid sm:grid-cols-2 gap-6">

          <div>
            <h3 className="text-xs font-semibold text-green-600 mb-3 uppercase tracking-wide">
              Strengths
            </h3>
            <ul className="space-y-2 text-sm text-stone-700 leading-relaxed">
              {displayResult.strengths.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-red-500 mb-3 uppercase tracking-wide">
              Weaknesses
            </h3>
            <ul className="space-y-2 text-sm text-stone-700 leading-relaxed">
              {displayResult.weaknesses.map((w, i) => (
                <li key={i}>• {w}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>

    {/* Action Plan */}
    {displayResult.improvements && displayResult.improvements.length > 0 && (
      <section className="animate-fade-up stagger-2">
        <div className="bg-white border border-stone-200 rounded-2xl p-6">
          <h2 className="font-display text-xl font-bold text-stone-900 mb-4">
            ⚡ Action Plan
          </h2>

          <div className="space-y-2 text-sm text-stone-700">
            {displayResult.improvements.map((item, i) => (
              <p key={i}>• {item}</p>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* Bullet rewrites */}
    {displayResult.bullets.length > 0 && (
      <section className="animate-fade-up stagger-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-stone-900">
            Bullet Surgery
          </h2>

          <span className="text-xs font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
            {displayResult.bullets.length} rewrites
          </span>
        </div>

        <p className="text-sm text-stone-500 mb-6 leading-relaxed">
          These are the weakest lines in your résumé. Each rewrite focuses on
          measurable impact and clarity.
        </p>

        <div className="space-y-5">
          {displayResult.bullets.map((b, i) => (
            <BulletRewriter key={i} bullet={b} index={i} />
          ))}
        </div>
      </section>
    )}

    {/* CTA */}
    {isSample && (
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 p-8 text-center text-white animate-fade-up stagger-4">
        <p className="text-2xl mb-3">🚀</p>

        <h3 className="font-display text-2xl font-bold mb-2">
          Try your real résumé
        </h3>

        <p className="text-indigo-200 text-sm mb-5 max-w-sm mx-auto">
          Upload your PDF and get instant, brutally honest feedback with
          actionable improvements.
        </p>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-white text-indigo-700 font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors"
        >
          Upload résumé ↑
        </button>
      </div>
    )}
  </div>
)}

</main>

{/* Footer */}
<footer className="border-t border-stone-100 py-8 text-center">
  <p className="text-xs text-stone-400 font-mono">
    AI-powered · No data stored · PDFs processed locally
  </p>
</footer>
    </div>
  );
}