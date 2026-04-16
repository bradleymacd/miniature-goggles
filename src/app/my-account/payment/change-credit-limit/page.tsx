"use client";

import { useMemo, useState } from "react";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

const REASONS = [
  "Income change",
  "More flexibility",
  "Big upcoming purchase",
  "Prefer lower limit",
  "Other",
] as const;

function pounds(v: number) {
  return v.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function ChangeCreditLimitPage() {
  const currentLimit = usePrototypeStore((s) => s.balances.creditLimit.pence);
  const submit = usePrototypeStore((s) => s.actions.submitCreditLimitChangeRequest);

  const [requested, setRequested] = useState(Math.max(100000, Math.min(1000000, currentLimit)));
  const [reason, setReason] = useState<(typeof REASONS)[number]>("More flexibility");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const min = 100000; // £1,000
  const max = 1000000; // £10,000
  const isValid = requested >= min && requested <= max;

  const hint = useMemo(
    () => `Requested limit: ${pounds(Math.round(requested / 100))}`,
    [requested],
  );

  if (submittedId) {
    return (
      <div>
        <SubPageHeader title="Change Credit Limit" backHref="/my-account/payment" />
        <Card className="p-4">
          <div className="text-sm font-semibold">Request received</div>
          <div className="mt-2 text-sm text-black/70">
            We’ll be in touch within 48 hours.
          </div>
          <div className="mt-4 rounded border border-black/10 bg-white px-3 py-3 text-xs text-black/60">
            Reference: <span className="font-semibold text-black">{submittedId}</span>
          </div>
          <a
            href="/my-account/payment"
            className="mt-4 block rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white"
          >
            BACK TO PAYMENT
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <SubPageHeader title="Change Credit Limit" backHref="/my-account/payment" />

      <Card className="px-4 py-1">
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Current limit</div>
          <div className="font-semibold">
            {(currentLimit / 100).toLocaleString("en-GB", {
              style: "currency",
              currency: "GBP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </div>
        </div>
        <Divider />
        <div className="py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Requested limit
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={50000}
            value={requested}
            onChange={(e) => setRequested(Number(e.target.value))}
            className="mt-3 w-full"
          />
          <div className="mt-2 text-xs text-black/60">{hint}</div>
        </div>
        <Divider />
        <div className="py-4">
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
          if (!isValid) return;
          const res = submit({ requestedLimitPence: requested, reason });
          setSubmittedId(res.requestId);
        }}
        className="mt-4 w-full rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white disabled:opacity-40"
        disabled={!isValid}
      >
        SUBMIT REQUEST
      </button>
    </div>
  );
}

