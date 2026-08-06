import { useCallback, useState } from "react";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import UploadSection from "./components/UploadSection";
import EvaluateSection from "./components/EvaluateSection";
import CandidatesSection from "./components/CandidatesSection";
import ResultsSection from "./components/ResultsSection";
import ReportsSection from "./components/ReportsSection";

export default function App() {
  const [candidatesRefreshKey, setCandidatesRefreshKey] = useState(0);
  const [resultsRefreshKey, setResultsRefreshKey] = useState(0);

  const bumpCandidates = useCallback(() => {
    setCandidatesRefreshKey((k) => k + 1);
  }, []);

  const bumpResults = useCallback(() => {
    setResultsRefreshKey((k) => k + 1);
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <Layout>
        <UploadSection onUploaded={bumpCandidates} />
        <EvaluateSection
          refreshKey={candidatesRefreshKey}
          onEvaluated={() => {
            bumpResults();
            bumpCandidates();
          }}
        />
        <CandidatesSection
          refreshKey={candidatesRefreshKey}
          onDeleted={() => {
            bumpCandidates();
            bumpResults();
          }}
        />
        <ResultsSection refreshKey={resultsRefreshKey} />
        <ReportsSection />
      </Layout>
    </>
  );
}
