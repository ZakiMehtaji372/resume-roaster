"use client";

import { useState } from "react";

export function BulletRewriter({
  bullet,
  index,
}: {
  bullet: {
    original: string;
    rewritten: string;
    reason: string;
  };
  index: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bullet.rewritten);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className="border border-stone-200 rounded-xl p-5 bg-white">

      {/* Original */}
      <p className="text-sm text-red-500 line-through mb-2">
        {bullet.original}
      </p>

      {/* Rewritten */}
      <p className="text-sm text-green-700 font-medium mb-2">
        {bullet.rewritten}
      </p>

      {/* Reason */}
      <p className="text-xs text-stone-500 mb-3">
        {bullet.reason}
      </p>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
      >
        {copied ? "Copied ✓" : "Copy rewrite"}
      </button>
    </div>
  );
}