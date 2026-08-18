import type { CandidatePortalPdf } from "../../types";
import { getCandidateDownloadUrl } from "../../api/client";
import { Panel, PrimaryButton, SecondaryButton, Section, SectionHeading } from "./ui";

interface CandidatePdfSectionProps {
  pdf: CandidatePortalPdf | undefined;
  generating: boolean;
  onGenerate: () => void;
}

const checklist = [
  "Single-column layout that parsers read top to bottom",
  "Standard section headings — Summary, Experience, Projects, Skills",
  "No tables, images, icons or text boxes",
  "Selectable text, embedded fonts, A4 page size",
];

export default function CandidatePdfSection({
  pdf,
  generating,
  onGenerate,
}: CandidatePdfSectionProps) {
  const href = pdf
    ? pdf.download_url?.startsWith("http")
      ? pdf.download_url
      : getCandidateDownloadUrl(pdf.filename)
    : "";

  return (
    <Section id="result-pdf">
      <SectionHeading
        eyebrow="Download"
        title="Take the Rewrite With You"
        subtitle="Generate a clean, ATS-parsable PDF built from the rewritten resume above."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <Panel label="Your File" title="ATS-friendly resume PDF">
          {pdf ? (
            <>
              <div className="flex items-center gap-3 rounded-md border border-[#176B5B]/20 bg-[#E8F3EF] px-4 py-3.5">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#176B5B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-medium text-[#0F4D42]">
                    {pdf.filename}
                  </p>
                  <p className="text-[13px] text-[#176B5B]">Ready to download</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <SecondaryButton href={href} download={pdf.filename}>
                  Download PDF
                </SecondaryButton>
                <SecondaryButton onClick={onGenerate} disabled={generating}>
                  {generating ? "Regenerating..." : "Regenerate"}
                </SecondaryButton>
              </div>
            </>
          ) : (
            <>
              <p className="text-[15px] leading-relaxed text-[#6B6B6B]">
                Your analysis is complete. Generate the PDF to get a formatted,
                downloadable version of the rewritten resume.
              </p>

              <div className="mt-5">
                <PrimaryButton onClick={onGenerate} disabled={generating}>
                  {generating ? "Generating PDF..." : "Generate My Resume PDF"}
                </PrimaryButton>
              </div>

              <p className="mt-3 text-[13px] leading-relaxed text-[#6B6B6B]">
                This re-runs the full analysis to build the document, so it takes
                about as long as the first pass.
              </p>
            </>
          )}
        </Panel>

        <Panel label="Why This Format" title="Built to survive parsing">
          <ul className="space-y-2.5">
            {checklist.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  className="mt-0.5 shrink-0 text-[#176B5B]"
                  aria-hidden="true"
                >
                  ✓
                </span>
                <span className="text-[15px] leading-relaxed text-[#171717]">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-[14px] leading-relaxed text-[#6B6B6B]">
            Review the content before you send it. The rewrite only edits what
            your resume already said, but you are the final check on accuracy.
          </p>
        </Panel>
      </div>
    </Section>
  );
}
