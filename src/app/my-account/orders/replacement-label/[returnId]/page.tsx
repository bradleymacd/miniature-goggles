"use client";

import { useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

const REASONS = ["Lost label", "Never received", "Other"] as const;

export default function ReplacementLabelRequestPage() {
  const router = useRouter();
  const params = useParams<{ returnId: string }>();
  const returnId = params?.returnId;

  const ret = usePrototypeStore((s) => s.returns.find((r) => r.id === returnId));
  const request = usePrototypeStore((s) => s.actions.requestReplacementLabel);
  const email = usePrototypeStore((s) => s.user.email);

  const [reason, setReason] = useState<(typeof REASONS)[number]>("Never received");
  const [submitting, setSubmitting] = useState(false);

  if (!returnId || !ret) return notFound();

  return (
    <div>
      <SubPageHeader title="Replacement Label" backHref="/my-account/orders/replacement-label" />

      <Card>
        <div className="px-4 py-4">
          <div className="text-sm font-semibold">{ret.item.name}</div>
          <div className="mt-1 text-xs text-black/60">
            We’ll email a replacement label to <span className="font-medium">{email}</span>.
          </div>
        </div>
        <Divider />
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Reason
          </div>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as (typeof REASONS)[number])}
            className="mt-2 w-full rounded border border-black/15 bg-white px-3 py-2 text-sm"
          >
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <button
        type="button"
        onClick={() => {
          if (submitting) return;
          setSubmitting(true);
          const res = request({ returnId, reason });
          if ("error" in res) {
            setSubmitting(false);
            return;
          }
          router.push(`/my-account/orders/replacement-label/success/${returnId}`);
        }}
        className="mt-4 w-full rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white disabled:opacity-40"
        disabled={submitting}
      >
        SEND LABEL
      </button>
    </div>
  );
}

