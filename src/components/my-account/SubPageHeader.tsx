"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SubPageHeader({
  title,
  backHref,
}: {
  title: string;
  backHref?: string;
}) {
  const pathname = usePathname();
  const inferredBack =
    pathname?.startsWith("/my-account/overview") ? "/my-account/overview" : "/";

  return (
    <div className="mb-4 flex items-center gap-2">
      <Link
        href={backHref ?? inferredBack}
        className="grid h-9 w-9 place-items-center rounded-full text-black/80"
        aria-label="Back"
      >
        <ChevronLeft />
      </Link>
      <div className="text-sm font-semibold tracking-wide">{title}</div>
    </div>
  );
}

