"use client";

import Link from "next/link";
import { useMemo } from "react";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function ExpectedOrdersPage() {
  const orders = usePrototypeStore((s) => s.orders);
  const expected = useMemo(
    () => orders.filter((o) => o.status === "expected"),
    [orders],
  );

  return (
    <div>
      <SubPageHeader title="Expected" backHref="/my-account/orders" />

      <Card>
        {expected.length === 0 ? (
          <div className="px-4 py-4 text-sm text-black/60">
            No expected orders.
          </div>
        ) : (
          expected.map((o, idx) => (
            <div key={o.id}>
              <Link
                href={`/my-account/orders/order/${o.id}`}
                className="block px-4 py-4"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{o.statusLabel}</div>
                  <div className="text-sm font-semibold">{o.total.formatted}</div>
                </div>
                <div className="mt-1 text-xs text-black/60">
                  Order {o.id.replace("ord_", "#")} •{" "}
                  {new Date(o.placedAtISO).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </Link>
              {idx < expected.length - 1 ? <Divider /> : null}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

