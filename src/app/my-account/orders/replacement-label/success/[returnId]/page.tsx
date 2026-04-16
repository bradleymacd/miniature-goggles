"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function ReplacementLabelSuccessPage() {
  const params = useParams<{ returnId: string }>();
  const returnId = params?.returnId;

  const ret = usePrototypeStore((s) => s.returns.find((r) => r.id === returnId));
  const email = usePrototypeStore((s) => s.user.email);

  if (!returnId || !ret) return notFound();

  return (
    <div>
      <SubPageHeader title="Replacement Label" backHref="/my-account/orders" />
      <Card className="p-4">
        <div className="text-sm font-semibold">Label sent</div>
        <div className="mt-2 text-sm text-black/70">
          We’ve emailed a replacement label to <span className="font-medium">{email}</span>.
        </div>
        <div className="mt-4 rounded border border-black/10 bg-white px-3 py-3 text-xs text-black/60">
          Label reference:{" "}
          <span className="font-semibold text-black">
            {ret.labelReference ?? "—"}
          </span>
        </div>
        <Link
          href="/my-account/orders/returned"
          className="mt-4 block rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white"
        >
          BACK TO RETURNS
        </Link>
      </Card>
    </div>
  );
}

