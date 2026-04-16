"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function ReturnAnItemPage() {
  const orders = usePrototypeStore((s) => s.orders);
  const deliveredOrders = useMemo(
    () => orders.filter((o) => o.status === "delivered" && o.items.length > 0),
    [orders],
  );

  const items = deliveredOrders.flatMap((o) =>
    o.items.map((it) => ({ orderId: o.id, orderPlacedAtISO: o.placedAtISO, it })),
  );

  return (
    <div>
      <SubPageHeader title="Return An Item" backHref="/my-account/orders" />

      <Card>
        {items.length === 0 ? (
          <div className="px-4 py-4 text-sm text-black/60">
            No delivered items available to return.
          </div>
        ) : (
          items.map(({ orderId, it }, idx) => (
            <div key={`${orderId}:${it.id}`}>
              <Link
                href={`/my-account/orders/return-an-item/${orderId}/${it.id}`}
                className="flex gap-3 px-4 py-4"
              >
                <div className="relative h-14 w-14 overflow-hidden rounded bg-black/5">
                  <Image
                    src={it.imageUrl}
                    alt={it.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{it.name}</div>
                  <div className="mt-1 text-xs text-black/60">
                    {it.price.formatted}
                    {it.size ? ` • ${it.size}` : ""} • Order{" "}
                    {orderId.replace("ord_", "#")}
                  </div>
                </div>
                <div className="text-[11px] font-semibold text-black/60">
                  Select
                </div>
              </Link>
              {idx < items.length - 1 ? <Divider /> : null}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

