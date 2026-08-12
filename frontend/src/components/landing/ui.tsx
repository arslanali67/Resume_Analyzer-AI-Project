import type { ReactNode } from "react";

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  light = false,
}: {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
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

export function PrimaryButton({
  children,
  href,
  onClick,
  disabled,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
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
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  href,
  onClick,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const cls = `inline-flex items-center justify-center rounded-md border border-[#E6E6E2] bg-white px-5 py-2.5 text-sm font-medium text-[#171717] transition hover:border-[#176B5B]/30 hover:bg-[#E8F3EF] hover:-translate-y-px ${className}`;

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function MatchScore({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-sm" : "text-xl";
  return (
    <span className={`font-semibold tabular-nums text-[#176B5B] ${sizeClass}`}>
      {score}%
    </span>
  );
}

export function ScoreBar({ score }: { score: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E6E6E2]">
      <div
        className="animate-score-fill h-full rounded-full bg-[#176B5B]"
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

export function SkillTag({
  name,
  matched,
}: {
  name: string;
  matched: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium ${
        matched
          ? "border-[#176B5B]/20 bg-[#E8F3EF] text-[#176B5B]"
          : "border-[#E6E6E2] bg-[#F8F8F6] text-[#6B6B6B]"
      }`}
    >
      {name}
      {matched ? (
        <span className="text-[#176B5B]">✓</span>
      ) : (
        <span className="text-[#6B6B6B]">—</span>
      )}
    </span>
  );
}

export function RecommendationBadge({
  label,
}: {
  label: string;
}) {
  const styles: Record<string, string> = {
    "Strong Match": "bg-[#E8F3EF] text-[#176B5B] border-[#176B5B]/20",
    "Good Match": "bg-[#F8F8F6] text-[#171717] border-[#E6E6E2]",
    Consider: "bg-[#F8F8F6] text-[#6B6B6B] border-[#E6E6E2]",
    "Weak Match": "bg-[#F8F8F6] text-[#6B6B6B] border-[#E6E6E2]",
  };

  return (
    <span
      className={`inline-block rounded border px-2.5 py-0.5 text-xs font-medium ${
        styles[label] ?? styles.Consider
      }`}
    >
      {label}
    </span>
  );
}

export function Card({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
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
