import { Card, Section, SectionHeading } from "./ui";

const problems = [
  {
    title: "Filtered Before Anyone Reads It",
    description:
      "Applicant tracking systems rank resumes on keywords and structure. A strong candidate can be screened out by formatting alone.",
  },
  {
    title: "The Same Resume for Every Role",
    description:
      "One generic resume rarely matches a specific job description. The wording that fits one posting can miss the next entirely.",
  },
  {
    title: "No Feedback, Ever",
    description:
      "Rejections almost never explain what was missing, so the same gaps get repeated across dozens of applications.",
  },
];

export default function CandidateProblemSection() {
  return (
    <Section id="why" tint="white">
      <SectionHeading
        title="You Rarely Find Out Why You Were Rejected."
        subtitle="Applications disappear into a system that scores structure and keywords long before a person looks at your experience. This tells you what that system sees."
      />

      <div className="mt-14 grid gap-5 sm:grid-cols-3">
        {problems.map((item, i) => (
          <Card
            key={item.title}
            className="animate-fade-up p-6 transition hover:border-[#176B5B]/20"
            style={{ animationDelay: `${i * 80}ms` }}
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
    </Section>
  );
}
