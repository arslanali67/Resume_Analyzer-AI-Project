interface CandidateFooterProps {
  onBackToHr: () => void;
}

const footerLinks = {
  "Your Report": [
    { label: "ATS Score", href: "#features" },
    { label: "Category Breakdown", href: "#features" },
    { label: "Skill Gap", href: "#features" },
    { label: "Resume Rewrite", href: "#features" },
  ],
  Portal: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Check My Resume", href: "#analyzer" },
    { label: "FAQ", href: "#faq" },
  ],
};

export default function CandidateFooter({ onBackToHr }: CandidateFooterProps) {
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
                Candidate Portal
              </span>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed">
              Free ATS resume analysis and AI rewriting for job seekers. Your
              uploads are deleted after processing.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[13px] font-medium text-white">{category}</h4>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[14px] transition hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-[13px] font-medium text-white">For Employers</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onBackToHr}
                  className="text-[14px] transition hover:text-white"
                >
                  HR Screening Tool
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#2a2a2a] pt-8 text-center text-[13px]">
          © 2026 AI Resume Analyzer. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
