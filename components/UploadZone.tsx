"use client";

import { useRef, useState, useCallback } from "react";

interface UploadZoneProps {
  onFile: (file: File) => void;
  disabled?: boolean;
}

export function UploadZone({ onFile, disabled }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (file.type !== "application/pdf") {
        setError("Only PDF files are supported. Please upload a .pdf file.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File too large. Please keep it under 10 MB.");
        return;
      }
      onFile(file);
    },
    [onFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200
          px-8 py-14 text-center select-none
          ${isDragging
            ? "border-indigo-500 bg-indigo-50 scale-[1.01]"
            : "border-stone-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/30"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #6366f1 0, #6366f1 1px, transparent 0, transparent 50%)`,
            backgroundSize: "12px 12px",
          }}
        />

        {/* Icon */}
        <div className={`mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 
          ${isDragging ? "bg-indigo-100 scale-110" : "bg-stone-100 group-hover:bg-indigo-100 group-hover:scale-105"}`}
        >
          <svg className={`w-8 h-8 transition-colors ${isDragging ? "text-indigo-600" : "text-stone-400 group-hover:text-indigo-500"}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
        </div>

        <p className={`text-base font-semibold mb-1 transition-colors ${isDragging ? "text-indigo-700" : "text-stone-700"}`}>
          {isDragging ? "Drop it like it's hot" : "Drop your résumé here"}
        </p>
        <p className="text-sm text-stone-400">
          PDF only · max 10 MB ·{" "}
          <span className={`underline underline-offset-2 transition-colors ${isDragging ? "text-indigo-500" : "text-indigo-400 group-hover:text-indigo-500"}`}>
            or click to browse
          </span>
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={onInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
