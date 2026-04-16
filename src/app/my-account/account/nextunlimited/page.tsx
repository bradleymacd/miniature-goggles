"use client";

import Link from "next/link";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function NextUnlimitedPage() {
  const isMember = usePrototypeStore((s) => s.user.nextUnlimitedMember);

  return (
    <div>
      <SubPageHeader title="Nextunlimited" backHref="/my-account/account" />

      <Card className="p-4">
        <div className="text-sm font-semibold">Nextunlimited</div>
        <div className="mt-2 text-sm text-black/70">
          Unlock unlimited free delivery across Fashion, Brands &amp; Beauty with
          no minimum spend.
        </div>
      </Card>

      <div className="mt-5 text-xs font-semibold tracking-wide text-black/70">
        Benefits
      </div>
      <Card className="mt-2 px-4 py-1">
        {[
          "Unlimited free delivery",
          "Priority access to offers",
          "Easy returns",
          "Member-only perks",
        ].map((b, idx, arr) => (
          <div key={b}>
            <div className="py-3 text-sm">{b}</div>
            {idx < arr.length - 1 ? <Divider /> : null}
          </div>
        ))}
      </Card>

      {isMember ? (
        <Card className="mt-4 p-4">
          <div className="text-sm font-semibold">You’re a member</div>
          <div className="mt-2 text-sm text-black/70">
            Your Nextunlimited membership is active.
          </div>
          <Link
            href="/my-account/overview"
            className="mt-4 block rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white"
          >
            BACK TO OVERVIEW
          </Link>
        </Card>
      ) : (
        <Link
          href="/my-account/account/nextunlimited/checkout"
          className="mt-4 block rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white"
        >
          GET ANNUAL PASS £22.50
        </Link>
      )}
    </div>
  );
}

