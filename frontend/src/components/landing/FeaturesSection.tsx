import { SectionHeading, Card } from "./ui";

const features = [
  {
    title: "AI Resume Analysis",
    description: "Analyze resumes against specific job requirements.",
  },
  {
    title: "Candidate Ranking",
    description: "Automatically rank candidates based on their evaluation score.",
  },
  {
    title: "Job Descriptions",
    description: "Create and save job descriptions for different positions.",
  },
  {
    title: "Candidate Comparison",
    description: "Compare two evaluated candidates side by side.",
  },
  {
    title: "Smart Evaluation",
    description:
      "Review skills, experience, location, and other relevant candidate information.",
  },
  {
    title: "Reports",
    description:
      "Download evaluation results as an Excel report for further analysis.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-[#F8F8F6] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading title="Everything You Need for Faster Resume Screening" />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Card
              key={feature.title}
              className="animate-fade-up p-5 transition hover:border-[#176B5B]/20"
              style={{ animationDelay: `${i * 60}ms` } as React.CSSProperties}
            >
              <div className="mb-3 h-px w-8 bg-[#176B5B]" />
              <h3 className="text-[16px] font-semibold text-[#171717]">
                {feature.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#6B6B6B]">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
