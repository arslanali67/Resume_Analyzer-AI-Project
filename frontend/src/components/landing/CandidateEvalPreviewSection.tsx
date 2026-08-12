import { SectionHeading, Card, MatchScore, SkillTag, ScoreBar } from "./ui";

export default function CandidateEvalPreviewSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading title="Understand More Than Just a Score" />

        <Card className="mx-auto mt-12 max-w-xl overflow-hidden">
          <div className="border-b border-[#E6E6E2] px-5 py-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B]">
                  Candidate Evaluation
                </p>
                <h3 className="mt-1 text-xl font-semibold text-[#171717]">
                  Ahmed Khan
                </h3>
                <p className="text-[14px] text-[#6B6B6B]">
                  Senior React Developer
                </p>
              </div>
              <MatchScore score={94} size="lg" />
            </div>
            <div className="mt-3">
              <ScoreBar score={94} />
            </div>
          </div>

          <div className="space-y-5 p-5">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B]">
                Skills Match
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <SkillTag name="React" matched />
                <SkillTag name="JavaScript" matched />
                <SkillTag name="TypeScript" matched />
                <SkillTag name="Node.js" matched />
                <SkillTag name="AWS" matched />
              </div>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B]">
                Experience
              </p>
              <p className="mt-1 text-[15px] text-[#171717]">
                5 years relevant experience
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B]">
                Strengths
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-[#6B6B6B]">
                Strong frontend experience with React and TypeScript. Led
                component library migration across two product teams.
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B]">
                Missing Requirements
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-[#6B6B6B]">
                Limited experience with Docker and container orchestration.
              </p>
            </div>

            <div className="rounded-md border border-[#176B5B]/20 bg-[#E8F3EF] px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#176B5B]">
                AI Recommendation
              </p>
              <p className="mt-0.5 font-semibold text-[#0F4D42]">
                Strong Match
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
