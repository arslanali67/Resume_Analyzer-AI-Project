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

export interface JobDescription {
  id: number;
  title: string;
  department: string | null;
  description: string;
  created_at: string;
}

export interface JobDescriptionCreate {
  title: string;
  department?: string;
  description: string;
}

export interface JobsResponse {
  total: number;
  results: JobDescription[];
}

export interface EvaluationRequest {
  job_id: number;
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
  job_id: number;
  total_candidates: number;
  results: EvaluateItem[];
  error?: string;
}

export interface EvaluateOneResponse extends EvaluateItem {
  job_id?: number;
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
  sort_by?: string;
  order?: string;
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

export interface CandidatePortalMetadata {
  candidate_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  education?: string;
  current_role?: string;
  experience_years?: number;
  skills?: string[];
  linkedin?: string;
  github?: string;
  summary?: string;
}

// ── ATS breakdown (app/schemas/ats_breakdown.py) ─────────

export interface ATSCategory {
  score: number;
  reason: string;
}

export type ATSCategoryKey =
  | "skills"
  | "experience"
  | "education"
  | "projects"
  | "keywords"
  | "formatting";

export type ATSBreakdown = Record<ATSCategoryKey, ATSCategory>;

export type RecommendationValue = "Hire" | "Maybe" | "Reject";

// ── Evaluation (app/schemas/evaluation_schema.py) ────────

export interface CandidatePortalEvaluation {
  match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  experience_summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendation: RecommendationValue;
  recommendation_reason: string;
  breakdown: ATSBreakdown;
  overall_feedback: string[];
  resume_strengths: string[];
  resume_improvements: string[];
  ats_grade: string;
}

// ── Rewritten resume (app/schemas/resume_rewrite_schema.py) ──

export interface RewriteSkillCategory {
  category: string;
  skills: string[];
}

export interface RewriteExperienceItem {
  company: string;
  location: string;
  role: string;
  duration: string;
  bullets: string[];
}

export interface RewriteProjectItem {
  title: string;
  technologies: string[];
  date: string;
  bullets: string[];
}

export interface RewriteEducationItem {
  degree: string;
  institute: string;
  location: string;
  duration: string;
}

export interface RewriteCertificationItem {
  name: string;
  url: string;
}

export interface RewrittenResume {
  professional_summary: { content: string };
  skills: RewriteSkillCategory[];
  experience: RewriteExperienceItem[];
  projects: RewriteProjectItem[];
  education: RewriteEducationItem[];
  certifications: RewriteCertificationItem[];
  ats_keywords_used: string[];
  improvement_suggestions: { recommendations: string[] };
}

export interface CandidatePortalPdf {
  filename: string;
  download_url: string;
}

export interface CandidatePortalResponse {
  metadata: CandidatePortalMetadata;
  evaluation: CandidatePortalEvaluation;
  rewritten_resume: RewrittenResume | null;
  /** Only present on /candidate/generate-pdf — /candidate/analyze omits it. */
  pdf?: CandidatePortalPdf;
}

export interface TopSkill {
  skill: string;
  count: number;
}

export interface TopCandidate {
  candidate_name: string;
  filename: string;
  current_role: string;
  match_score: number;
  recommendation: string;
  experience_years: number;
}

export interface DashboardStats {
  total_candidates: number;
  hire: number;
  maybe: number;
  reject: number;
  hire_percentage: number;
  maybe_percentage: number;
  reject_percentage: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  average_experience: number;
  score_distribution: Record<string, number>;
  experience_distribution: Record<string, number>;
  top_skills: TopSkill[];
  top_candidates: TopCandidate[];
}

export interface ComparisonCandidate {
  filename: string;
  candidate_name: string;
  current_role: string;
  experience_years: number;
  education: string;
  match_score: number;
  recommendation: string;
  recommendation_reason?: string;
  matching_skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface CompareResponse {
  winner: Record<string, string>;
  comparison_summary: Record<
    string,
    { wins: number; percentage: number }
  >;
  candidate_1: ComparisonCandidate;
  candidate_2: ComparisonCandidate;
}
