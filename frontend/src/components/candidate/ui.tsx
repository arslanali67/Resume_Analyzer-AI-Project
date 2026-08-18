import type { CSSProperties, ReactNode } from "react";
import type { Tone } from "./tone";
import { TONE, toneForGrade, toneForScore } from "./tone";

/**
 * Candidate-portal UI primitives.
 *
 * Shares the landing-page design language (warm off-white surfaces, a single
 * green accent, restrained borders) and adds the score/grade vocabulary the
 * ATS results need. Colour mapping lives in ./tone.
 */

// ── Layout ───────────────────────────────────────────────

export function Section({
  id,
  children,
  tint = "light",
  className = "",
}: {
  id?: string;
  children: ReactNode;
  tint?: "light" | "white" | "deep";
  className?: string;
}) {
  const bg =
    tint === "deep"
      ? "bg-[#0F4D42]"
      : tint === "white"
        ? "bg-white"
        : "bg-[#F8F8F6]";

  return (
    <section id={id} className={`${bg} py-20 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-6xl px-5">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p
          className={`mb-4 text-[13px] font-medium uppercase tracking-widest ${
            light ? "text-white/60" : "text-[#176B5B]"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`text-[2rem] font-semibold leading-tight tracking-tight sm:text-[2.25rem] ${
          light ? "text-white" : "text-[#171717]"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-4 text-[17px] leading-relaxed ${
            light ? "text-white/70" : "text-[#6B6B6B]"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Card({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`rounded-lg border border-[#E6E6E2] bg-white ${className}`}
    >
      {children}
    </div>
  );
}

/** Card with a labelled header strip — used for every results panel. */
export function Panel({
  label,
  title,
  action,
  children,
  className = "",
}: {
  label: string;
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E6E2] px-5 py-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B]">
            {label}
          </p>
          {title && (
            <p className="mt-0.5 text-[15px] font-semibold text-[#171717]">
              {title}
            </p>
          )}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}

// ── Buttons ──────────────────────────────────────────────

export function PrimaryButton({
  children,
  href,
  onClick,
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const cls = `inline-flex items-center justify-center rounded-md bg-[#176B5B] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#0F4D42] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${className}`;

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  href,
  onClick,
  disabled,
  download,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  download?: string;
  className?: string;
}) {
  const cls = `inline-flex items-center justify-center rounded-md border border-[#E6E6E2] bg-white px-5 py-2.5 text-sm font-medium text-[#171717] transition hover:border-[#176B5B]/30 hover:bg-[#E8F3EF] hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 ${className}`;

  if (href) {
    return (
      <a href={href} download={download} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

// ── Score display ────────────────────────────────────────

/** Circular ATS score dial. */
export function ScoreRing({
  score,
  size = 132,
  label = "ATS Score",
}: {
  score: number;
  size?: number;
  label?: string;
}) {
  const tone = TONE[toneForScore(score)];
  const stroke = 9;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label}: ${clamped} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E6E6E2"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone.bar}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-[2rem] font-semibold leading-none tabular-nums"
          style={{ color: tone.text }}
        >
          {clamped}
        </span>
        <span className="mt-1 text-[11px] font-medium uppercase tracking-wide text-[#6B6B6B]">
          / 100
        </span>
      </div>
    </div>
  );
}

/** Horizontal score bar with a label and value — one ATS category. */
export function CategoryBar({
  label,
  score,
  reason,
}: {
  label: string;
  score: number;
  reason?: string;
}) {
  const tone = TONE[toneForScore(score)];
  const clamped = Math.max(0, Math.min(100, score));

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[15px] font-medium capitalize text-[#171717]">
          {label}
        </span>
        <span
          className="text-[15px] font-semibold tabular-nums"
          style={{ color: tone.text }}
        >
          {clamped}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E6E6E2]">
        <div
          className="animate-score-fill h-full rounded-full"
          style={{ width: `${clamped}%`, backgroundColor: tone.bar }}
        />
      </div>
      {reason && (
        <p className="mt-2 text-[14px] leading-relaxed text-[#6B6B6B]">
          {reason}
        </p>
      )}
    </div>
  );
}

export function GradeBadge({ grade }: { grade: string }) {
  const tone = TONE[toneForGrade(grade)];
  return (
    <span
      className="inline-flex h-11 min-w-11 items-center justify-center rounded-md border px-3 text-[19px] font-semibold"
      style={{
        color: tone.text,
        backgroundColor: tone.bg,
        borderColor: tone.border,
      }}
    >
      {grade || "—"}
    </span>
  );
}

export function Pill({
  children,
  tone = "ok",
}: {
  children: ReactNode;
  tone?: Tone;
}) {
  const t = TONE[tone];
  return (
    <span
      className="inline-block rounded border px-2.5 py-0.5 text-xs font-medium"
      style={{ color: t.text, backgroundColor: t.bg, borderColor: t.border }}
    >
      {children}
    </span>
  );
}

export function SkillTag({ name, matched }: { name: string; matched: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium ${
        matched
          ? "border-[#176B5B]/20 bg-[#E8F3EF] text-[#176B5B]"
          : "border-[#E6E6E2] bg-[#F8F8F6] text-[#6B6B6B]"
      }`}
    >
      {name}
      <span aria-hidden="true">{matched ? "✓" : "—"}</span>
    </span>
  );
}

/** Numbered or bulleted list used across the feedback panels. */
export function PointList({
  items,
  numbered = false,
  emptyText = "Nothing reported.",
}: {
  items: string[];
  numbered?: boolean;
  emptyText?: string;
}) {
  if (!items || items.length === 0) {
    return <p className="text-[15px] text-[#6B6B6B]">{emptyText}</p>;
  }

  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex gap-3">
          <span
            className={`mt-0.5 shrink-0 text-[13px] font-medium tabular-nums text-[#176B5B] ${
              numbered ? "" : "leading-6"
            }`}
            aria-hidden="true"
          >
            {numbered ? String(i + 1).padStart(2, "0") : "—"}
          </span>
          <span className="text-[15px] leading-relaxed text-[#171717]">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
