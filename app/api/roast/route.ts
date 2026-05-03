import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { parseRoast } from "@/lib/parseRoast";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `
You are an elite resume reviewer and ex-FAANG hiring manager.

Be brutally honest, highly practical, and specific.

Return ONLY valid JSON (no markdown, no explanation outside JSON):

{
  "score": number (0-100),
  "breakdown": {
    "impact": number,
    "clarity": number,
    "ats": number,
    "structure": number
  },
  "verdict": "one sharp sentence that feels like a real recruiter comment",
  "strengths": ["specific strength", "specific strength"],
  "weaknesses": ["specific issue", "specific issue"],
  "improvements": [
    "actionable fix",
    "actionable fix"
  ],
  "bullets": [
    {
      "original": "weak bullet",
      "rewritten": "strong bullet with metrics, action verbs, and impact",
      "reason": "why this rewrite is better"
    }
  ]
}

Rules:
- Penalize vague words like "worked on", "helped", "responsible for"
- Reward quantified impact (%, numbers, outcomes)
- Be direct, not polite
- Think like a recruiter scanning in 10 seconds
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeText } = body as { resumeText: string };

    if (!resumeText || typeof resumeText !== "string") {
      return NextResponse.json(
        { error: "resumeText is required" },
        { status: 400 }
      );
    }

    // limit size
    const truncated = resumeText.slice(0, 3000);

    const response = await groq.chat.completions.create({
  messages: [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: resumeText,
    },
  ],
  model: "openai/gpt-oss-120b",
  });

    const rawText = response.choices[0].message.content || "";

    const result = parseRoast(rawText);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[roast] error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}