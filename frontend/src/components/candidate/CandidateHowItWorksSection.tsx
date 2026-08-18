import { Section, SectionHeading } from "./ui";

const steps = [
  {
    step: "01",
    title: "Upload Your Resume",
    description:
      "Drop in a PDF, DOCX or TXT file. The text is extracted and cleaned before anything else happens.",
  },
  {
    step: "02",
    title: "Paste the Job Description",
    description:
      "Use the real posting you are applying to. Scoring is relative to that specific role, not a generic template.",
  },
  {
    step: "03",
    title: "Read Your Report",
    description:
      "Get your score, grade, six-category breakdown, skill gaps, and five prioritised fixes — all on one page.",
  },
  {
    step: "04",
    title: "Download the Rewrite",
    description:
      "Generate an ATS-friendly PDF built from your own facts, reworded and restructured to parse cleanly.",
  },
];

export default function CandidateHowItWorksSection() {
  return (
    <Section id="how-it-works">
      <SectionHeading
        eyebrow="How It Works"
        title="Four Steps, About Two Minutes"
      />

      <div className="mt-14 grid gap-10 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {steps.map((item, i) => (
          <div
            key={item.step}
            className="animate-fade-up relative"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {i < steps.length - 1 && (
              <div className="absolute top-5 hidden h-px w-full bg-[#E6E6E2] lg:left-[calc(50%+20px)] lg:block lg:w-[calc(100%-40px)]" />
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
    </Section>
  );
}
