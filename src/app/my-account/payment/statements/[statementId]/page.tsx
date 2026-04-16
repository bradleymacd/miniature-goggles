"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function StatementDetailPage() {
  const params = useParams<{ statementId: string }>();
  const statementId = params?.statementId;

  const statement = usePrototypeStore((s) =>
    s.statements.find((st) => st.id === statementId),
  );

  if (!statementId || !statement) return notFound();

  return (
    <div>
      <SubPageHeader title={statement.monthLabel} backHref="/my-account/payment/statements" />

      <Card className="px-4 py-1">
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Opening balance</div>
          <div className="font-medium">{statement.openingBalance.formatted}</div>
        </div>
        <Divider />
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Closing balance</div>
          <div className="font-semibold">{statement.closingBalance.formatted}</div>
        </div>
      </Card>

      <div className="mt-5 text-xs font-semibold tracking-wide text-black/70">
        Transactions
      </div>
      <Card className="mt-2">
        {statement.transactions.length === 0 ? (
          <div className="px-4 py-4 text-sm text-black/60">
            No transactions on this statement.
          </div>
        ) : (
          statement.transactions.map((t, idx) => (
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
              </Link>
              {idx < statement.transactions.length - 1 ? <Divider /> : null}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

