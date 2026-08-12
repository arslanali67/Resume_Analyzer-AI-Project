interface FooterProps {
  onOpenDashboard: () => void;
}

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Analyzer", href: "#analyzer" },
    { label: "Dashboard", action: "dashboard" as const },
  ],
  Tools: [
    { label: "Resume Analyzer", href: "#analyzer" },
    { label: "Candidate Comparison", href: "#features" },
    { label: "Reports", href: "#dashboard-preview" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

export default function Footer({ onOpenDashboard }: FooterProps) {
  return (
    <footer className="border-t border-[#2a2a2a] bg-[#1A1A1A] text-[#9B9B9B]">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#176B5B] text-[10px] font-semibold text-white">
                RA
              </span>
              <span className="text-[14px] font-semibold text-white">
                AI Resume Analyzer
              </span>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed">
              AI-powered resume screening and candidate evaluation for modern HR
              teams.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[13px] font-medium text-white">{category}</h4>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {"action" in link && link.action === "dashboard" ? (
                      <button
                        type="button"
                        onClick={onOpenDashboard}
                        className="text-[14px] transition hover:text-white"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={"href" in link ? link.href : "#"}
                        className="text-[14px] transition hover:text-white"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-[#2a2a2a] pt-8 text-center text-[13px]">
          © 2026 AI Resume Analyzer. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
