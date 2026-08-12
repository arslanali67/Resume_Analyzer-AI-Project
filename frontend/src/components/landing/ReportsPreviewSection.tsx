import { SectionHeading, PrimaryButton, Card } from "./ui";

interface ReportsPreviewSectionProps {
  onOpenDashboard: () => void;
}

export default function ReportsPreviewSection({
  onOpenDashboard,
}: ReportsPreviewSectionProps) {
  return (
    <section className="bg-[#F8F8F6] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Card className="order-2 overflow-hidden lg:order-1">
            <div className="flex items-center gap-2 border-b border-[#E6E6E2] bg-[#F8F8F6] px-4 py-2.5">
              <span className="rounded bg-[#176B5B] px-1.5 py-0.5 text-[10px] font-bold text-white">
                XLS
              </span>
              <span className="text-[13px] font-medium text-[#171717]">
                evaluation_results.xlsx
              </span>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="min-w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#E6E6E2] text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B]">
                    <th className="pb-2 pr-4">Candidate</th>
                    <th className="pb-2 pr-4">Score</th>
                    <th className="pb-2">Recommendation</th>
                  </tr>
                </thead>
                <tbody className="text-[#171717]">
                  {[
                    { name: "Ahmed Khan", score: 94, rec: "Strong Match" },
                    { name: "Sarah Malik", score: 87, rec: "Good Match" },
                    { name: "Muhammad Hamza", score: 82, rec: "Good Match" },
                  ].map((row) => (
                    <tr key={row.name} className="border-b border-[#E6E6E2] last:border-0">
                      <td className="py-2 pr-4">{row.name}</td>
                      <td className="py-2 pr-4 font-semibold tabular-nums text-[#176B5B]">
                        {row.score}
                      </td>
                      <td className="py-2 text-[#6B6B6B]">{row.rec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="order-1 lg:order-2">
            <SectionHeading
              title="Turn Evaluations Into Actionable Reports"
              subtitle="Export your candidate evaluation results into an Excel report and share the results with your hiring team."
              align="left"
            />
            <PrimaryButton onClick={onOpenDashboard} className="mt-8">
              Generate Report
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
