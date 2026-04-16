import Link from "next/link";
import type { ComponentProps } from "react";

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-1 text-xs font-semibold tracking-wide text-black/70">
      {children}
    </div>
  );
}

export function Divider() {
  return <div className="h-px w-full bg-black/10" />;
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded border border-black/10 bg-white ${className}`}>
      {children}
    </div>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-black/50">
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RowLink({
  title,
  description,
  href,
  right,
}: {
  title: string;
  description?: string;
  href: string;
  right?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-start justify-between gap-3 px-4 py-4"
    >
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        {description ? (
          <div className="mt-1 text-xs leading-5 text-black/60">
            {description}
          </div>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {right}
        <ChevronRight />
      </div>
    </Link>
  );
}

export function Button(
  props: ComponentProps<"button"> & { variant?: "black" | "ghost" },
) {
  const { className = "", variant = "black", ...rest } = props;
  const base =
    "inline-flex items-center justify-center rounded px-4 py-2 text-xs font-semibold tracking-wide";
  const styles =
    variant === "black"
      ? "bg-black text-white"
      : "bg-white text-black border border-black/15";
  return <button className={`${base} ${styles} ${className}`} {...rest} />;
}

