import { useState } from "react";
import toast from "react-hot-toast";
import {
  analyzeCandidateResume,
  generateCandidateResumePdf,
  getCandidateDownloadUrl,
} from "../api/client";
import type { CandidatePortalResponse } from "../types";

function summarizeValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined || value === "") return "N/A";
  return String(value);
}

function renderObjectSection(title: string, data: Record<string, unknown>) {
  const entries = Object.entries(data).filter(([, value]) => value !== undefined);

  if (!entries.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="mb-3 text-sm font-semibold text-slate-800">{title}</h4>
      <div className="space-y-2 text-sm text-slate-700">
        {entries.map(([key, value]) => (
          <div key={key} className="flex flex-col gap-1 border-b border-slate-200 pb-2 last:border-none last:pb-0">
            <span className="font-medium capitalize text-slate-600">{key.replace(/_/g, " ")}</span>
            <span>{summarizeValue(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CandidatePortalSection() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [result, setResult] = useState<CandidatePortalResponse | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      toast.error("Please select a resume file.");
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Please enter a job description.");
      return;
    }

    setLoading(true);
    try {
      const response = await analyzeCandidateResume(file, jobDescription);
      setResult(response);
      toast.success("Resume analyzed successfully.");
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Failed to analyze resume.");
    } finally {
      setLoading(false);
    }
  };

  const metadata = result?.metadata ?? {};
  const evaluation = result?.evaluation ?? {};
  const rewrittenResume = result?.rewritten_resume;
  const pdf = result?.pdf ?? { filename: "", download_url: "" };

  const handleGeneratePdf = async () => {
    if (!file) {
      toast.error("Please select a resume file before generating the updated resume PDF.");
      return;
    }

    if (!jobDescription.trim()) {
      toast.error("Please enter a job description before generating the updated resume PDF.");
      return;
    }

    setPdfLoading(true);
    try {
      const response = await generateCandidateResumePdf(file, jobDescription);
      setResult(response);
      toast.success("Updated resume PDF generated successfully.");
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Failed to generate updated resume PDF.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <section
      id="candidate-portal"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Candidate Resume Portal</h2>
          <p className="mt-1 text-sm text-slate-500">
            Upload a candidate resume and compare it against a job description.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Resume file</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700"
            />
          </label>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm text-slate-600">
            <p className="font-medium text-slate-700">Supported</p>
            <p className="mt-1">PDF, DOC, DOCX, and text resume files.</p>
          </div>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700">Job description</span>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            placeholder="Paste the full job description here..."
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>

          {result && (
            <button
              type="button"
              onClick={() => void handleGeneratePdf()}
              disabled={pdfLoading || loading}
              className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {pdfLoading ? "Generating PDF..." : "Generate Updated Resume"}
            </button>
          )}
        </div>
      </form>

      {result && (
        <div className="mt-8 space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {renderObjectSection("Candidate metadata", metadata as Record<string, unknown>)}
            {renderObjectSection("ATS evaluation", evaluation as Record<string, unknown>)}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="mb-3 text-sm font-semibold text-slate-800">Rewritten resume</h4>
            {typeof rewrittenResume === "string" ? (
              <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{rewrittenResume}</pre>
            ) : rewrittenResume && typeof rewrittenResume === "object" ? (
              <div className="space-y-3 text-sm text-slate-700">
                {Object.entries(rewrittenResume as Record<string, unknown>).map(([key, value]) => (
                  <div key={key} className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="mb-2 font-medium capitalize text-slate-700">{key.replace(/_/g, " ")}</p>
                    {Array.isArray(value) ? (
                      <ul className="list-disc space-y-1 pl-5">
                        {(value as unknown[]).map((item, index) => (
                          <li key={`${key}-${index}`}>{String(item)}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="whitespace-pre-wrap">{String(value)}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No rewritten resume returned.</p>
            )}
          </div>

          {pdf?.filename && (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div>
                <p className="text-sm font-medium text-emerald-800">Generated PDF ready</p>
                <p className="text-xs text-emerald-700">{pdf.filename}</p>
              </div>
              <a
                href={getCandidateDownloadUrl(pdf.filename || "")}
                download={pdf.filename || undefined}
                className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Download PDF
              </a>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
