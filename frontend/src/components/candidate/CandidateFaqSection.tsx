import { Card, Section, SectionHeading } from "./ui";

const faqs = [
  {
    question: "What actually happens to my resume?",
    answer:
      "It is saved to a temporary file, read, analysed, and then deleted as soon as the request finishes. It is never indexed into the recruiter-facing candidate database.",
  },
  {
    question: "Why does my score change between job descriptions?",
    answer:
      "Scoring is always relative to the posting you paste in. The same resume can score well for one role and poorly for another — that is the point of checking each application.",
  },
  {
    question: "Does the rewrite invent experience for me?",
    answer:
      "No. The rewriter is instructed to edit only what your resume already contains — improving wording, structure and keyword coverage. It cannot add jobs, dates or skills you did not list.",
  },
  {
    question: "What file types can I upload?",
    answer:
      "PDF, DOCX and TXT. PDFs are read with a text extractor, so a scanned image of a resume will not work — use the original document.",
  },
  {
    question: "Is a high score a guarantee?",
    answer:
      "No. It means your resume aligns well with that posting and should pass automated screening. Interviews still depend on the human reading it afterwards.",
  },
  {
    question: "Can I run the same resume more than once?",
    answer:
      "Yes. Adjust your resume, paste the same job description, and run it again to see whether your changes moved the score.",
  },
];

export default function CandidateFaqSection() {
  return (
    <Section id="faq" tint="white">
      <SectionHeading
        eyebrow="FAQ"
        title="Questions People Ask"
      />

      <div className="mt-14 grid gap-4 lg:grid-cols-2">
        {faqs.map((faq, i) => (
          <Card
            key={faq.question}
            className="animate-fade-up p-6"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <h3 className="text-[16px] font-semibold text-[#171717]">
              {faq.question}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-[#6B6B6B]">
              {faq.answer}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
