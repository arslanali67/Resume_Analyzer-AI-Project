import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { getErrorMessage, uploadResume, uploadZip } from "../api/client";
import type { UploadResult } from "../types";

interface UploadSectionProps {
  onUploaded: () => void;
}

function statusBadgeClass(status: string): string {
  switch (status) {
    case "uploaded":
      return "bg-emerald-100 text-emerald-800";
    case "updated":
      return "bg-amber-100 text-amber-800";
    case "duplicate":
      return "bg-slate-100 text-slate-700";
    case "failed":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-indigo-100 text-indigo-800";
  }
}

export default function UploadSection({ onUploaded }: UploadSectionProps) {
  const [uploading, setUploading] = useState(false);
  const [zipUploading, setZipUploading] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const newResults: UploadResult[] = [];

    try {
      for (const file of Array.from(files)) {
        const result = await uploadResume(file);
        newResults.push(result);
        toast.success(`${result.filename}: ${result.status}`);
      }
      setResults((prev) => [...newResults, ...prev]);
      onUploaded();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleZip(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.name.toLowerCase().endsWith(".zip")) {
      toast.error("Please upload a ZIP file.");
      return;
    }

    setZipUploading(true);
    try {
      const data = await uploadZip(file);
      setResults((prev) => [...data.results, ...prev]);
      toast.success(
        `ZIP done — uploaded: ${data.uploaded}, updated: ${data.updated}, duplicates: ${data.duplicates}, failed: ${data.failed}`
      );
      onUploaded();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setZipUploading(false);
      if (zipRef.current) zipRef.current.value = "";
    }
  }

  return (
    <section id="upload" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Upload Resumes</h2>
      <p className="mt-1 text-sm text-slate-500">
        Upload PDF/DOCX files individually, or a ZIP containing multiple resumes.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50">
          <span className="text-sm font-medium text-slate-800">
            {uploading ? "Uploading..." : "Select PDF / DOCX files"}
          </span>
          <span className="mt-1 text-xs text-slate-500">Multiple files supported</span>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            multiple
            disabled={uploading || zipUploading}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50">
          <span className="text-sm font-medium text-slate-800">
            {zipUploading ? "Uploading ZIP..." : "Select ZIP folder"}
          </span>
          <span className="mt-1 text-xs text-slate-500">Bulk upload resumes</span>
          <input
            ref={zipRef}
            type="file"
            accept=".zip,application/zip"
            disabled={uploading || zipUploading}
            className="hidden"
            onChange={(e) => handleZip(e.target.files)}
          />
        </label>
      </div>

      {results.length > 0 && (
        <div className="mt-5">
          <h3 className="text-sm font-medium text-slate-700">Recent uploads</h3>
          <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto">
            {results.map((item, index) => (
              <li
                key={`${item.filename}-${index}`}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
              >
                <span className="truncate text-slate-800">{item.filename}</span>
                <span
                  className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadgeClass(item.status)}`}
                >
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
