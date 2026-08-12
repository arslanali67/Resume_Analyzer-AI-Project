import Layout from "./Layout";
import DashboardSection from "./DashboardSection";
import UploadSection from "./UploadSection";
import JobsSection from "./JobsSection";
import EvaluateSection from "./EvaluateSection";
import CandidatesSection from "./CandidatesSection";
import ResultsSection from "./ResultsSection";
import CompareSection from "./CompareSection";
import ReportsSection from "./ReportsSection";
import CandidatePortalSection from "./CandidatePortalSection";

interface DashboardPageProps {
  refreshKeys: {
    candidates: number;
    results: number;
    jobs: number;
    dashboard: number;
  };
  onBackHome: () => void;
  bumpCandidates: () => void;
  bumpResults: () => void;
  bumpJobs: () => void;
}

export default function DashboardPage({
  refreshKeys,
  onBackHome,
  bumpCandidates,
  bumpResults,
  bumpJobs,
}: DashboardPageProps) {
  return (
    <Layout onBackHome={onBackHome}>
      <DashboardSection refreshKey={refreshKeys.dashboard} />
      <UploadSection onUploaded={bumpCandidates} />
      <JobsSection refreshKey={refreshKeys.jobs} onJobsChanged={bumpJobs} />
      <EvaluateSection
        refreshKey={refreshKeys.candidates}
        jobsRefreshKey={refreshKeys.jobs}
        onEvaluated={() => {
          bumpResults();
          bumpCandidates();
        }}
      />
      <CandidatePortalSection />
      <CandidatesSection
        refreshKey={refreshKeys.candidates}
        onDeleted={() => {
          bumpCandidates();
          bumpResults();
        }}
      />
      <ResultsSection refreshKey={refreshKeys.results} />
      <CompareSection refreshKey={refreshKeys.results} />
      <ReportsSection />
    </Layout>
  );
}
