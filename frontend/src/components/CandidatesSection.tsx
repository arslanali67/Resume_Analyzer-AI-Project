import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import {
  deleteCandidate,
  getCandidates,
  getErrorMessage,
  searchCandidates,
} from "../api/client";
import type { Candidate } from "../types";

interface CandidatesSectionProps {
  refreshKey: number;
  onDeleted: () => void;
}

export default function CandidatesSection({
  refreshKey,
  onDeleted,
}: CandidatesSectionProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [location, setLocation] = useState("");
  const [education, setEducation] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [experienceMin, setExperienceMin] = useState("");
  const [experienceMax, setExperienceMax] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadCandidates = useCallback(
    async (
      pageNum = 1,
      filters?: {
        location?: string;
        education?: string;
        current_role?: string;
        experience_min?: string;
        experience_max?: string;
      }
    ) => {
      const f = filters ?? {
        location,
        education,
        current_role: currentRole,
        experience_min: experienceMin,
        experience_max: experienceMax,
      };

      setLoading(true);
      setIsSearchMode(false);
      try {
        const data = await getCandidates({
          page: pageNum,
          limit: 10,
          location: f.location || undefined,
          education: f.education || undefined,
          current_role: f.current_role || undefined,
          experience_min: f.experience_min
            ? Number(f.experience_min)
            : undefined,
          experience_max: f.experience_max
            ? Number(f.experience_max)
            : undefined,
        });
        setCandidates(data.results);
        setPage(data.page);
        setTotalPages(data.total_pages || 1);
        setTotal(data.total_candidates);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    },
    [
      location,
      education,
      currentRole,
      experienceMin,
      experienceMax,
    ]
  );

  useEffect(() => {
    void loadCandidates(1);
    // Refresh when parent bumps refreshKey (upload/delete/evaluate)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!search.trim()) {
      void loadCandidates(1);
      return;
    }
    setLoading(true);
    try {
      const data = await searchCandidates(search.trim());
      setCandidates(data.results);
      setTotal(data.total_results);
      setPage(1);
      setTotalPages(1);
      setIsSearchMode(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(filename: string) {
    if (!window.confirm(`Delete candidate "${filename}"?`)) return;
    setDeleting(filename);
    try {
      await deleteCandidate(filename);
      toast.success("Candidate deleted successfully.");
      onDeleted();
      if (isSearchMode && search.trim()) {
        const data = await searchCandidates(search.trim());
        setCandidates(data.results);
        setTotal(data.total_results);
      } else {
        await loadCandidates(page);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(null);
    }
  }

  function applyFilters(e: FormEvent) {
    e.preventDefault();
    void loadCandidates(1);
  }

  function clearFilters() {
    setLocation("");
    setEducation("");
    setCurrentRole("");
    setExperienceMin("");
    setExperienceMax("");
    setSearch("");
    void loadCandidates(1, {
      location: "",
      education: "",
      current_role: "",
      experience_min: "",
      experience_max: "",
    });
  }

  return (
    <section
      id="candidates"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Candidates</h2>
          <p className="mt-1 text-sm text-slate-500">
            {total} candidate{total === 1 ? "" : "s"}
            {isSearchMode ? " (search results)" : ""}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSearch}
        className="mt-4 flex flex-col gap-2 sm:flex-row"
      >
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search candidates..."
          className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Search
        </button>
      </form>

      <form
        onSubmit={applyFilters}
        className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
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
          type="number"
          min={0}
          step={0.5}
          value={experienceMin}
          onChange={(e) => setExperienceMin(e.target.value)}
          placeholder="Min experience (years)"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <input
          type="number"
          min={0}
          step={0.5}
          value={experienceMax}
          onChange={(e) => setExperienceMax(e.target.value)}
          placeholder="Max experience (years)"
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

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Email</th>
              <th className="px-3 py-2 font-medium">Role</th>
              <th className="px-3 py-2 font-medium">Exp.</th>
              <th className="px-3 py-2 font-medium">Location</th>
              <th className="px-3 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                  Loading candidates...
                </td>
              </tr>
            ) : candidates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                  No candidates found. Upload resumes to get started.
                </td>
              </tr>
            ) : (
              candidates.map((c) => (
                <tr key={c.filename} className="border-b border-slate-100">
                  <td className="px-3 py-3">
                    <div className="font-medium text-slate-900">
                      {c.candidate_name || "—"}
                    </div>
                    <div className="text-xs text-slate-500">{c.filename}</div>
                  </td>
                  <td className="px-3 py-3 text-slate-700">{c.email || "—"}</td>
                  <td className="px-3 py-3 text-slate-700">
                    {c.current_role || "—"}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {c.experience_years ?? "—"}
                  </td>
                  <td className="px-3 py-3 text-slate-700">
                    {c.location || "—"}
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      disabled={deleting === c.filename}
                      onClick={() => handleDelete(c.filename)}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                    >
                      {deleting === c.filename ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isSearchMode && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => void loadCandidates(page - 1)}
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
            onClick={() => void loadCandidates(page + 1)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
