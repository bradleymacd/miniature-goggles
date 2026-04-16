"use client";

import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function OrderDetailPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId;

  const order = usePrototypeStore((s) => s.orders.find((o) => o.id === orderId));
  const address = usePrototypeStore((s) =>
    order ? s.addresses.find((a) => a.id === order.deliveryAddressId) : undefined,
  );

  if (!order) return notFound();

  const statusSteps = [
    { label: "Order Received", active: true },
    { label: "Expected", active: Boolean(order.expectedAtISO) },
    { label: "Delivered", active: Boolean(order.deliveredAtISO) },
  ];

  return (
    <div>
      <SubPageHeader title="Order Details" backHref="/my-account/overview" />

      <Card className="p-4">
        <div className="text-xs font-semibold tracking-wide text-black/60">
          Order {order.id.replace("ord_", "#")}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-sm font-semibold">{order.statusLabel}</div>
          <div className="text-sm font-semibold">{order.total.formatted}</div>
        </div>
        <div className="mt-2 text-xs text-black/60">
          Placed{" "}
          {new Date(order.placedAtISO).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </Card>

      <div className="mt-5 text-xs font-semibold tracking-wide text-black/70">
        Tracking
      </div>
      <Card className="mt-2 px-4 py-1">
        {statusSteps.map((s, idx) => (
          <div key={s.label}>
            <div className="flex items-center justify-between py-3 text-sm">
              <div className={s.active ? "font-medium" : "text-black/50"}>
                {s.label}
              </div>
              <div className="text-black/60">
                {s.label === "Expected" && order.expectedAtISO
                  ? formatDate(order.expectedAtISO)
                  : s.label === "Delivered" && order.deliveredAtISO
                    ? formatDate(order.deliveredAtISO)
                    : ""}
              </div>
            </div>
            {idx < statusSteps.length - 1 ? <Divider /> : null}
          </div>
        ))}
      </Card>

      <div className="mt-5 text-xs font-semibold tracking-wide text-black/70">
        Items
      </div>
      <Card className="mt-2">
        {order.items.map((it, idx) => (
          <div key={it.id}>
            <div className="flex gap-3 px-4 py-4">
              <div className="relative h-16 w-16 overflow-hidden rounded bg-black/5">
                <Image
                  src={it.imageUrl}
                  alt={it.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{it.name}</div>
                <div className="mt-1 text-xs text-black/60">
                  Qty {it.qty}
                  {it.size ? ` • ${it.size}` : ""} • {it.price.formatted}
                </div>
              </div>
              <div className="text-sm font-semibold">{it.price.formatted}</div>
            </div>
            {idx < order.items.length - 1 ? <Divider /> : null}
          </div>
        ))}
      </Card>

      <div className="mt-5 text-xs font-semibold tracking-wide text-black/70">
        Delivery address
      </div>
      <Card className="mt-2 px-4 py-4 text-sm text-black/70">
        {address ? (
          <div className="space-y-0.5">
            <div className="font-medium text-black">{address.label}</div>
            <div>{address.line1}</div>
            {address.line2 ? <div>{address.line2}</div> : null}
            <div>{address.town}</div>
            <div>{address.postcode}</div>
            <div>{address.country}</div>
          </div>
        ) : (
          <div>Address not available.</div>
        )}
      </Card>
    </div>
  );
}

