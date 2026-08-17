import type { ReactNode } from "react";
import type { CandidatePortalMetadata, RewrittenResume } from "../../types";
import { Panel, PointList, Section, SectionHeading } from "./ui";

interface CandidateRewriteSectionProps {
  rewrite: RewrittenResume | null;
  metadata: CandidatePortalMetadata;
}

/**
 * The rewriter is prompted to bold key terms with <b>…</b>. Render those as
 * real emphasis without ever injecting HTML — anything that is not a literal
 * <b> pair stays plain text.
 */
function renderBold(text: string): ReactNode {
  const parts = text.split(/(<b>.*?<\/b>)/g);

  return parts.map((part, i) => {
    const match = /^<b>(.*?)<\/b>$/.exec(part);
    if (match) {
      return (
        <strong key={i} className="font-semibold text-[#171717]">
          {match[1]}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function ResumeHeading({ children }: { children: ReactNode }) {
  return (
    <>
      <h4 className="mt-6 text-[12px] font-semibold uppercase tracking-widest text-[#171717] first:mt-0">
        {children}
      </h4>
      <div className="mt-1.5 mb-3 h-px w-full bg-[#E6E6E2]" />
    </>
  );
}

function EntryHeader({
  left,
  right,
  subLeft,
  subRight,
}: {
  left: string;
  right?: string;
  subLeft?: string;
  subRight?: string;
}) {
  return (
    <div className="mb-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <span className="text-[15px] font-semibold text-[#171717]">{left}</span>
        {right && (
          <span className="text-[14px] font-medium text-[#171717]">{right}</span>
        )}
      </div>
      {(subLeft || subRight) && (
        <div className="flex flex-wrap items-baseline justify-between gap-x-4">
          {subLeft && (
            <span className="text-[14px] italic text-[#6B6B6B]">{subLeft}</span>
          )}
          {subRight && (
            <span className="text-[14px] italic text-[#6B6B6B]">
              {subRight}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <ul className="space-y-1">
      {items.map((bullet, i) => (
        <li key={i} className="flex gap-2 text-[14px] leading-relaxed text-[#171717]">
          <span className="text-[#176B5B]" aria-hidden="true">
            •
          </span>
          <span>{renderBold(bullet)}</span>
        </li>
      ))}
    </ul>
  );
}

export default function CandidateRewriteSection({
  rewrite,
  metadata,
}: CandidateRewriteSectionProps) {
  if (!rewrite) return null;

  const summary = rewrite.professional_summary?.content ?? "";
  const skills = rewrite.skills ?? [];
  const experience = rewrite.experience ?? [];
  const projects = rewrite.projects ?? [];
  const education = rewrite.education ?? [];
  const certifications = rewrite.certifications ?? [];
  const keywords = rewrite.ats_keywords_used ?? [];
  const suggestions = rewrite.improvement_suggestions?.recommendations ?? [];

  const contactBits = [
    metadata.phone,
    metadata.email,
    metadata.linkedin || metadata.github,
    metadata.location,
  ].filter(Boolean) as string[];

  return (
    <Section id="result-rewrite" tint="white">
      <SectionHeading
        eyebrow="Rewritten Resume"
        title="Your Resume, Rebuilt for ATS"
        subtitle="Same facts, restructured and reworded to parse cleanly and match the posting. Nothing here was invented — only your own content was edited."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {/* Resume preview */}
        <div className="lg:col-span-2">
          <Panel label="Preview" title="ATS-formatted resume">
            <div className="rounded-md border border-[#E6E6E2] bg-[#F8F8F6] px-6 py-7">
              <div className="text-center">
                <p className="text-[20px] font-semibold tracking-tight text-[#171717]">
                  {metadata.candidate_name || "Candidate"}
                </p>
                {contactBits.length > 0 && (
                  <p className="mt-1 text-[13px] text-[#6B6B6B]">
                    {contactBits.join("  |  ")}
                  </p>
                )}
              </div>

              <div className="mt-6">
                {summary && (
                  <>
                    <ResumeHeading>Summary</ResumeHeading>
                    <p className="text-[14px] leading-relaxed text-[#171717]">
                      {renderBold(summary)}
                    </p>
                  </>
                )}

                {experience.length > 0 && (
                  <>
                    <ResumeHeading>Experience</ResumeHeading>
                    <div className="space-y-4">
                      {experience.map((item, i) => (
                        <div key={i}>
                          <EntryHeader
                            left={item.company}
                            right={item.location}
                            subLeft={item.role}
                            subRight={item.duration}
                          />
                          <Bullets items={item.bullets} />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {projects.length > 0 && (
                  <>
                    <ResumeHeading>Projects</ResumeHeading>
                    <div className="space-y-4">
                      {projects.map((item, i) => (
                        <div key={i}>
                          <EntryHeader
                            left={item.title}
                            right={item.date}
                            subLeft={(item.technologies ?? []).join(", ")}
                          />
                          <Bullets items={item.bullets} />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {skills.length > 0 && (
                  <>
                    <ResumeHeading>Technical Skills</ResumeHeading>
                    <div className="space-y-1.5">
                      {skills.map((cat, i) => (
                        <p
                          key={i}
                          className="text-[14px] leading-relaxed text-[#171717]"
                        >
                          <span className="font-semibold">{cat.category}: </span>
                          {(cat.skills ?? []).join(", ")}
                        </p>
                      ))}
                    </div>
                  </>
                )}

                {education.length > 0 && (
                  <>
                    <ResumeHeading>Education</ResumeHeading>
                    <div className="space-y-3">
                      {education.map((item, i) => (
                        <EntryHeader
                          key={i}
                          left={item.institute}
                          right={item.location}
                          subLeft={item.degree}
                          subRight={item.duration}
                        />
                      ))}
                    </div>
                  </>
                )}

                {certifications.length > 0 && (
                  <>
                    <ResumeHeading>Certifications</ResumeHeading>
                    <ul className="space-y-1">
                      {certifications.map((cert, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-[14px] leading-relaxed text-[#171717]"
                        >
                          <span className="text-[#176B5B]" aria-hidden="true">
                            •
                          </span>
                          <span>
                            {cert.name}
                            {cert.url && (
                              <>
                                {" "}
                                <a
                                  href={cert.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#176B5B] underline underline-offset-2"
                                >
                                  View
                                </a>
                              </>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </Panel>
        </div>

        {/* Side panels */}
        <div className="space-y-5">
          <Panel
            label="Keywords Applied"
            title={`${keywords.length} term${keywords.length === 1 ? "" : "s"} woven in`}
          >
            {keywords.length === 0 ? (
              <p className="text-[15px] text-[#6B6B6B]">
                No keywords were reported for this rewrite.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {keywords.map((keyword, i) => (
                  <span
                    key={`${keyword}-${i}`}
                    className="inline-block rounded border border-[#176B5B]/20 bg-[#E8F3EF] px-2 py-0.5 text-xs font-medium text-[#176B5B]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </Panel>

          {suggestions.length > 0 && (
            <Panel label="Beyond the Resume" title="Profile recommendations">
              <PointList items={suggestions} />
            </Panel>
          )}
        </div>
      </div>
    </Section>
  );
}
