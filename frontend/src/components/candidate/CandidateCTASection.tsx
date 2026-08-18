import { SectionHeading } from "./ui";

interface CandidateCTASectionProps {
  onBackToHr: () => void;
}

export default function CandidateCTASection({
  onBackToHr,
}: CandidateCTASectionProps) {
  return (
    <section className="bg-[#0F4D42] py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <SectionHeading
          title="Stop Guessing Why You Didn't Hear Back."
          subtitle="Check your resume against the next job you apply to, fix what the report flags, and send a version built to get read."
          light
        />

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#analyzer"
            className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-medium text-[#0F4D42] transition hover:-translate-y-px hover:bg-[#E8F3EF]"
          >
            Check My Resume
          </a>
          <button
            type="button"
            onClick={onBackToHr}
            className="inline-flex items-center justify-center rounded-md border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition hover:-translate-y-px hover:bg-white/10"
          >
            I'm Hiring Instead
          </button>
        </div>
      </div>
    </section>
  );
}
