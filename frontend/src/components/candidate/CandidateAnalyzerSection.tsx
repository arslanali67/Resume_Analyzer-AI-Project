import { useRef, useState } from "react";
import type { DragEvent } from "react";
import { Card, PrimaryButton, SectionHeading } from "./ui";

/** Extensions the backend accepts (app/api/candidate_portal.py). */
const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt"] as const;

function hasAcceptedExtension(name: string): boolean {
  const lower = name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

interface CandidateAnalyzerSectionProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  analyzing: boolean;
  onAnalyze: () => void;
}

export default function CandidateAnalyzerSection({
  file,
  onFileChange,
  jobDescription,
  onJobDescriptionChange,
  analyzing,
  onAnalyze,
}: CandidateAnalyzerSectionProps) {
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function acceptFile(next: File | null) {
    if (!next) {
      onFileChange(null);
      setFileError("");
      return;
    }

    if (!hasAcceptedExtension(next.name)) {
      setFileError("Only PDF, DOCX and TXT files are supported.");
      onFileChange(null);
      return;
    }

    setFileError("");
    onFileChange(next);
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (analyzing) return;
    acceptFile(e.dataTransfer.files?.[0] ?? null);
  }

  const inputClass =
    "mt-1.5 w-full rounded-md border border-[#E6E6E2] bg-white px-3.5 py-2.5 text-[15px] text-[#171717] outline-none transition placeholder:text-[#6B6B6B]/60 focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]/20 disabled:opacity-60";

  const ready = Boolean(file) && jobDescription.trim().length > 0;

  return (
    <section id="analyzer" className="bg-[#0F4D42] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Free Check"
          title="Check Your Resume Against a Job"
          subtitle="Upload your resume and paste the job description you are applying to. You will get a full ATS report and a rewritten version."
          light
        />

        <Card className="mt-12 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Resume upload */}
            <div className="border-b border-[#E6E6E2] p-6 lg:border-b-0 lg:border-r lg:p-8">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#176B5B]">
                Step 1 — Your Resume
              </p>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!analyzing) setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`mt-5 flex flex-col items-center justify-center rounded-md border border-dashed px-6 py-12 text-center transition ${
                  dragOver
                    ? "border-[#176B5B] bg-[#E8F3EF]"
                    : "border-[#E6E6E2] bg-[#F8F8F6] hover:border-[#176B5B]/40"
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#E6E6E2] bg-white">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#176B5B"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>

                <p className="mt-3 text-[15px] font-medium text-[#171717]">
                  Drag &amp; drop your resume here
                </p>
                <p className="mt-1 text-[13px] text-[#6B6B6B]">
                  PDF, DOCX or TXT — one file
                </p>

                <button
                  type="button"
                  disabled={analyzing}
                  onClick={() => fileRef.current?.click()}
                  className="mt-4 rounded-md border border-[#E6E6E2] bg-white px-4 py-2 text-[14px] font-medium text-[#171717] transition hover:border-[#176B5B]/30 hover:bg-[#E8F3EF] disabled:opacity-60"
                >
                  Choose File
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  disabled={analyzing}
                  className="hidden"
                  onChange={(e) => {
                    acceptFile(e.target.files?.[0] ?? null);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                />
              </div>

              {fileError && (
                <p className="mt-3 text-[14px] font-medium text-[#B4453A]">
                  {fileError}
                </p>
              )}

              {file && (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-md border border-[#E6E6E2] bg-[#F8F8F6] px-3.5 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-medium text-[#171717]">
                      {file.name}
                    </p>
                    <p className="text-[13px] text-[#6B6B6B]">
                      {(file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={analyzing}
                    onClick={() => acceptFile(null)}
                    className="shrink-0 text-[13px] font-medium text-[#6B6B6B] transition hover:text-[#B4453A] disabled:opacity-60"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Job description */}
            <div className="p-6 lg:p-8">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#176B5B]">
                Step 2 — The Job
              </p>

              <label className="mt-5 block">
                <span className="text-[14px] font-medium text-[#171717]">
                  Job Description
                </span>
                <textarea
                  value={jobDescription}
                  onChange={(e) => onJobDescriptionChange(e.target.value)}
                  rows={12}
                  disabled={analyzing}
                  placeholder="Paste the full posting — responsibilities, required skills, experience and qualifications. The more complete it is, the more accurate your score."
                  className={inputClass}
                />
              </label>

              <p className="mt-2 text-[13px] text-[#6B6B6B]">
                {jobDescription.trim().length} characters
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-[#E6E6E2] bg-[#F8F8F6] px-6 py-5 lg:px-8">
            <PrimaryButton
              onClick={onAnalyze}
              disabled={analyzing || !ready}
              className="w-full sm:w-auto"
            >
              {analyzing ? "Analyzing your resume..." : "Analyze My Resume"}
            </PrimaryButton>

            {!ready && !analyzing && (
              <p className="text-[14px] text-[#6B6B6B]">
                Add your resume and the job description to continue.
              </p>
            )}
          </div>
        </Card>

        {analyzing && (
          <div className="mt-5 rounded-md border border-white/20 bg-white/10 px-4 py-3.5 text-[14px] text-white/80">
            Reading your resume, scoring it against the job description, and
            preparing the rewrite. This usually takes 30–60 seconds.
          </div>
        )}
      </div>
    </section>
  );
}
