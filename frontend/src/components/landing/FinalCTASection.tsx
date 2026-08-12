import { SectionHeading } from "./ui";

interface FinalCTASectionProps {
  onOpenDashboard: () => void;
}

export default function FinalCTASection({
  onOpenDashboard,
}: FinalCTASectionProps) {
  return (
    <section className="bg-[#0F4D42] py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <SectionHeading
          title="Stop Screening Every Resume Manually."
          subtitle="Upload your resumes, add your job requirements, and let AI help you find the strongest candidates faster."
          light
        />

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#analyzer"
            className="inline-flex items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-medium text-[#0F4D42] transition hover:bg-[#E8F3EF] hover:-translate-y-px"
          >
            Start Analyzing Resumes
          </a>
          <button
            type="button"
            onClick={onOpenDashboard}
            className="inline-flex items-center justify-center rounded-md border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 hover:-translate-y-px"
          >
            View Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}
