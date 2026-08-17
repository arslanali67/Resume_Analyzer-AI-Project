import { Card, Section, SectionHeading } from "./ui";

/**
 * Every capability the candidate portal actually returns, listed separately.
 * Each entry maps to a real field on the /candidate/analyze response.
 */
const features = [
  {
    group: "Scoring",
    title: "ATS Match Score",
    description:
      "A weighted 0–100 score for how well your resume matches the job description — skills 35%, experience 25%, keywords 15%, projects 10%, education 10%, formatting 5%.",
  },
  {
    group: "Scoring",
    title: "ATS Grade",
    description:
      "The same result expressed as a letter grade from A+ down to F, so you can tell at a glance whether the resume is ready to send.",
  },
  {
    group: "Scoring",
    title: "Six-Category Breakdown",
    description:
      "Separate scores for Skills, Experience, Education, Projects, Keywords and Formatting — each with a written reason explaining the number.",
  },
  {
    group: "Analysis",
    title: "Skill Gap Analysis",
    description:
      "Skills found in both your resume and the posting, listed beside the required skills you are missing, so you know exactly what to add.",
  },
  {
    group: "Analysis",
    title: "Strengths & Weaknesses",
    description:
      "What makes you competitive for this specific role, and where your profile falls short of what the job description asks for.",
  },
  {
    group: "Analysis",
    title: "Hiring Recommendation",
    description:
      "The verdict a recruiter would reach — Hire, Maybe or Reject — with a short written justification and a summary of your relevant experience.",
  },
  {
    group: "Improvement",
    title: "Five Actionable Fixes",
    description:
      "Exactly five prioritised, concrete changes that would raise your score most — not vague advice like “tailor your resume”.",
  },
  {
    group: "Improvement",
    title: "Resume Quality Review",
    description:
      "A critique of the document itself: structure, keyword usage, quantified achievements and ATS-safe formatting, plus specific improvements.",
  },
  {
    group: "Rewrite",
    title: "AI Resume Rewrite",
    description:
      "Your resume rebuilt section by section — summary, experience, projects, skills, education, certifications — reworded for ATS parsing without inventing anything.",
  },
  {
    group: "Rewrite",
    title: "ATS Keywords Applied",
    description:
      "The exact keywords from the job description that were woven into the rewritten resume, so you can verify the coverage yourself.",
  },
  {
    group: "Rewrite",
    title: "Downloadable PDF",
    description:
      "A clean, single-column, ATS-parsable PDF built from the rewrite — no tables, images or text boxes that break automated readers.",
  },
  {
    group: "Privacy",
    title: "Nothing Kept",
    description:
      "Your upload is written to a temporary file, processed, and deleted as soon as the analysis finishes. It is never added to the recruiter database.",
  },
];

const groupOrder = ["Scoring", "Analysis", "Improvement", "Rewrite", "Privacy"];

export default function CandidateFeaturesSection() {
  return (
    <Section id="features" tint="white">
      <SectionHeading
        eyebrow="What You Get"
        title="A Complete Report, Not Just a Number"
        subtitle="Every section below is produced from your resume and the job description you paste in."
      />

      <div className="mt-14 space-y-10">
        {groupOrder.map((group) => {
          const items = features.filter((f) => f.group === group);

          return (
            <div key={group}>
              <div className="mb-5 flex items-center gap-3">
                <h3 className="text-[13px] font-medium uppercase tracking-widest text-[#176B5B]">
                  {group}
                </h3>
                <div className="h-px flex-1 bg-[#E6E6E2]" />
                <span className="text-[13px] tabular-nums text-[#6B6B6B]">
                  {items.length}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((feature, i) => (
                  <Card
                    key={feature.title}
                    className="animate-fade-up p-5 transition hover:border-[#176B5B]/20"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="mb-3 h-px w-8 bg-[#176B5B]" />
                    <h4 className="text-[16px] font-semibold text-[#171717]">
                      {feature.title}
                    </h4>
                    <p className="mt-2 text-[15px] leading-relaxed text-[#6B6B6B]">
                      {feature.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
