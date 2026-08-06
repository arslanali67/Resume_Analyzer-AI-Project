export interface Candidate {
  candidate_name: string;
  filename: string;
  email: string;
  phone: string;
  current_role: string;
  experience_years: number;
  location: string;
}

export interface CandidatesResponse {
  total_candidates: number;
  page: number;
  limit: number;
  total_pages: number;
  results: Candidate[];
}

export interface SearchCandidatesResponse {
  total_results: number;
  results: Candidate[];
}

export interface CandidateFilters {
  page?: number;
  limit?: number;
  location?: string;
  education?: string;
  current_role?: string;
  experience_min?: number;
  experience_max?: number;
}

export interface EvaluationRequest {
  job_description: string;
}

export interface ResumeMetadata {
  candidate_name: string;
  email: string;
  phone: string;
  skills: string[];
  education: string;
  experience_years: number;
  current_role: string;
  location: string;
  summary: string;
}

export interface ResumeEvaluation {
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  experience_summary: string;
  strengths: string[];
  weaknesses: string[];
  hiring_recommendation: string;
}

export interface EvaluateItem {
  filename: string;
  metadata: ResumeMetadata;
  evaluation: ResumeEvaluation;
}

export interface EvaluateAllResponse {
  total_candidates: number;
  results: EvaluateItem[];
}

export interface EvaluateOneResponse extends EvaluateItem {
  error?: string;
}

export interface EvaluationResult {
  filename: string;
  candidate_name: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  current_role: string;
  experience_years: number;
  match_score: number;
  recommendation: string;
  strengths: string[];
  weaknesses: string[];
  matching_skills: string[];
  missing_skills: string[];
}

export interface EvaluationResultsResponse {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  results: EvaluationResult[];
}

export interface EvaluationFilters {
  page?: number;
  limit?: number;
  match_score_min?: number;
  match_score_max?: number;
  recommendation?: string;
  location?: string;
  education?: string;
  current_role?: string;
  experience_min?: number;
  experience_max?: number;
  matching_skill?: string;
  missing_skill?: string;
}

export interface UploadResult {
  filename: string;
  status: "uploaded" | "updated" | "duplicate" | string;
}

export interface ZipUploadResponse {
  uploaded: number;
  updated: number;
  duplicates: number;
  failed: number;
  results: UploadResult[];
}
