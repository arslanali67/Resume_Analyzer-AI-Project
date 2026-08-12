import { useCallback, useState } from "react";
import { Toaster } from "react-hot-toast";
import LandingPage from "./components/landing/LandingPage";
import DashboardPage from "./components/DashboardPage";

type View = "landing" | "dashboard";

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [candidatesRefreshKey, setCandidatesRefreshKey] = useState(0);
  const [resultsRefreshKey, setResultsRefreshKey] = useState(0);
  const [jobsRefreshKey, setJobsRefreshKey] = useState(0);
  const [dashboardRefreshKey, setDashboardRefreshKey] = useState(0);

  const bumpCandidates = useCallback(() => {
    setCandidatesRefreshKey((k) => k + 1);
  }, []);

  const bumpResults = useCallback(() => {
    setResultsRefreshKey((k) => k + 1);
    setDashboardRefreshKey((k) => k + 1);
  }, []);

  const bumpJobs = useCallback(() => {
    setJobsRefreshKey((k) => k + 1);
  }, []);

  const openDashboard = useCallback(() => {
    setView("dashboard");
    window.scrollTo(0, 0);
  }, []);

  const goHome = useCallback(() => {
    setView("landing");
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "14px",
          },
        }}
      />
      {view === "landing" ? (
        <LandingPage
          onOpenDashboard={openDashboard}
          onAnalyzed={bumpResults}
        />
      ) : (
        <DashboardPage
          refreshKeys={{
            candidates: candidatesRefreshKey,
            results: resultsRefreshKey,
            jobs: jobsRefreshKey,
            dashboard: dashboardRefreshKey,
          }}
          onBackHome={goHome}
          bumpCandidates={bumpCandidates}
          bumpResults={bumpResults}
          bumpJobs={bumpJobs}
        />
      )}
    </>
  );
}
