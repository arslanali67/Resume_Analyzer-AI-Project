import { SectionHeading, PrimaryButton, Card, MatchScore } from "./ui";

interface DashboardPreviewSectionProps {
  onOpenDashboard: () => void;
}

const dashboardFeatures = [
  "Evaluation statistics",
  "Candidate database",
  "Saved jobs",
  "Evaluation results",
  "Candidate comparison",
  "Reports",
];

const topCandidates = [
  { name: "Ahmed Khan", role: "Senior React Developer", score: 94 },
  { name: "Sarah Malik", role: "Frontend Engineer", score: 87 },
  { name: "Muhammad Hamza", role: "Full Stack Developer", score: 82 },
];

export default function DashboardPreviewSection({
  onOpenDashboard,
}: DashboardPreviewSectionProps) {
  return (
    <section id="dashboard-preview" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading
              title="Everything in One HR Dashboard"
              subtitle="Manage your entire hiring pipeline from a single dashboard built for HR teams."
              align="left"
            />

            <ul className="mt-8 space-y-2.5">
              {dashboardFeatures.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-[15px] text-[#6B6B6B]"
                >
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-[#176B5B]/30 bg-[#E8F3EF] text-[10px] font-bold text-[#176B5B]">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <PrimaryButton onClick={onOpenDashboard} className="mt-8">
              Open Dashboard
            </PrimaryButton>
          </div>

          <Card className="overflow-hidden">
            <div className="border-b border-[#E6E6E2] px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B]">
                Dashboard Overview
              </p>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Candidates", value: "48" },
                  { label: "Avg Score", value: "78" },
                  { label: "Hire", value: "12" },
                  { label: "Maybe", value: "18" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-md border border-[#E6E6E2] bg-[#F8F8F6] px-3 py-2.5"
                  >
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#6B6B6B]">
                      {stat.label}
                    </p>
                    <p className="mt-0.5 text-xl font-semibold tabular-nums text-[#171717]">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mb-2 mt-5 text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B]">
                Top Candidates
              </p>
              <div className="divide-y divide-[#E6E6E2] rounded-md border border-[#E6E6E2]">
                {topCandidates.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between px-3 py-2.5"
                  >
                    <div>
                      <p className="text-[14px] font-medium text-[#171717]">
                        {c.name}
                      </p>
                      <p className="text-[12px] text-[#6B6B6B]">{c.role}</p>
                    </div>
                    <MatchScore score={c.score} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
