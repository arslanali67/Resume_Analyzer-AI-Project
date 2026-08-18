import LandingNavbar from "./LandingNavbar";
import HeroSection from "./HeroSection";
import ProblemSection from "./ProblemSection";
import FeaturesSection from "./FeaturesSection";
import HowItWorksSection from "./HowItWorksSection";
import AnalyzerFormSection from "./AnalyzerFormSection";
import ResultsPreviewSection from "./ResultsPreviewSection";
import CandidateEvalPreviewSection from "./CandidateEvalPreviewSection";
import ComparisonPreviewSection from "./ComparisonPreviewSection";
import DashboardPreviewSection from "./DashboardPreviewSection";
import ReportsPreviewSection from "./ReportsPreviewSection";
import FinalCTASection from "./FinalCTASection";
import Footer from "./Footer";

interface LandingPageProps {
  onOpenDashboard: () => void;
  onOpenCandidatePortal: () => void;
  onAnalyzed: () => void;
}

export default function LandingPage({
  onOpenDashboard,
  onOpenCandidatePortal,
  onAnalyzed,
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <LandingNavbar
        onOpenDashboard={onOpenDashboard}
        onOpenCandidatePortal={onOpenCandidatePortal}
      />
      <main>
        <HeroSection onOpenDashboard={onOpenDashboard} />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        <AnalyzerFormSection
          onAnalyzed={onAnalyzed}
          onOpenDashboard={onOpenDashboard}
        />
        <ResultsPreviewSection />
        <CandidateEvalPreviewSection />
        <ComparisonPreviewSection />
        <DashboardPreviewSection onOpenDashboard={onOpenDashboard} />
        <ReportsPreviewSection onOpenDashboard={onOpenDashboard} />
        <FinalCTASection onOpenDashboard={onOpenDashboard} />
      </main>
      <Footer
        onOpenDashboard={onOpenDashboard}
        onOpenCandidatePortal={onOpenCandidatePortal}
      />
    </div>
  );
}
