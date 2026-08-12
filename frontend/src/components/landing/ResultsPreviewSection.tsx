import { SectionHeading, Card, MatchScore, RecommendationBadge } from "./ui";

const previewResults = [
  {
    name: "Ahmed Khan",
    role: "Senior React Developer",
    match: 94,
    experience: "5 Years",
    skills: "9/10",
    recommendation: "Strong Match",
  },
  {
    name: "Sarah Malik",
    role: "Frontend Engineer",
    match: 87,
    experience: "4 Years",
    skills: "8/10",
    recommendation: "Good Match",
  },
  {
    name: "Muhammad Hamza",
    role: "Full Stack Developer",
    match: 82,
    experience: "3 Years",
    skills: "7/10",
    recommendation: "Good Match",
  },
  {
    name: "Ali Raza",
    role: "Junior Developer",
    match: 51,
    experience: "1 Year",
    skills: "4/10",
    recommendation: "Weak Match",
  },
];

export default function ResultsPreviewSection() {
  return (
    <section className="bg-[#F8F8F6] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading title="See Which Candidates Match the Job" />

        <Card className="mt-12 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[#E6E6E2] bg-[#F8F8F6] text-left text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B]">
                  <th className="px-5 py-3.5">Candidate</th>
                  <th className="px-5 py-3.5">Match</th>
                  <th className="px-5 py-3.5">Experience</th>
                  <th className="px-5 py-3.5">Skills</th>
                  <th className="px-5 py-3.5">Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {previewResults.map((row, i) => (
                  <tr
                    key={row.name}
                    className={`animate-fade-up border-b border-[#E6E6E2] last:border-0 ${
                      i % 2 === 0 ? "bg-white" : "bg-[#F8F8F6]/50"
                    }`}
                    style={{ animationDelay: `${i * 80}ms` } as React.CSSProperties}
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#171717]">{row.name}</p>
                      <p className="text-[13px] text-[#6B6B6B]">{row.role}</p>
                    </td>
                    <td className="px-5 py-4">
                      <MatchScore score={row.match} />
                    </td>
                    <td className="px-5 py-4 text-[15px] text-[#6B6B6B]">
                      {row.experience}
                    </td>
                    <td className="px-5 py-4 text-[15px] text-[#6B6B6B]">
                      {row.skills}
                    </td>
                    <td className="px-5 py-4">
                      <RecommendationBadge label={row.recommendation} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
}
