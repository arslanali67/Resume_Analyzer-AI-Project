import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  evaluateAll,
  evaluateOne,
  getCandidates,
  getErrorMessage,
} from "../api/client";
import type { Candidate, EvaluateItem } from "../types";

interface EvaluateSectionProps {
  refreshKey: number;
  onEvaluated: () => void;
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

function ResultCard({ item }: { item: EvaluateItem }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="font-medium text-slate-900">
            {item.metadata.candidate_name || item.filename}
          </h4>
          <p className="text-xs text-slate-500">{item.filename}</p>
          <p className="mt-1 text-sm text-slate-600">
            {item.metadata.current_role} · {item.metadata.location}
          </p>
        </div>
        <ScoreBadge score={item.evaluation.match_score} />
      </div>
      <p className="mt-3 text-sm font-medium text-indigo-700">
        {item.evaluation.hiring_recommendation}
      </p>
      <p className="mt-2 text-sm text-slate-600">
        {item.evaluation.experience_summary}
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Matching skills
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {item.evaluation.matching_skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Missing skills
          </p>
          <div className="mt-1 flex flex-wrap gap-1">
            {item.evaluation.missing_skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-800"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Strengths
          </p>
          <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
            {item.evaluation.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Weaknesses
          </p>
          <ul className="mt-1 list-inside list-disc text-sm text-slate-700">
            {item.evaluation.weaknesses.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function EvaluateSection({
  refreshKey,
  onEvaluated,
}: EvaluateSectionProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFilename, setSelectedFilename] = useState("");
  const [loadingAll, setLoadingAll] = useState(false);
  const [loadingOne, setLoadingOne] = useState(false);
  const [results, setResults] = useState<EvaluateItem[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    void getCandidates({ page: 1, limit: 100 })
      .then((data) => setCandidates(data.results))
      .catch(() => setCandidates([]));
  }, [refreshKey]);

  async function handleEvaluateAll() {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description.");
      return;
    }
    setLoadingAll(true);
    try {
      const data = await evaluateAll(jobDescription.trim());
      setResults(data.results);
      toast.success(`Evaluated ${data.total_candidates} candidate(s).`);
      onEvaluated();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoadingAll(false);
    }
  }

  async function handleEvaluateOne() {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description.");
      return;
    }
    if (!selectedFilename) {
      toast.error("Please select a candidate.");
      return;
    }
    setLoadingOne(true);
    try {
      const data = await evaluateOne(selectedFilename, jobDescription.trim());
      if (data.error) {
        toast.error(data.error);
        return;
      }
      setResults([data]);
      toast.success(`Evaluated ${data.filename}.`);
      onEvaluated();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoadingOne(false);
    }
  }

  const busy = loadingAll || loadingOne;

  return (
    <section id="evaluate" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Evaluate Resumes</h2>
      <p className="mt-1 text-sm text-slate-500">
        Paste a job description, then evaluate all resumes or a single candidate.
        Evaluating all can take several minutes.
      </p>

      <label className="mt-5 block">
        <span className="text-sm font-medium text-slate-700">Job description</span>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={8}
          placeholder="Paste the full job description here..."
          className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
      </label>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <button
          type="button"
          disabled={busy}
          onClick={handleEvaluateAll}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingAll ? "Evaluating all..." : "Evaluate All"}
        </button>

        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-end">
          <label className="flex-1">
            <span className="text-sm font-medium text-slate-700">
              Or evaluate one
            </span>
            <select
              value={selectedFilename}
              onChange={(e) => setSelectedFilename(e.target.value)}
              disabled={busy}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Select candidate...</option>
              {candidates.map((c) => (
                <option key={c.filename} value={c.filename}>
                  {c.candidate_name || c.filename} ({c.filename})
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={handleEvaluateOne}
            className="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingOne ? "Evaluating..." : "Evaluate Selected"}
          </button>
        </div>
      </div>

      {busy && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          AI evaluation in progress. Please wait — this may take a while.
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-medium text-slate-700">
            Latest evaluation ({results.length})
          </h3>
          {results.map((item) => (
            <ResultCard key={item.filename} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
