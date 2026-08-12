import { PrimaryButton, SecondaryButton, MatchScore, SkillTag, ScoreBar, Card } from "./ui";

interface HeroSectionProps {
  onOpenDashboard: () => void;
}

export default function HeroSection({ onOpenDashboard }: HeroSectionProps) {
  return (
    <section className="bg-[#F8F8F6] pt-16 pb-20 sm:pt-20 sm:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 lg:grid-cols-2 lg:gap-16">
        <div className="animate-fade-up">
          <p className="mb-5 text-[13px] font-medium uppercase tracking-widest text-[#176B5B]">
            HR Screening Software
          </p>
          <h1 className="text-[2.75rem] font-semibold leading-[1.1] tracking-tight text-[#171717] sm:text-[3.5rem]">
            Screen Resumes Smarter. Hire the Right Candidates Faster.
          </h1>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-[#6B6B6B]">
            AI Resume Analyzer helps HR teams evaluate, rank, and compare
            candidates against job requirements without manually reviewing
            hundreds of resumes.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton href="#analyzer">Analyze Resumes</PrimaryButton>
            <SecondaryButton onClick={onOpenDashboard}>
              View Dashboard
            </SecondaryButton>
          </div>

          <p className="mt-6 text-[14px] text-[#6B6B6B]">
            Upload resumes. Add your job requirements. Let AI do the screening.
          </p>
        </div>

        <Card className="animate-fade-up overflow-hidden p-0 [animation-delay:100ms]">
          <div className="border-b border-[#E6E6E2] px-5 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B]">
              Candidate Evaluation
            </p>
          </div>

          <div className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[#171717]">
                  Ahmed Khan
                </h3>
                <p className="text-[14px] text-[#6B6B6B]">
                  Senior React Developer
                </p>
              </div>
              <MatchScore score={94} size="lg" />
            </div>

            <div className="mt-4">
              <ScoreBar score={94} />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-md border border-[#E6E6E2] bg-[#F8F8F6] px-3 py-2.5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#6B6B6B]">
                  Experience
                </p>
                <p className="mt-0.5 text-[15px] font-semibold text-[#171717]">
                  5 Years
                </p>
              </div>
              <div className="rounded-md border border-[#E6E6E2] bg-[#F8F8F6] px-3 py-2.5">
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#6B6B6B]">
                  Skills Match
                </p>
                <p className="mt-0.5 text-[15px] font-semibold text-[#171717]">
                  9/10
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[#6B6B6B]">
                Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                <SkillTag name="React" matched />
                <SkillTag name="TypeScript" matched />
                <SkillTag name="Node.js" matched />
                <SkillTag name="AWS" matched />
                <SkillTag name="Docker" matched={false} />
              </div>
            </div>

            <div className="mt-5 rounded-md border border-[#176B5B]/20 bg-[#E8F3EF] px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#176B5B]">
                AI Recommendation
              </p>
              <p className="mt-0.5 font-semibold text-[#0F4D42]">
                Strong Match
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
