import { SectionHeading, Card } from "./ui";

const problems = [
  {
    title: "Too Many Resumes",
    description:
      "Hundreds of applications can make manual screening slow and repetitive.",
  },
  {
    title: "Inconsistent Screening",
    description:
      "Different reviewers may evaluate candidates differently.",
  },
  {
    title: "Missed Candidates",
    description:
      "Strong candidates can easily get overlooked when screening is done manually.",
  },
];

export default function ProblemSection() {
  return (
    <section id="benefits" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          title="Resume Screening Shouldn't Take Hours."
          subtitle="HR teams often spend hours opening resumes, comparing experience, checking skills, and deciding which candidates deserve an interview."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {problems.map((item, i) => (
            <Card
              key={item.title}
              className="animate-fade-up p-6 transition hover:border-[#176B5B]/20"
              style={{ animationDelay: `${i * 80}ms` } as React.CSSProperties}
            >
              <span className="text-[13px] font-medium tabular-nums text-[#176B5B]">
                0{i + 1}
              </span>
              <h3 className="mt-3 text-[17px] font-semibold text-[#171717]">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#6B6B6B]">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
