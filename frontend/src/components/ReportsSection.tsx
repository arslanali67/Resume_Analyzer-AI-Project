import { useState } from "react";
import toast from "react-hot-toast";
import { downloadReport, getErrorMessage } from "../api/client";

export default function ReportsSection() {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const blob = await downloadReport();

      // FastAPI may return JSON error as blob on 404
      if (blob.type.includes("application/json")) {
        const text = await blob.text();
        const parsed = JSON.parse(text) as { detail?: string };
        toast.error(
          parsed.detail ||
            "Report not found. Run an evaluation first to generate the Excel file."
        );
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "evaluation_results.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded.");
    } catch (error) {
      toast.error(
        getErrorMessage(error) ||
          "Report not found. Run an evaluation first to generate the Excel file."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="reports" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Reports</h2>
      <p className="mt-1 text-sm text-slate-500">
        Download the Excel evaluation report generated after running{" "}
        <span className="font-medium">Evaluate All</span>.
      </p>
      <button
        type="button"
        disabled={loading}
        onClick={handleDownload}
        className="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Downloading..." : "Download Excel Report"}
      </button>
    </section>
  );
}
