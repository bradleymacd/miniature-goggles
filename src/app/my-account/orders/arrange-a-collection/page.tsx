"use client";

import Link from "next/link";
import { useMemo } from "react";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function ArrangeCollectionPage() {
  const orders = usePrototypeStore((s) => s.orders);
  const delivered = useMemo(
    () => orders.filter((o) => o.status === "delivered"),
    [orders],
  );
  const scheduled = usePrototypeStore((s) => s.collections);

  return (
    <div>
      <SubPageHeader title="Arrange A Collection" backHref="/my-account/orders" />

      {scheduled.length > 0 ? (
        <div className="mb-3 text-xs font-semibold tracking-wide text-black/70">
          Scheduled Collections
        </div>
      ) : null}

      {scheduled.length > 0 ? (
        <Card className="mb-4">
          {scheduled.map((c, idx) => (
            <div key={c.id}>
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    Order {c.orderId.replace("ord_", "#")}
                  </div>
                  <div className="text-[11px] font-semibold text-black/60">
                    {c.status}
                  </div>
                </div>
                <div className="mt-1 text-xs text-black/60">
                  {new Date(c.dateISO).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  • {c.timeSlot}
                </div>
              </div>
              {idx < scheduled.length - 1 ? <Divider /> : null}
            </div>
          ))}
        </Card>
      ) : null}

      <Card>
        {delivered.length === 0 ? (
          <div className="px-4 py-4 text-sm text-black/60">
            No eligible delivered orders for collection.
          </div>
        ) : (
          delivered.map((o, idx) => (
            <div key={o.id}>
              <Link
                href={`/my-account/orders/arrange-a-collection/${o.id}`}
                className="block px-4 py-4"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    Order {o.id.replace("ord_", "#")}
                  </div>
                  <div className="text-sm font-semibold">{o.total.formatted}</div>
                </div>
                <div className="mt-1 text-xs text-black/60">
                  Delivered{" "}
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

