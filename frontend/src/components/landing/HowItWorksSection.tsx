import { SectionHeading } from "./ui";

const steps = [
  {
    step: "01",
    title: "Upload Resumes",
    description:
      "Upload individual PDF/DOCX resumes or bulk upload resumes using a ZIP file.",
  },
  {
    step: "02",
    title: "Add the Job",
    description:
      "Create a job description with the role, department, requirements, and responsibilities.",
  },
  {
    step: "03",
    title: "Evaluate & Rank",
    description:
      "Run the AI evaluation and instantly review candidate scores, strengths, weaknesses, and rankings.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading title="From Resumes to Shortlist in Three Steps" />

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((item, i) => (
            <div
              key={item.step}
              className="animate-fade-up relative"
              style={{ animationDelay: `${i * 100}ms` } as React.CSSProperties}
            >
              {i < steps.length - 1 && (
                <div className="absolute top-5 hidden h-px w-full bg-[#E6E6E2] md:left-[calc(50%+20px)] md:block md:w-[calc(100%-40px)]" />
              )}
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#E6E6E2] bg-[#F8F8F6] text-[13px] font-semibold tabular-nums text-[#176B5B]">
                {item.step}
              </div>
              <h3 className="mt-5 text-[17px] font-semibold text-[#171717]">
                {item.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[#6B6B6B]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
