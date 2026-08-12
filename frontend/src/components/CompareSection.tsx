import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  compareCandidates,
  getErrorMessage,
  getEvaluationResults,
} from "../api/client";
import type { CompareResponse, EvaluationResult } from "../types";

interface CompareSectionProps {
  refreshKey: number;
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-emerald-100 text-emerald-800"
      : score >= 60
        ? "bg-amber-100 text-amber-800"
        : "bg-rose-100 text-rose-800";
  return (
    <span className={`rounded-full px-2.5 py-1 text-sm font-semibold ${color}`}>
      {score}/100
    </span>
  );
}

function WinnerBadge({ label }: { label: string }) {
  if (label === "Tie") {
    return (
      <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
        Tie
      </span>
    );
  }
  return (
    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
      Winner: {label}
    </span>
  );
}

function CandidateColumn({
  candidate,
  isOverallWinner,
}: {
  candidate: CompareResponse["candidate_1"];
  isOverallWinner: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        isOverallWinner
          ? "border-emerald-300 bg-emerald-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-slate-900">
            {candidate.candidate_name}
          </h4>
          <p className="text-xs text-slate-500">{candidate.filename}</p>
          <p className="mt-1 text-sm text-slate-600">
            {candidate.current_role} · {candidate.experience_years} yrs
          </p>
        </div>
        <ScoreBadge score={candidate.match_score} />
      </div>

      <p className="mt-3 text-sm font-medium capitalize text-indigo-700">
        {candidate.recommendation}
      </p>

      <div className="mt-3 space-y-3 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Education
          </p>
          <p className="text-slate-700">{candidate.education || "—"}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Matching skills ({candidate.matching_skills.length})
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {candidate.matching_skills.map((s) => (
              <span
                key={s}
                className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Missing skills ({candidate.missing_skills.length})
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {candidate.missing_skills.map((s) => (
              <span
                key={s}
                className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-800"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Strengths
          </p>
          <ul className="mt-1 list-inside list-disc text-slate-700">
            {candidate.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">
            Weaknesses
          </p>
          <ul className="mt-1 list-inside list-disc text-slate-700">
            {candidate.weaknesses.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function CompareSection({ refreshKey }: CompareSectionProps) {
  const [candidates, setCandidates] = useState<EvaluationResult[]>([]);
  const [filename1, setFilename1] = useState("");
  const [filename2, setFilename2] = useState("");
  const [loading, setLoading] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [result, setResult] = useState<CompareResponse | null>(null);

  useEffect(() => {
    setLoading(true);
    void getEvaluationResults({ page: 1, limit: 100 })
      .then((data) => setCandidates(data.results))
      .catch(() => setCandidates([]))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  async function handleCompare() {
    if (!filename1 || !filename2) {
      toast.error("Please select two candidates.");
      return;
    }
    if (filename1 === filename2) {
      toast.error("Please select two different candidates.");
      return;
    }

    setComparing(true);
    setResult(null);
    try {
      const data = await compareCandidates(filename1, filename2);
      setResult(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setComparing(false);
    }
  }

  const categoryLabels: Record<string, string> = {
    score: "Match Score",
    experience: "Experience",
    matching_skills: "Matching Skills",
    missing_skills: "Fewer Missing Skills",
    recommendation: "Recommendation",
    education: "Education",
    overall: "Overall",
  };

  return (
    <section
      id="compare"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">
        Compare Candidates
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Side-by-side comparison of two evaluated candidates across multiple
        categories.
      </p>

      {loading ? (
        <p className="mt-4 text-sm text-slate-500">Loading candidates...</p>
      ) : candidates.length < 2 ? (
        <p className="mt-4 text-sm text-slate-500">
          Need at least 2 evaluated candidates to compare. Run evaluations
          first.
        </p>
      ) : (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="text-sm font-medium text-slate-700">
              Candidate 1
            </span>
            <select
              value={filename1}
              onChange={(e) => setFilename1(e.target.value)}
              disabled={comparing}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Select candidate...</option>
              {candidates.map((c) => (
                <option key={c.filename} value={c.filename}>
                  {c.candidate_name || c.filename} ({c.match_score})
                </option>
              ))}
            </select>
          </label>
          <label className="flex-1">
            <span className="text-sm font-medium text-slate-700">
              Candidate 2
            </span>
            <select
              value={filename2}
              onChange={(e) => setFilename2(e.target.value)}
              disabled={comparing}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Select candidate...</option>
              {candidates.map((c) => (
                <option key={c.filename} value={c.filename}>
                  {c.candidate_name || c.filename} ({c.match_score})
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={comparing}
            onClick={() => void handleCompare()}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {comparing ? "Comparing..." : "Compare"}
          </button>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">
            <p className="text-sm font-medium text-indigo-900">
              Overall winner:{" "}
              <span className="font-bold">{result.winner.overall}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-indigo-800">
              {Object.entries(result.comparison_summary).map(
                ([name, summary]) => (
                  <span key={name}>
                    {name}: {summary.wins} wins ({summary.percentage}%)
                  </span>
                )
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(result.winner)
              .filter(([key]) => key !== "overall")
              .map(([key, winner]) => (
                <div
                  key={key}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
                >
                  <span className="text-slate-600">
                    {categoryLabels[key] ?? key}:{" "}
                  </span>
                  <WinnerBadge label={winner} />
                </div>
              ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <CandidateColumn
              candidate={result.candidate_1}
              isOverallWinner={
                result.winner.overall === result.candidate_1.candidate_name
              }
            />
            <CandidateColumn
              candidate={result.candidate_2}
              isOverallWinner={
                result.winner.overall === result.candidate_2.candidate_name
              }
            />
          </div>
        </div>
      )}
    </section>
  );
}
