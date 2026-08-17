import type { ReactNode } from "react";

const navItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "upload", label: "Upload" },
  { id: "jobs", label: "Jobs" },
  { id: "evaluate", label: "Evaluate" },
  { id: "candidates", label: "Candidates" },
  { id: "results", label: "Results" },
  { id: "compare", label: "Compare" },
  { id: "reports", label: "Reports" },
];

interface LayoutProps {
  children: ReactNode;
  onBackHome?: () => void;
}

export default function Layout({ children, onBackHome }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F8F6]">
      <header className="sticky top-0 z-40 border-b border-[#E6E6E2] bg-[#F8F8F6]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            {onBackHome && (
              <button
                type="button"
                onClick={onBackHome}
                className="rounded-md border border-[#E6E6E2] bg-white px-2.5 py-1.5 text-[13px] font-medium text-[#6B6B6B] transition hover:border-[#176B5B]/30 hover:text-[#171717]"
              >
                ← Home
              </button>
            )}
            <div>
              <h1 className="text-[16px] font-semibold text-[#171717]">
                AI Resume Analyzer
              </h1>
              <p className="text-[13px] text-[#6B6B6B]">
                HR dashboard for resume screening and ranking
              </p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-1.5">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-md border border-[#E6E6E2] bg-white px-2.5 py-1.5 text-[13px] font-medium text-[#6B6B6B] transition hover:border-[#176B5B]/30 hover:text-[#176B5B]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8">
        {children}
      </main>
    </div>
  );
}
