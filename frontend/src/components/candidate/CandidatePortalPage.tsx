import { useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  analyzeCandidateResume,
  generateCandidateResumePdf,
  getErrorMessage,
} from "../../api/client";
import type { CandidatePortalResponse } from "../../types";

import CandidateNavbar from "./CandidateNavbar";
import CandidateHero from "./CandidateHero";
import CandidateProblemSection from "./CandidateProblemSection";
import CandidateHowItWorksSection from "./CandidateHowItWorksSection";
import CandidateFeaturesSection from "./CandidateFeaturesSection";
import CandidateAnalyzerSection from "./CandidateAnalyzerSection";
import CandidateScoreSection from "./CandidateScoreSection";
import CandidateBreakdownSection from "./CandidateBreakdownSection";
import CandidateSkillsSection from "./CandidateSkillsSection";
import CandidateFeedbackSection from "./CandidateFeedbackSection";
import CandidateRewriteSection from "./CandidateRewriteSection";
import CandidatePdfSection from "./CandidatePdfSection";
import CandidateFaqSection from "./CandidateFaqSection";
import CandidateCTASection from "./CandidateCTASection";
import CandidateFooter from "./CandidateFooter";

interface CandidatePortalPageProps {
  onBackToHr: () => void;
}

export default function CandidatePortalPage({
  onBackToHr,
}: CandidatePortalPageProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [result, setResult] = useState<CandidatePortalResponse | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  function scrollToResults() {
    // Let the results mount before scrolling to them.
    window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  async function handleAnalyze() {
    if (!file) {
      toast.error("Please choose your resume file.");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please paste the job description.");
      return;
    }

    setAnalyzing(true);
    setResult(null);

    try {
      const data = await analyzeCandidateResume(file, jobDescription.trim());
      setResult(data);
      toast.success("Your ATS report is ready.");
      scrollToResults();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleGeneratePdf() {
    if (!file || !jobDescription.trim()) {
      toast.error("Your resume and job description are needed to build the PDF.");
      return;
    }

    setGeneratingPdf(true);

    try {
      const data = await generateCandidateResumePdf(
        file,
        jobDescription.trim()
      );
      setResult(data);
      toast.success("Your ATS resume PDF is ready to download.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setGeneratingPdf(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <CandidateNavbar onBackToHr={onBackToHr} />

      <main>
        <CandidateHero />
        <CandidateProblemSection />
        <CandidateHowItWorksSection />
        <CandidateFeaturesSection />

        <CandidateAnalyzerSection
          file={file}
          onFileChange={setFile}
          jobDescription={jobDescription}
          onJobDescriptionChange={setJobDescription}
          analyzing={analyzing}
          onAnalyze={() => void handleAnalyze()}
        />

        {result && (
          <div ref={resultsRef}>
            <CandidateScoreSection
              evaluation={result.evaluation}
              metadata={result.metadata}
            />
            <CandidateBreakdownSection breakdown={result.evaluation?.breakdown} />
            <CandidateSkillsSection
              matchingSkills={result.evaluation?.matching_skills ?? []}
              missingSkills={result.evaluation?.missing_skills ?? []}
            />
            <CandidateFeedbackSection evaluation={result.evaluation} />
            <CandidateRewriteSection
              rewrite={result.rewritten_resume}
              metadata={result.metadata}
            />
            <CandidatePdfSection
              pdf={result.pdf}
              generating={generatingPdf}
              onGenerate={() => void handleGeneratePdf()}
            />
          </div>
        )}

        <CandidateFaqSection />
        <CandidateCTASection onBackToHr={onBackToHr} />
      </main>

      <CandidateFooter onBackToHr={onBackToHr} />
    </div>
  );
}
