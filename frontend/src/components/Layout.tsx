import type { ReactNode } from "react";

const navItems = [
  { id: "upload", label: "Upload" },
  { id: "evaluate", label: "Evaluate" },
  { id: "candidates", label: "Candidates" },
  { id: "results", label: "Results" },
  { id: "reports", label: "Reports" },
];

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              AI Resume Analyzer
            </h1>
            <p className="text-sm text-slate-500">
              HR dashboard for resume screening and ranking
            </p>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
