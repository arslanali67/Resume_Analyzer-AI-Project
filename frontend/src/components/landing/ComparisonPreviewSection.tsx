import { SectionHeading, Card, MatchScore, RecommendationBadge } from "./ui";

const candidates = [
  {
    name: "Ahmed Khan",
    role: "Senior React Developer",
    score: 94,
    experience: "5 Years",
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    strengths: "Strong full-stack background with production React experience",
    missing: "Docker",
    recommendation: "Strong Match",
    winner: true,
  },
  {
    name: "Sarah Malik",
    role: "Frontend Engineer",
    score: 87,
    experience: "4 Years",
    skills: ["React", "JavaScript", "CSS", "Git"],
    strengths: "Excellent UI/UX focus with design system experience",
    missing: "AWS, TypeScript",
    recommendation: "Good Match",
    winner: false,
  },
];

export default function ComparisonPreviewSection() {
  return (
    <section className="bg-[#F8F8F6] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          title="Compare Candidates Side by Side"
          subtitle="When multiple candidates look promising, compare their experience, skills, scores, and evaluation results in one place."
        />

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {candidates.map((c) => (
            <Card
              key={c.name}
              className={`p-5 ${c.winner ? "border-[#176B5B]/30" : ""}`}
            >
              {c.winner && (
                <span className="mb-3 inline-block rounded border border-[#176B5B]/20 bg-[#E8F3EF] px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-[#176B5B]">
                  Overall Winner
                </span>
              )}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[17px] font-semibold text-[#171717]">
                    {c.name}
                  </h3>
                  <p className="text-[14px] text-[#6B6B6B]">{c.role}</p>
                </div>
                <MatchScore score={c.score} size="lg" />
              </div>

              <dl className="mt-5 space-y-3 text-[14px]">
                <div className="flex justify-between border-b border-[#E6E6E2] pb-2">
                  <dt className="text-[#6B6B6B]">Experience</dt>
                  <dd className="font-medium text-[#171717]">{c.experience}</dd>
                </div>
                <div>
                  <dt className="text-[#6B6B6B]">Skills</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1">
                    {c.skills.map((s) => (
                      <span
                        key={s}
                        className="rounded border border-[#E6E6E2] bg-[#F8F8F6] px-2 py-0.5 text-[12px] text-[#171717]"
                      >
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="text-[#6B6B6B]">Strengths</dt>
                  <dd className="mt-1 text-[#171717]">{c.strengths}</dd>
                </div>
                <div>
                  <dt className="text-[#6B6B6B]">Missing Requirements</dt>
                  <dd className="mt-1 text-[#171717]">{c.missing}</dd>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <dt className="text-[#6B6B6B]">Recommendation</dt>
                  <dd>
                    <RecommendationBadge label={c.recommendation} />
                  </dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
