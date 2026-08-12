import axios from "axios";
import type {
  CandidateFilters,
  CandidatesResponse,
  SearchCandidatesResponse,
  EvaluationFilters,
  EvaluationResultsResponse,
  EvaluateAllResponse,
  EvaluateOneResponse,
  UploadResult,
  ZipUploadResponse,
  JobDescription,
  JobDescriptionCreate,
  JobsResponse,
  DashboardStats,
  CompareResponse,
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
});

function cleanParams(
  params: Record<string, string | number | undefined | null>
): Record<string, string | number> {
  const cleaned: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail.map((d) => d.msg || JSON.stringify(d)).join(", ");
    }
    const errMsg = error.response?.data?.error;
    if (typeof errMsg === "string") return errMsg;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}

// ── Upload ──────────────────────────────────────────────

export async function uploadResume(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<UploadResult>("/upload/", form);
  return data;
}

export async function uploadZip(file: File): Promise<ZipUploadResponse> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<ZipUploadResponse>("/upload/zip", form);
  return data;
}

// ── Job Descriptions ────────────────────────────────────

export async function getJobs(): Promise<JobsResponse> {
  const { data } = await api.get<JobsResponse>("/jobs/");
  return data;
}

export async function getJob(jobId: number): Promise<JobDescription> {
  const { data } = await api.get<JobDescription>(`/jobs/${jobId}`);
  return data;
}

export async function createJob(
  job: JobDescriptionCreate
): Promise<{ message: string; job_id: number }> {
  const { data } = await api.post<{ message: string; job_id: number }>(
    "/jobs/",
    job
  );
  return data;
}

export async function updateJob(
  jobId: number,
  job: JobDescriptionCreate
): Promise<{ message: string }> {
  const { data } = await api.put<{ message: string }>(`/jobs/${jobId}`, job);
  return data;
}

export async function deleteJob(
  jobId: number
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/jobs/${jobId}`);
  return data;
}

// ── Evaluation ──────────────────────────────────────────

export async function evaluateAll(
  jobId: number
): Promise<EvaluateAllResponse> {
  const { data } = await api.post<EvaluateAllResponse>("/evaluate/", {
    job_id: jobId,
  });
  return data;
}

export async function evaluateOne(
  filename: string,
  jobId: number
): Promise<EvaluateOneResponse> {
  const { data } = await api.post<EvaluateOneResponse>(
    `/evaluate/${encodeURIComponent(filename)}`,
    { job_id: jobId }
  );
  return data;
}

export async function getEvaluationResults(
  filters: EvaluationFilters = {}
): Promise<EvaluationResultsResponse> {
  const { data } = await api.get<EvaluationResultsResponse>(
    "/evaluate/results",
    { params: cleanParams(filters as Record<string, string | number | undefined>) }
  );
  return data;
}

// ── Candidates ──────────────────────────────────────────

export async function getCandidates(
  filters: CandidateFilters = {}
): Promise<CandidatesResponse> {
  const { data } = await api.get<CandidatesResponse>("/candidates/", {
    params: cleanParams(filters as Record<string, string | number | undefined>),
  });
  return data;
}

export async function searchCandidates(
  search: string
): Promise<SearchCandidatesResponse> {
  const { data } = await api.get<SearchCandidatesResponse>(
    "/candidates/search",
    { params: { search } }
  );
  return data;
}

export async function deleteCandidate(
  filename: string
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(
    `/candidates/${encodeURIComponent(filename)}`
  );
  return data;
}

// ── Dashboard ───────────────────────────────────────────

export async function getDashboard(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>("/dashboard/");
  return data;
}

// ── Comparison ──────────────────────────────────────────

export async function compareCandidates(
  filename1: string,
  filename2: string
): Promise<CompareResponse> {
  const { data } = await api.get<CompareResponse>("/compare/", {
    params: { filename1, filename2 },
  });
  return data;
}

// ── Reports ─────────────────────────────────────────────

export async function downloadReport(): Promise<Blob> {
  const { data } = await api.get<Blob>("/reports/evaluation", {
    responseType: "blob",
  });
  return data;
}
