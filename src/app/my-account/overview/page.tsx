"use client";

import Link from "next/link";
import { Card, Divider, RowLink, SectionTitle } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

function CreditUsageBar({
  usedPence,
  limitPence,
}: {
  usedPence: number;
  limitPence: number;
}) {
  const pct = Math.max(0, Math.min(1, usedPence / limitPence));
  return (
    <div className="mt-3">
      <div className="h-2 w-full rounded-full bg-black/10">
        <div
          className="h-2 rounded-full bg-black"
          style={{ width: `${pct * 100}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-black/60">
        <div>£0</div>
        <div>£5,000 Credit Limit</div>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const nextUnlimitedMember = usePrototypeStore((s) => s.user.nextUnlimitedMember);
  const balances = usePrototypeStore((s) => s.balances);
  const recentOrder = usePrototypeStore((s) =>
    s.orders.find((o) => o.status === "order_received"),
  );

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold">Request A Call Back</div>
            <div className="mt-1 text-xs leading-5 text-black/60">
              Can’t wait? No problem.
            </div>
          </div>
          <Link
            href="/my-account/overview/request-callback"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded bg-black px-4 text-[11px] font-semibold tracking-wide text-white"
          >
            CALL ME
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Current Balance
          </div>
          <div className="mt-2 text-lg font-semibold">
            {balances.currentBalance.formatted}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Available to Spend
          </div>
          <div className="mt-2 text-lg font-semibold">
            {balances.availableToSpend.formatted}
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Credit usage
          </div>
          <Link
            href="/my-account/overview/credit-breakdown"
            className="inline-flex items-center justify-center rounded border border-black/15 bg-white px-3 py-2 text-[11px] font-semibold tracking-wide"
          >
            VIEW BREAKDOWN
          </Link>
        </div>
        <CreditUsageBar
          usedPence={balances.currentBalance.pence}
          limitPence={balances.creditLimit.pence}
        />
      </Card>

      <Card>
        <div className="px-4 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-black/70">Account Status</div>
            <div className="font-medium">No Payment Required</div>
          </div>
        </div>
        <Divider />
        <div className="px-4 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-black/70">Last payment received</div>
            <div className="font-medium">8th Jan, £98.00</div>
          </div>
        </div>
      </Card>

      {nextUnlimitedMember ? (
        <div className="text-xs font-semibold tracking-wide text-black/70">
          NEXT UNLIMITED MEMBER
        </div>
      ) : null}

      <Link
        href="/my-account/payment/make-a-payment"
        className="block rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white"
      >
        MAKE A PAYMENT
      </Link>

      <div className="flex items-end justify-between">
        <SectionTitle>My Recent Orders</SectionTitle>
        <Link
          href="/my-account/orders"
          className="text-[11px] font-semibold tracking-wide text-black/60"
        >
          View All
        </Link>
      </div>

      <Card>
        {recentOrder ? (
          <>
            <RowLink
              title="Order Received"
              description={`Planned for delivery to LE19 4AT on Sat 12th Jan • ${recentOrder.items.reduce(
                (sum, i) => sum + i.qty,
                0,
              )} items`}
              href={`/my-account/overview/order/${recentOrder.id}`}
              right={
                <div className="text-[11px] font-semibold text-black/60">
                  11th Jan
                </div>
              }
            />
          </>
        ) : (
          <div className="px-4 py-4 text-sm text-black/60">No recent orders.</div>
        )}
      </Card>
    </div>
  );
}

