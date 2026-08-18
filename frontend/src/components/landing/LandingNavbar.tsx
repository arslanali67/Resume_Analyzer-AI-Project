interface LandingNavbarProps {
  onOpenDashboard: () => void;
  onOpenCandidatePortal: () => void;
}

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#benefits", label: "Benefits" },
  { href: "#analyzer", label: "Analyze Resume" },
];

export default function LandingNavbar({
  onOpenDashboard,
  onOpenCandidatePortal,
}: LandingNavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E6E6E2] bg-[#F8F8F6]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5">
        <a href="#" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#176B5B] text-xs font-semibold text-white">
            RA
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-[#171717]">
            AI Resume Analyzer
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium text-[#6B6B6B] transition hover:text-[#171717]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCandidatePortal}
            className="hidden rounded-md px-3 py-2 text-[14px] font-medium text-[#6B6B6B] transition hover:text-[#171717] md:inline-flex"
          >
            For Candidates
          </button>
          <button
            type="button"
            onClick={onOpenDashboard}
            className="hidden rounded-md px-3 py-2 text-[14px] font-medium text-[#6B6B6B] transition hover:text-[#171717] sm:inline-flex"
          >
            Open Dashboard
          </button>
          <a
            href="#analyzer"
            className="rounded-md bg-[#176B5B] px-4 py-2 text-[14px] font-medium text-white transition hover:bg-[#0F4D42]"
          >
            Try Analyzer
          </a>
        </div>
      </div>
    </header>
  );
}
