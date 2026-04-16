"use client";

import { useMemo } from "react";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 text-sm">
      <div className="text-black/70">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

export default function CreditBreakdownPage() {
  const balances = usePrototypeStore((s) => s.balances);
  const transactions = usePrototypeStore((s) => s.transactions);
  const tx = useMemo(() => transactions.slice(0, 6), [transactions]);

  const pending = { pence: 0, formatted: "£0.00" };

  return (
    <div>
      <SubPageHeader title="View Breakdown" />

      <Card className="px-4 py-1">
        <Row label="Credit Limit" value={balances.creditLimit.formatted} />
        <Divider />
        <Row label="Current Balance" value={balances.currentBalance.formatted} />
        <Divider />
        <Row label="Available to Spend" value={balances.availableToSpend.formatted} />
        <Divider />
        <Row label="Pending Transactions" value={pending.formatted} />
      </Card>

      <div className="mt-5 text-xs font-semibold tracking-wide text-black/70">
        Recent activity
      </div>

      <Card className="mt-2">
        {tx.map((t, idx) => (
          <div key={t.id}>
            <div className="flex items-start justify-between gap-3 px-4 py-4">
              <div className="min-w-0">
                <div className="text-sm font-medium">{t.description}</div>
                <div className="mt-1 text-xs text-black/60">
                  {new Date(t.dateISO).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div className="shrink-0 text-sm font-semibold">
                {t.type === "payment" || t.type === "refund" ? "-" : "+"}
                {t.amount.formatted}
              </div>
            </div>
            {idx < tx.length - 1 ? <Divider /> : null}
          </div>
        ))}
      </Card>
    </div>
  );
}

