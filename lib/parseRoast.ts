export interface BulletRewrite {
  original: string;
  rewritten: string;
  reason: string;
}

export interface ScoreBreakdown {
  impact: number;
  clarity: number;
  ats: number;
  structure: number;
}

export interface RoastResult {
  score: number;
  breakdown: ScoreBreakdown;
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  bullets: BulletRewrite[];
}

export function parseRoast(raw: string): RoastResult {
  try {
    let cleaned = raw.trim();

    // Remove markdown fences
    cleaned = cleaned
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "");

    // Extract JSON object
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    const parsed = JSON.parse(cleaned);

    return {
      score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),

      breakdown: {
        impact: Number(parsed?.breakdown?.impact) || 0,
        clarity: Number(parsed?.breakdown?.clarity) || 0,
        ats: Number(parsed?.breakdown?.ats) || 0,
        structure: Number(parsed?.breakdown?.structure) || 0,
      },

      verdict: String(parsed.verdict || "No verdict provided."),

      strengths: Array.isArray(parsed.strengths)
        ? parsed.strengths.map(String)
        : [],

      weaknesses: Array.isArray(parsed.weaknesses)
        ? parsed.weaknesses.map(String)
        : [],

      improvements: Array.isArray(parsed.improvements)
        ? parsed.improvements.map(String)
        : [],

      bullets: Array.isArray(parsed.bullets)
        ? parsed.bullets.map((b: any) => ({
            original: String(b.original || ""),
            rewritten: String(b.rewritten || ""),
            reason: String(b.reason || ""),
          }))
        : [],
    };
  } catch (error) {
    console.error("Parse error:", error);

    // fallback safe response
    return {
      score: 0,
      breakdown: {
        impact: 0,
        clarity: 0,
        ats: 0,
        structure: 0,
      },
      verdict: "Failed to parse AI response.",
      strengths: [],
      weaknesses: [],
      improvements: [],
      bullets: [],
    };
  }
}