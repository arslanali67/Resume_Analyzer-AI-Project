import type { ATSBreakdown, ATSCategoryKey } from "../../types";
import { CategoryBar, Panel, Section, SectionHeading } from "./ui";

interface CandidateBreakdownSectionProps {
  breakdown: ATSBreakdown | undefined;
}

/** Display order and weighting, mirroring app/prompts/evaluation_prompt.py. */
const CATEGORIES: {
  key: ATSCategoryKey;
  label: string;
  weight: string;
}[] = [
  { key: "skills", label: "Skills", weight: "35%" },
  { key: "experience", label: "Experience", weight: "25%" },
  { key: "keywords", label: "Keywords", weight: "15%" },
  { key: "projects", label: "Projects", weight: "10%" },
  { key: "education", label: "Education", weight: "10%" },
  { key: "formatting", label: "Formatting", weight: "5%" },
];

export default function CandidateBreakdownSection({
  breakdown,
}: CandidateBreakdownSectionProps) {
  if (!breakdown) return null;

  const present = CATEGORIES.filter((c) => breakdown[c.key]);
  if (present.length === 0) return null;

  const weakest = [...present].sort(
    (a, b) => (breakdown[a.key]?.score ?? 0) - (breakdown[b.key]?.score ?? 0)
  )[0];

  return (
    <Section id="result-breakdown">
      <SectionHeading
        eyebrow="Category Scores"
        title="Where the Points Came From"
        subtitle="Your overall score is a weighted average of these six categories. Each one is scored independently with a written reason."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          {present.map((category, i) => {
            const data = breakdown[category.key];

            return (
              <div
                key={category.key}
                className="animate-fade-up rounded-lg border border-[#E6E6E2] bg-white p-5"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B]">
                    Weight {category.weight}
                  </span>
                </div>
                <CategoryBar
                  label={category.label}
                  score={data.score ?? 0}
                  reason={data.reason}
                />
              </div>
            );
          })}
        </div>

        <Panel label="Focus Here First">
          <p className="text-[15px] leading-relaxed text-[#6B6B6B]">
            Your lowest-scoring category is{" "}
            <span className="font-semibold text-[#171717]">
              {weakest.label}
            </span>{" "}
            at{" "}
            <span className="font-semibold text-[#171717] tabular-nums">
              {breakdown[weakest.key]?.score ?? 0}
            </span>
            , carrying {weakest.weight} of your overall score.
          </p>

          {breakdown[weakest.key]?.reason && (
            <p className="mt-4 rounded-md border border-[#E6E6E2] bg-[#F8F8F6] px-4 py-3 text-[15px] leading-relaxed text-[#171717]">
              {breakdown[weakest.key].reason}
            </p>
          )}

          <p className="mt-4 text-[14px] leading-relaxed text-[#6B6B6B]">
            Improving a heavily weighted category moves your overall score far
            more than perfecting a light one.
          </p>
        </Panel>
      </div>
    </Section>
  );
}
