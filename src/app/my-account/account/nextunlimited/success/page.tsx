"use client";

import Link from "next/link";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card } from "@/components/my-account/ui";

export default function NextUnlimitedSuccessPage() {
  return (
    <div>
      <SubPageHeader title="Nextunlimited" backHref="/my-account/account" />
      <Card className="p-4">
        <div className="text-sm font-semibold">You’re in</div>
        <div className="mt-2 text-sm text-black/70">
          Your Nextunlimited annual pass is now active.
        </div>
        <Link
          href="/my-account/overview"
          className="mt-4 block rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white"
        >
          GO TO OVERVIEW
        </Link>
      </Card>
    </div>
  );
}

