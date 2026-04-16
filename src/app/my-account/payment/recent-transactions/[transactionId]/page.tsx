"use client";

import { notFound, useParams } from "next/navigation";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function TransactionDetailPage() {
  const params = useParams<{ transactionId: string }>();
  const transactionId = params?.transactionId;

  const t = usePrototypeStore((s) =>
    s.transactions.find((tx) => tx.id === transactionId),
  );

  if (!transactionId || !t) return notFound();

  return (
    <div>
      <SubPageHeader title="Transaction" backHref="/my-account/payment/recent-transactions" />

      <Card className="px-4 py-1">
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Description</div>
          <div className="font-medium">{t.description}</div>
        </div>
        <Divider />
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Date</div>
          <div className="font-medium">
            {new Date(t.dateISO).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <Divider />
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Type</div>
          <div className="font-medium">
            {t.type === "purchase"
              ? "Purchase"
              : t.type === "payment"
                ? "Payment"
                : "Refund"}
          </div>
        </div>
        <Divider />
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Amount</div>
          <div className="font-semibold">
            {t.type === "payment" || t.type === "refund" ? "-" : "+"}
            {t.amount.formatted}
          </div>
        </div>
        <Divider />
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Running balance</div>
          <div className="font-semibold">{t.runningBalance.formatted}</div>
        </div>
      </Card>
    </div>
  );
}

