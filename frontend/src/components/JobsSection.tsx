import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import {
  createJob,
  deleteJob,
  getErrorMessage,
  getJobs,
  updateJob,
} from "../api/client";
import type { JobDescription } from "../types";

interface JobsSectionProps {
  refreshKey: number;
  onJobsChanged: () => void;
}

const emptyForm = { title: "", department: "", description: "" };

export default function JobsSection({
  refreshKey,
  onJobsChanged,
}: JobsSectionProps) {
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(data.results);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs, refreshKey]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEdit(job: JobDescription) {
    setEditingId(job.id);
    setForm({
      title: job.title,
      department: job.department ?? "",
      description: job.description,
    });
    setExpandedId(job.id);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        department: form.department.trim() || undefined,
        description: form.description.trim(),
      };

      if (editingId) {
        await updateJob(editingId, payload);
        toast.success("Job description updated.");
      } else {
        await createJob(payload);
        toast.success("Job description created.");
      }

      resetForm();
      onJobsChanged();
      await loadJobs();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(jobId: number, title: string) {
    if (!window.confirm(`Delete job "${title}"?`)) return;
    setDeleting(jobId);
    try {
      await deleteJob(jobId);
      toast.success("Job description deleted.");
      if (editingId === jobId) resetForm();
      onJobsChanged();
      await loadJobs();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(null);
    }
  }

  return (
    <section
      id="jobs"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Job Descriptions</h2>
      <p className="mt-1 text-sm text-slate-500">
        Create and manage job descriptions used for AI resume evaluation.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Senior Python Developer"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Department (optional)
            </span>
            <input
              value={form.department}
              onChange={(e) =>
                setForm({ ...form, department: e.target.value })
              }
              placeholder="e.g. Engineering"
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Description</span>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={6}
            placeholder="Paste the full job description here..."
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Job"
                : "Create Job"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-slate-700">
          Saved jobs ({jobs.length})
        </h3>

        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">
            No job descriptions yet. Create one above to start evaluating.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {jobs.map((job) => {
              const open = expandedId === job.id;
              return (
                <li
                  key={job.id}
                  className="rounded-xl border border-slate-200 bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedId(open ? null : job.id)
                      }
                      className="min-w-0 flex-1 text-left"
                    >
                      <p className="font-medium text-slate-900">
                        {job.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {job.department ? `${job.department} · ` : ""}
                        ID {job.id} · {new Date(job.created_at).toLocaleDateString()}
                      </p>
                    </button>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(job)}
                        className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={deleting === job.id}
                        onClick={() => void handleDelete(job.id, job.title)}
                        className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                      >
                        {deleting === job.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </div>
                  {open && (
                    <div className="border-t border-slate-200 px-4 py-3">
                      <p className="whitespace-pre-wrap text-sm text-slate-700">
                        {job.description}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
