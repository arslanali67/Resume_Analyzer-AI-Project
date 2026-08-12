import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getDashboard, getErrorMessage } from "../api/client";
import type { DashboardStats } from "../types";

interface DashboardSectionProps {
  refreshKey: number;
}

function StatCard({
  label,
  value,
  sub,
  color = "text-slate-900",
}: {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

function DistributionBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-500">
          {count} ({pct}%)
        </span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardSection({
  refreshKey,
}: DashboardSectionProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDashboard();
      setStats(data);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard, refreshKey]);

  if (loading && !stats) {
    return (
      <section
        id="dashboard"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900">Dashboard</h2>
        <p className="mt-4 text-sm text-slate-500">Loading statistics...</p>
      </section>
    );
  }

  if (!stats || stats.total_candidates === 0) {
    return (
      <section
        id="dashboard"
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-slate-900">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">
          Overview of evaluation statistics and candidate insights.
        </p>
        <p className="mt-4 text-sm text-slate-500">
          No evaluation data yet. Upload resumes, create a job, and run an
          evaluation to see dashboard stats.
        </p>
      </section>
    );
  }

  return (
    <section
      id="dashboard"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">
            {stats.total_candidates} evaluated candidate
            {stats.total_candidates === 1 ? "" : "s"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadDashboard()}
          disabled={loading}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Average Score"
          value={stats.average_score}
          sub={`High: ${stats.highest_score} · Low: ${stats.lowest_score}`}
          color="text-indigo-700"
        />
        <StatCard
          label="Hire"
          value={stats.hire}
          sub={`${stats.hire_percentage}% of total`}
          color="text-emerald-700"
        />
        <StatCard
          label="Maybe"
          value={stats.maybe}
          sub={`${stats.maybe_percentage}% of total`}
          color="text-amber-700"
        />
        <StatCard
          label="Reject"
          value={stats.reject}
          sub={`${stats.reject_percentage}% of total`}
          color="text-rose-700"
        />
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-slate-700">
            Score Distribution
          </h3>
          <div className="mt-3 space-y-3">
            {Object.entries(stats.score_distribution).map(([label, count]) => (
              <DistributionBar
                key={label}
                label={label}
                count={count}
                total={stats.total_candidates}
                color={
                  label.startsWith("90")
                    ? "bg-emerald-500"
                    : label.startsWith("80")
                      ? "bg-indigo-500"
                      : label.startsWith("70")
                        ? "bg-amber-500"
                        : label.startsWith("60")
                          ? "bg-orange-500"
                          : "bg-rose-500"
                }
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-700">
            Experience Distribution
          </h3>
          <div className="mt-3 space-y-3">
            {Object.entries(stats.experience_distribution).map(
              ([label, count]) => (
                <DistributionBar
                  key={label}
                  label={label}
                  count={count}
                  total={stats.total_candidates}
                  color="bg-indigo-500"
                />
              )
            )}
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Average experience:{" "}
            <span className="font-medium">{stats.average_experience} years</span>
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium text-slate-700">Top Skills</h3>
          {stats.top_skills.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No skills data.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {stats.top_skills.map((item) => (
                <span
                  key={item.skill}
                  className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800"
                >
                  {item.skill}{" "}
                  <span className="text-indigo-500">({item.count})</span>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-700">
            Top Candidates
          </h3>
          {stats.top_candidates.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No candidates yet.</p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2 pr-3 font-medium">Name</th>
                    <th className="py-2 pr-3 font-medium">Score</th>
                    <th className="py-2 font-medium">Rec.</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.top_candidates.map((c) => (
                    <tr key={c.filename} className="border-b border-slate-100">
                      <td className="py-2 pr-3">
                        <div className="font-medium text-slate-900">
                          {c.candidate_name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {c.current_role}
                        </div>
                      </td>
                      <td className="py-2 pr-3 font-semibold text-indigo-700">
                        {c.match_score}
                      </td>
                      <td className="py-2 capitalize text-slate-700">
                        {c.recommendation}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
