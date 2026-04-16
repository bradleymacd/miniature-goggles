"use client";

import { useMemo, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";
import type { CollectionBooking } from "@/store/seed";

const TIME_SLOTS: CollectionBooking["timeSlot"][] = [
  "08:00 - 12:00",
  "12:00 - 16:00",
  "16:00 - 20:00",
];

function next7DaysISO() {
  const out: string[] = [];
  const now = new Date();
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    d.setHours(0, 0, 0, 0);
    out.push(d.toISOString());
  }
  return out;
}

export default function PickCollectionSlotPage() {
  const router = useRouter();
  const params = useParams<{ orderId: string }>();
  const orderId = params?.orderId;

  const order = usePrototypeStore((s) => s.orders.find((o) => o.id === orderId));
  const schedule = usePrototypeStore((s) => s.actions.scheduleCollection);

  const dates = useMemo(() => next7DaysISO(), []);
  const [dateISO, setDateISO] = useState(dates[0] ?? new Date().toISOString());
  const [timeSlot, setTimeSlot] = useState<CollectionBooking["timeSlot"]>(TIME_SLOTS[0]);

  if (!orderId || !order) return notFound();

  return (
    <div>
      <SubPageHeader title="Arrange A Collection" backHref="/my-account/orders/arrange-a-collection" />

      <Card className="px-4 py-1">
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Order</div>
          <div className="font-medium">{orderId.replace("ord_", "#")}</div>
        </div>
        <Divider />
        <div className="py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Pick a date
          </div>
          <select
            value={dateISO}
            onChange={(e) => setDateISO(e.target.value)}
            className="mt-2 w-full rounded border border-black/15 bg-white px-3 py-2 text-sm"
          >
            {dates.map((d) => (
              <option key={d} value={d}>
                {new Date(d).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </option>
            ))}
          </select>
        </div>
        <Divider />
        <div className="py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Pick a time slot
          </div>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value as CollectionBooking["timeSlot"])}
            className="mt-2 w-full rounded border border-black/15 bg-white px-3 py-2 text-sm"
          >
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <button
        type="button"
        onClick={() => {
          schedule({ orderId, dateISO, timeSlot });
          router.push("/my-account/orders/arrange-a-collection");
        }}
        className="mt-4 w-full rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white"
      >
        CONFIRM COLLECTION
      </button>
    </div>
  );
}

