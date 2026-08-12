import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  createJob,
  evaluateAll,
  getErrorMessage,
  uploadResume,
  uploadZip,
} from "../../api/client";
import type { EvaluateItem, UploadResult } from "../../types";
import { SectionHeading, PrimaryButton, MatchScore, Card } from "./ui";

interface AnalyzerFormSectionProps {
  onAnalyzed: () => void;
  onOpenDashboard: () => void;
}

interface PendingFile {
  file: File;
  status: "pending" | "uploading" | "done" | "failed";
  result?: UploadResult;
}

export default function AnalyzerFormSection({
  onAnalyzed,
  onOpenDashboard,
}: AnalyzerFormSectionProps) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<EvaluateItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const newFiles: PendingFile[] = Array.from(fileList).map((file) => ({
      file,
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }

  async function handleAnalyze() {
    if (!title.trim() || !description.trim()) {
      toast.error("Job title and description are required.");
      return;
    }
    if (files.length === 0) {
      toast.error("Please upload at least one resume.");
      return;
    }

    setAnalyzing(true);
    setResults([]);

    try {
      const job = await createJob({
        title: title.trim(),
        department: department.trim() || undefined,
        description: description.trim(),
      });

      const updatedFiles = [...files];
      for (let i = 0; i < updatedFiles.length; i++) {
        const item = updatedFiles[i];
        updatedFiles[i] = { ...item, status: "uploading" };
        setFiles([...updatedFiles]);

        try {
          const ext = item.file.name.toLowerCase();
          const result = ext.endsWith(".zip")
            ? await uploadZip(item.file).then((z) => ({
                filename: item.file.name,
                status: z.uploaded > 0 ? "uploaded" : "updated",
              }))
            : await uploadResume(item.file);

          updatedFiles[i] = { ...item, status: "done", result };
        } catch {
          updatedFiles[i] = { ...item, status: "failed" };
        }
        setFiles([...updatedFiles]);
      }

      const failed = updatedFiles.filter((f) => f.status === "failed");
      if (failed.length === updatedFiles.length) {
        toast.error("All uploads failed. Please try again.");
        return;
      }

      toast.success("Resumes uploaded. Running evaluation...");
      const data = await evaluateAll(job.job_id);

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setResults(data.results);
      onAnalyzed();
      toast.success(`Analyzed ${data.total_candidates} candidate(s).`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setAnalyzing(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-md border border-[#E6E6E2] bg-white px-3.5 py-2.5 text-[15px] text-[#171717] outline-none transition placeholder:text-[#6B6B6B]/60 focus:border-[#176B5B] focus:ring-1 focus:ring-[#176B5B]/20 disabled:opacity-60";

  return (
    <section id="analyzer" className="bg-[#0F4D42] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          title="Start Screening Candidates"
          subtitle="Upload your resumes and provide the job description. Our AI will evaluate candidates against your requirements."
          light
        />

        <Card className="mt-12 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="border-b border-[#E6E6E2] p-6 lg:border-b-0 lg:border-r lg:p-8">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#176B5B]">
                Job Information
              </p>

              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="text-[14px] font-medium text-[#171717]">
                    Job Title
                  </span>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior React Developer"
                    disabled={analyzing}
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="text-[14px] font-medium text-[#171717]">
                    Department
                  </span>
                  <input
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Engineering"
                    disabled={analyzing}
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="text-[14px] font-medium text-[#171717]">
                    Job Description
                  </span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={8}
                    placeholder="Paste the job description, responsibilities, required skills, experience, and qualifications..."
                    disabled={analyzing}
                    className={inputClass}
                  />
                </label>
              </div>
            </div>

            <div className="p-6 lg:p-8">
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#176B5B]">
                Resume Upload
              </p>

              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
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
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#176B5B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="mt-3 text-[15px] font-medium text-[#171717]">
                  Drag & drop your resumes here
                </p>
                <p className="mt-1 text-[13px] text-[#6B6B6B]">
                  PDF, DOCX or ZIP — multiple files supported
                </p>
                <button
                  type="button"
                  disabled={analyzing}
                  onClick={() => fileRef.current?.click()}
                  className="mt-4 rounded-md border border-[#E6E6E2] bg-white px-4 py-2 text-[14px] font-medium text-[#171717] transition hover:border-[#176B5B]/30 hover:bg-[#E8F3EF] disabled:opacity-60"
                >
                  Choose Files
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.docx,.zip,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip"
                  multiple
                  disabled={analyzing}
                  className="hidden"
                  onChange={(e) => {
                    addFiles(e.target.files);
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                />
              </div>

              {files.length > 0 && (
                <ul className="mt-4 max-h-36 space-y-1.5 overflow-y-auto">
                  {files.map((item, i) => (
                    <li
                      key={`${item.file.name}-${i}`}
                      className="flex items-center justify-between rounded-md border border-[#E6E6E2] bg-[#F8F8F6] px-3 py-2 text-[14px]"
                    >
                      <span className="truncate text-[#171717]">
                        {item.file.name}
                      </span>
                      <span
                        className={`ml-2 shrink-0 text-[13px] font-medium ${
                          item.status === "done"
                            ? "text-[#176B5B]"
                            : item.status === "failed"
                              ? "text-red-600"
                              : item.status === "uploading"
                                ? "text-[#6B6B6B]"
                                : "text-[#6B6B6B]/50"
                        }`}
                      >
                        {item.status === "done"
                          ? "✓"
                          : item.status === "failed"
                            ? "Failed"
                            : item.status === "uploading"
                              ? "Uploading..."
                              : "Ready"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-3 text-[13px] text-[#6B6B6B]">
                You can upload multiple resumes at once.
              </p>
            </div>
          </div>

          <div className="border-t border-[#E6E6E2] bg-[#F8F8F6] px-6 py-5 lg:px-8">
            <PrimaryButton
              onClick={() => void handleAnalyze()}
              disabled={analyzing}
              className="w-full sm:w-auto"
            >
              {analyzing ? "Analyzing Resumes..." : "Analyze Resumes"}
            </PrimaryButton>
          </div>
        </Card>

        {analyzing && (
          <div className="mt-5 rounded-md border border-white/20 bg-white/10 px-4 py-3 text-[14px] text-white/80">
            Evaluation in progress. This may take several minutes depending on
            the number of resumes.
          </div>
        )}

        {results.length > 0 && (
          <Card className="mt-6 p-5">
            <p className="text-[14px] font-medium text-[#176B5B]">
              Analysis complete — {results.length} candidate(s) evaluated
            </p>
            <div className="mt-4 divide-y divide-[#E6E6E2]">
              {results.slice(0, 5).map((r) => (
                <div
                  key={r.filename}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-[#171717]">
                      {r.metadata.candidate_name || r.filename}
                    </p>
                    <p className="text-[13px] text-[#6B6B6B]">
                      {r.metadata.current_role || "—"}
                    </p>
                  </div>
                  <MatchScore score={r.evaluation.match_score} />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={onOpenDashboard}
              className="mt-4 text-[14px] font-medium text-[#176B5B] hover:text-[#0F4D42]"
            >
              View full results in Dashboard →
            </button>
          </Card>
        )}
      </div>
    </section>
  );
}
