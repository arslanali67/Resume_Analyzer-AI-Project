/**
 * Score-to-colour mapping for the candidate portal.
 *
 * Muted, warm hues chosen to sit beside the green brand accent without
 * competing with it. Kept out of ui.tsx so that file exports only components.
 */

export const TONE = {
  ok: { text: "#176B5B", bg: "#E8F3EF", border: "#176B5B33", bar: "#176B5B" },
  warn: { text: "#A8712B", bg: "#FAF2E4", border: "#A8712B33", bar: "#C8913F" },
  bad: { text: "#B4453A", bg: "#FBEDEB", border: "#B4453A33", bar: "#C4675C" },
} as const;

export type Tone = keyof typeof TONE;

export function toneForScore(score: number): Tone {
  if (score >= 75) return "ok";
  if (score >= 50) return "warn";
  return "bad";
}

export function toneForGrade(grade: string): Tone {
  const g = (grade || "").toUpperCase();
  if (g.startsWith("A") || g === "B+") return "ok";
  if (g.startsWith("B") || g.startsWith("C")) return "warn";
  return "bad";
}

export function toneForRecommendation(value: string): Tone {
  if (value === "Hire") return "ok";
  if (value === "Maybe") return "warn";
  return "bad";
}
