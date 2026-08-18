import {
  Card,
  CategoryBar,
  GradeBadge,
  PrimaryButton,
  ScoreRing,
  SecondaryButton,
  SkillTag,
} from "./ui";

export default function CandidateHero() {
  return (
    <section id="top" className="bg-[#F8F8F6] pt-16 pb-20 sm:pt-20 sm:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-2 lg:gap-16">
        <div className="animate-fade-up">
          <p className="mb-5 text-[13px] font-medium uppercase tracking-widest text-[#176B5B]">
            For Job Seekers
          </p>
          <h1 className="text-[2.75rem] font-semibold leading-[1.1] tracking-tight text-[#171717] sm:text-[3.5rem]">
            See Your Resume the Way an ATS Does.
          </h1>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-[#6B6B6B]">
            Most resumes are filtered by software before a recruiter reads them.
            Upload yours with the job description and get a scored breakdown,
            your skill gaps, and a rewritten, ATS-ready version you can download.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton href="#analyzer">Check My Resume</PrimaryButton>
            <SecondaryButton href="#how-it-works">How It Works</SecondaryButton>
          </div>

          <p className="mt-6 text-[14px] text-[#6B6B6B]">
            PDF, DOCX or TXT · Your file is deleted right after analysis.
          </p>
        </div>

        <Card className="animate-fade-up overflow-hidden p-0 [animation-delay:100ms]">
          <div className="flex items-center justify-between border-b border-[#E6E6E2] px-5 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B]">
              Your ATS Report
            </p>
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#176B5B]">
              Sample
            </span>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-5">
              <ScoreRing score={82} size={112} />
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <GradeBadge grade="B+" />
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#6B6B6B]">
                      ATS Grade
                    </p>
                    <p className="text-[15px] font-semibold text-[#171717]">
                      Interview-ready
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-[#6B6B6B]">
                  Strong skills and project coverage. Add two missing keywords to
                  clear most automated filters.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <CategoryBar label="Skills" score={88} />
              <CategoryBar label="Experience" score={74} />
              <CategoryBar label="Keywords" score={61} />
            </div>

            <div className="mt-6">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[#6B6B6B]">
                Skill Coverage
              </p>
              <div className="flex flex-wrap gap-1.5">
                <SkillTag name="React" matched />
                <SkillTag name="TypeScript" matched />
                <SkillTag name="Node.js" matched />
                <SkillTag name="Docker" matched={false} />
                <SkillTag name="CI/CD" matched={false} />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
