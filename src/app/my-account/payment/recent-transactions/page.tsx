"use client";

import Link from "next/link";
import { useMemo } from "react";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function RecentTransactionsPage() {
  const transactions = usePrototypeStore((s) => s.transactions);
  const tx = useMemo(() => transactions.slice(0, 20), [transactions]);

  return (
    <div>
      <SubPageHeader title="Recent Transactions" backHref="/my-account/payment" />

      <Card>
        {tx.map((t, idx) => (
          <div key={t.id}>
            <Link
              href={`/my-account/payment/recent-transactions/${t.id}`}
              className="block px-4 py-4"
            >
              <div className="flex items-start justify-between gap-3">
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
              <div className="mt-2 text-xs text-black/50">
                Running balance: {t.runningBalance.formatted}
              </div>
            </Link>
            {idx < tx.length - 1 ? <Divider /> : null}
          </div>
        ))}
      </Card>
    </div>
  );
}

