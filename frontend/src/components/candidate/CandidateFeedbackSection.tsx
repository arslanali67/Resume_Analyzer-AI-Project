import type { CandidatePortalEvaluation } from "../../types";
import { Panel, PointList, Section, SectionHeading } from "./ui";

interface CandidateFeedbackSectionProps {
  evaluation: CandidatePortalEvaluation;
}

export default function CandidateFeedbackSection({
  evaluation,
}: CandidateFeedbackSectionProps) {
  const feedback = evaluation.overall_feedback ?? [];

  return (
    <Section id="result-feedback">
      <SectionHeading
        eyebrow="What To Fix"
        title="Feedback You Can Act On"
        subtitle="Prioritised changes, plus an honest read on where you stand as a candidate and how the document itself performs."
      />

      {feedback.length > 0 && (
        <div className="mt-12">
          <Panel
            label="Priority Actions"
            title="The five changes that move your score most"
          >
            <PointList items={feedback} numbered />
          </Panel>
        </div>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel label="Candidate Profile" title="Your strengths for this role">
          <PointList
            items={evaluation.strengths ?? []}
            emptyText="No strengths were identified for this role."
          />
        </Panel>

        <Panel label="Candidate Profile" title="Where you fall short">
          <PointList
            items={evaluation.weaknesses ?? []}
            emptyText="No weaknesses were identified."
          />
        </Panel>

        <Panel label="Document Quality" title="What the resume does well">
          <PointList
            items={evaluation.resume_strengths ?? []}
            emptyText="No document strengths were identified."
          />
        </Panel>

        <Panel label="Document Quality" title="Specific resume improvements">
          <PointList
            items={evaluation.resume_improvements ?? []}
            emptyText="No document improvements were suggested."
          />
        </Panel>
      </div>
    </Section>
  );
}
