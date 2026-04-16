"use client";

import Link from "next/link";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function MakePaymentSuccessPage() {
  const latestPayment = usePrototypeStore((s) =>
    s.transactions.find((t) => t.type === "payment"),
  );
  const balance = usePrototypeStore((s) => s.balances.currentBalance);

  return (
    <div>
      <SubPageHeader title="Payment" backHref="/my-account/overview" />
      <Card className="p-4">
        <div className="text-sm font-semibold">Payment successful</div>
        <div className="mt-2 text-sm text-black/70">
          Your payment has been applied to your account.
        </div>
        <div className="mt-4 rounded border border-black/10 bg-white px-3 py-3 text-xs text-black/60">
          <div className="flex items-center justify-between">
            <div>New balance</div>
            <div className="font-semibold text-black">{balance.formatted}</div>
          </div>
          {latestPayment ? (
            <div className="mt-2 flex items-center justify-between">
              <div>Payment</div>
              <div className="font-semibold text-black">
                -{latestPayment.amount.formatted}
              </div>
            </div>
          ) : null}
        </div>
        <Link
          href="/my-account/overview"
          className="mt-4 block rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white"
        >
          BACK TO OVERVIEW
        </Link>
      </Card>
    </div>
  );
}

