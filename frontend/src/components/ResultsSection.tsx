import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import { getErrorMessage, getEvaluationResults } from "../api/client";
import type { EvaluationResult } from "../types";

interface ResultsSectionProps {
  refreshKey: number;
}

export default function ResultsSection({ refreshKey }: ResultsSectionProps) {
  const [results, setResults] = useState<EvaluationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [matchMin, setMatchMin] = useState("");
  const [matchMax, setMatchMax] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [location, setLocation] = useState("");
  const [education, setEducation] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [matchingSkill, setMatchingSkill] = useState("");
  const [missingSkill, setMissingSkill] = useState("");

  const loadResults = useCallback(
    async (
      pageNum = 1,
      filters?: {
        match_score_min?: string;
        match_score_max?: string;
        recommendation?: string;
        location?: string;
        education?: string;
        current_role?: string;
        matching_skill?: string;
        missing_skill?: string;
      }
    ) => {
      const f = filters ?? {
        match_score_min: matchMin,
        match_score_max: matchMax,
        recommendation,
        location,
        education,
        current_role: currentRole,
        matching_skill: matchingSkill,
        missing_skill: missingSkill,
      };

      setLoading(true);
      try {
        const data = await getEvaluationResults({
          page: pageNum,
          limit: 10,
          match_score_min: f.match_score_min
            ? Number(f.match_score_min)
            : undefined,
          match_score_max: f.match_score_max
            ? Number(f.match_score_max)
            : undefined,
          recommendation: f.recommendation || undefined,
          location: f.location || undefined,
          education: f.education || undefined,
          current_role: f.current_role || undefined,
          matching_skill: f.matching_skill || undefined,
          missing_skill: f.missing_skill || undefined,
        });
        const sorted = [...data.results].sort(
          (a, b) => (b.match_score ?? 0) - (a.match_score ?? 0)
        );
        setResults(sorted);
        setPage(data.page);
        setTotalPages(data.total_pages || 1);
        setTotal(data.total);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [
      matchMin,
      matchMax,
      recommendation,
      location,
      education,
      currentRole,
      matchingSkill,
      missingSkill,
    ]
  );

  useEffect(() => {
    void loadResults(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  function applyFilters(e: FormEvent) {
    e.preventDefault();
    void loadResults(1);
  }

  function clearFilters() {
    setMatchMin("");
    setMatchMax("");
    setRecommendation("");
    setLocation("");
    setEducation("");
    setCurrentRole("");
    setMatchingSkill("");
    setMissingSkill("");
    void loadResults(1, {
      match_score_min: "",
      match_score_max: "",
      recommendation: "",
      location: "",
      education: "",
      current_role: "",
      matching_skill: "",
      missing_skill: "",
    });
  }

  return (
    <section
      id="results"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Evaluation Results
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {total} stored result{total === 1 ? "" : "s"} from SQLite
        </p>
      </div>

      <form
        onSubmit={applyFilters}
        className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        <input
          type="number"
          min={0}
          max={100}
          value={matchMin}
          onChange={(e) => setMatchMin(e.target.value)}
          placeholder="Min match score"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <input
          type="number"
          min={0}
          max={100}
          value={matchMax}
          onChange={(e) => setMatchMax(e.target.value)}
          placeholder="Max match score"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <input
          value={recommendation}
          onChange={(e) => setRecommendation(e.target.value)}
          placeholder="Recommendation"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <input
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          placeholder="Education"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <input
          value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value)}
          placeholder="Current role"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <input
          value={matchingSkill}
          onChange={(e) => setMatchingSkill(e.target.value)}
          placeholder="Matching skill"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <input
          value={missingSkill}
          onChange={(e) => setMissingSkill(e.target.value)}
          placeholder="Missing skill"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Apply filters
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </form>

      <div className="mt-5 space-y-3">
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Loading results...
          </p>
        ) : results.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No evaluation results yet. Run an evaluation first.
          </p>
        ) : (
          results.map((row) => {
            const open = expanded === row.filename;
            const scoreColor =
              row.match_score >= 80
                ? "bg-emerald-100 text-emerald-800"
                : row.match_score >= 60
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800";

            return (
              <div
                key={row.filename}
                className="rounded-xl border border-slate-200 bg-slate-50"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : row.filename)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {row.candidate_name || row.filename}
                    </p>
                    <p className="text-xs text-slate-500">
                      {row.current_role || "—"} · {row.location || "—"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${scoreColor}`}
                    >
                      {row.match_score}
                    </span>
                    <span className="text-xs text-slate-400">
                      {open ? "Hide" : "Details"}
                    </span>
                  </div>
                </button>

                {open && (
                  <div className="border-t border-slate-200 px-4 py-3 text-sm">
                    <p className="font-medium text-indigo-700">
                      {row.recommendation}
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">
                          Matching skills
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {(row.matching_skills || []).map((s) => (
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
                          Missing skills
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {(row.missing_skills || []).map((s) => (
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
                          {(row.strengths || []).map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-500">
                          Weaknesses
                        </p>
                        <ul className="mt-1 list-inside list-disc text-slate-700">
                          {(row.weaknesses || []).map((w) => (
                            <li key={w}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-500">
                      {row.email} · {row.phone} · {row.education} ·{" "}
                      {row.experience_years} yrs
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => void loadResults(page - 1)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => void loadResults(page + 1)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
