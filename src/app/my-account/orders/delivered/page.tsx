"use client";

import Link from "next/link";
import { useMemo } from "react";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function DeliveredOrdersPage() {
  const orders = usePrototypeStore((s) => s.orders);
  const delivered = useMemo(
    () => orders.filter((o) => o.status === "delivered"),
    [orders],
  );

  return (
    <div>
      <SubPageHeader title="Delivered" backHref="/my-account/orders" />

      <Card>
        {delivered.length === 0 ? (
          <div className="px-4 py-4 text-sm text-black/60">
            No delivered orders.
          </div>
        ) : (
          delivered.map((o, idx) => (
            <div key={o.id}>
              <Link
                href={`/my-account/orders/order/${o.id}`}
                className="block px-4 py-4"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Delivered</div>
                  <div className="text-sm font-semibold">{o.total.formatted}</div>
                </div>
                <div className="mt-1 text-xs text-black/60">
                  Order {o.id.replace("ord_", "#")} •{" "}
                  {o.deliveredAtISO
                    ? new Date(o.deliveredAtISO).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </div>
              </Link>
              {idx < delivered.length - 1 ? <Divider /> : null}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

