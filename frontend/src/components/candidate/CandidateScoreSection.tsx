import type {
  CandidatePortalEvaluation,
  CandidatePortalMetadata,
} from "../../types";
import { TONE, toneForRecommendation } from "./tone";
import {
  GradeBadge,
  Panel,
  Pill,
  ScoreRing,
  Section,
  SectionHeading,
} from "./ui";

interface CandidateScoreSectionProps {
  evaluation: CandidatePortalEvaluation;
  metadata: CandidatePortalMetadata;
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[#E6E6E2] py-2 last:border-none">
      <span className="text-[13px] font-medium uppercase tracking-wide text-[#6B6B6B]">
        {label}
      </span>
      <span className="text-right text-[15px] text-[#171717]">
        {value || "—"}
      </span>
    </div>
  );
}

export default function CandidateScoreSection({
  evaluation,
  metadata,
}: CandidateScoreSectionProps) {
  const score = evaluation.match_score ?? 0;
  const recommendation = evaluation.recommendation ?? "Maybe";
  const recTone = toneForRecommendation(recommendation);

  const verdictCopy: Record<string, string> = {
    Hire: "Your resume clears the bar for this role.",
    Maybe: "You are close — a few targeted fixes should push this through.",
    Reject: "This resume is unlikely to pass screening for this role as written.",
  };

  return (
    <Section id="result-score" tint="white">
      <SectionHeading
        eyebrow="Your Report"
        title="ATS Match Score"
        subtitle="How your resume scores against the job description you provided."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        <Panel label="Overall" className="lg:col-span-2">
          <div className="flex flex-col items-center gap-7 sm:flex-row sm:items-start">
            <ScoreRing score={score} />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <GradeBadge grade={evaluation.ats_grade} />
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#6B6B6B]">
                      ATS Grade
                    </p>
                    <p className="text-[15px] font-semibold text-[#171717]">
                      {evaluation.ats_grade || "—"}
                    </p>
                  </div>
                </div>

                <div className="h-9 w-px bg-[#E6E6E2]" />

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-[#6B6B6B]">
                    Recommendation
                  </p>
                  <div className="mt-1">
                    <Pill tone={recTone}>{recommendation}</Pill>
                  </div>
                </div>
              </div>

              <p
                className="mt-5 rounded-md border px-4 py-3 text-[15px] font-medium leading-relaxed"
                style={{
                  color: TONE[recTone].text,
                  backgroundColor: TONE[recTone].bg,
                  borderColor: TONE[recTone].border,
                }}
              >
                {verdictCopy[recommendation] ?? verdictCopy.Maybe}
              </p>

              {evaluation.recommendation_reason && (
                <p className="mt-4 text-[15px] leading-relaxed text-[#6B6B6B]">
                  {evaluation.recommendation_reason}
                </p>
              )}
            </div>
          </div>

          {evaluation.experience_summary && (
            <div className="mt-6 border-t border-[#E6E6E2] pt-5">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#6B6B6B]">
                Experience Summary
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-[#171717]">
                {evaluation.experience_summary}
              </p>
            </div>
          )}
        </Panel>

        <Panel label="Parsed From Your Resume">
          <p className="mb-3 text-[14px] leading-relaxed text-[#6B6B6B]">
            This is what an automated reader extracted. Anything wrong here is
            worth fixing first — it means the parser misread your resume.
          </p>

          <MetaRow label="Name" value={metadata.candidate_name ?? ""} />
          <MetaRow label="Email" value={metadata.email ?? ""} />
          <MetaRow label="Phone" value={metadata.phone ?? ""} />
          <MetaRow label="Location" value={metadata.location ?? ""} />
          <MetaRow label="Current Role" value={metadata.current_role ?? ""} />
          <MetaRow
            label="Experience"
            value={
              metadata.experience_years !== undefined
                ? `${metadata.experience_years} yrs`
                : ""
            }
          />
          <MetaRow label="Education" value={metadata.education ?? ""} />
          {metadata.linkedin && (
            <MetaRow label="LinkedIn" value={metadata.linkedin} />
          )}
          {metadata.github && <MetaRow label="GitHub" value={metadata.github} />}
        </Panel>
      </div>
    </Section>
  );
}
