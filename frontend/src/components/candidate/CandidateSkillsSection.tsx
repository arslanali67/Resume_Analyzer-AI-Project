import { Panel, Section, SectionHeading, SkillTag } from "./ui";

interface CandidateSkillsSectionProps {
  matchingSkills: string[];
  missingSkills: string[];
}

export default function CandidateSkillsSection({
  matchingSkills,
  missingSkills,
}: CandidateSkillsSectionProps) {
  const matched = matchingSkills ?? [];
  const missing = missingSkills ?? [];
  const total = matched.length + missing.length;
  const coverage = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  return (
    <Section id="result-skills" tint="white">
      <SectionHeading
        eyebrow="Skill Gap"
        title="What You Match, What You're Missing"
        subtitle="Matched skills appear in both your resume and the posting. Missing skills are required by the job but absent from your resume."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        <Panel
          label="Matched"
          title={`${matched.length} skill${matched.length === 1 ? "" : "s"} found`}
        >
          {matched.length === 0 ? (
            <p className="text-[15px] text-[#6B6B6B]">
              No overlapping skills were found. Check that your resume names the
              technologies from the posting explicitly.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {matched.map((skill, i) => (
                <SkillTag key={`${skill}-${i}`} name={skill} matched />
              ))}
            </div>
          )}
        </Panel>

        <Panel
          label="Missing"
          title={`${missing.length} skill${missing.length === 1 ? "" : "s"} to add`}
        >
          {missing.length === 0 ? (
            <p className="text-[15px] text-[#6B6B6B]">
              Nothing required by this posting is missing from your resume.
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-1.5">
                {missing.map((skill, i) => (
                  <SkillTag key={`${skill}-${i}`} name={skill} matched={false} />
                ))}
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-[#6B6B6B]">
                Only add what you genuinely have. If you know one of these but
                never wrote it down, that is the fastest score you will gain.
              </p>
            </>
          )}
        </Panel>

        <Panel label="Coverage" title={`${coverage}% of required skills`}>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E6E6E2]">
            <div
              className="animate-score-fill h-full rounded-full bg-[#176B5B]"
              style={{ width: `${coverage}%` }}
            />
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[15px] text-[#6B6B6B]">Matched</span>
              <span className="text-[15px] font-semibold tabular-nums text-[#176B5B]">
                {matched.length}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[15px] text-[#6B6B6B]">Missing</span>
              <span className="text-[15px] font-semibold tabular-nums text-[#171717]">
                {missing.length}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-t border-[#E6E6E2] pt-3">
              <span className="text-[15px] text-[#6B6B6B]">Total assessed</span>
              <span className="text-[15px] font-semibold tabular-nums text-[#171717]">
                {total}
              </span>
            </div>
          </div>
        </Panel>
      </div>
    </Section>
  );
}
