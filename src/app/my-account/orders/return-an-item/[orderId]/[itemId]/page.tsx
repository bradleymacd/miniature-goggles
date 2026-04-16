"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";
import type { ReturnMethod, ReturnReason } from "@/store/seed";

const REASONS: ReturnReason[] = [
  "Wrong size",
  "Not as described",
  "Changed mind",
  "Faulty",
  "Other",
];

const METHODS: ReturnMethod[] = ["Post", "Collection"];

export default function ReturnFlowPage() {
  const router = useRouter();
  const params = useParams<{ orderId: string; itemId: string }>();
  const orderId = params?.orderId;
  const itemId = params?.itemId;

  const order = usePrototypeStore((s) => s.orders.find((o) => o.id === orderId));
  const item = useMemo(() => order?.items.find((i) => i.id === itemId), [order, itemId]);
  const createReturn = usePrototypeStore((s) => s.actions.createReturn);

  const [reason, setReason] = useState<ReturnReason>("Wrong size");
  const [method, setMethod] = useState<ReturnMethod>("Post");
  const [submitting, setSubmitting] = useState(false);

  if (!orderId || !itemId || !order || !item) return notFound();

  return (
    <div>
      <SubPageHeader title="Return An Item" backHref="/my-account/orders/return-an-item" />

      <Card className="p-4">
        <div className="flex gap-3">
          <div className="relative h-16 w-16 overflow-hidden rounded bg-black/5">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">{item.name}</div>
            <div className="mt-1 text-xs text-black/60">
              {item.price.formatted}
              {item.size ? ` • ${item.size}` : ""} • Order {orderId.replace("ord_", "#")}
            </div>
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Reason for return
          </div>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value as ReturnReason)}
            className="mt-2 w-full rounded border border-black/15 bg-white px-3 py-2 text-sm"
          >
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <Divider />
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Return method
          </div>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as ReturnMethod)}
            className="mt-2 w-full rounded border border-black/15 bg-white px-3 py-2 text-sm"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <div className="mt-2 text-xs text-black/60">
            {method === "Post"
              ? "We’ll provide a return label reference after confirmation."
              : "You’ll be able to arrange a collection from your address after confirmation."}
          </div>
        </div>
      </Card>

      <button
        type="button"
        onClick={() => {
          if (submitting) return;
          setSubmitting(true);
          const res = createReturn({ orderId, itemId, reason, method });
          if ("error" in res) {
            setSubmitting(false);
            return;
          }
          router.push(`/my-account/orders/return-an-item/confirmation/${res.returnId}`);
        }}
        className="mt-4 w-full rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white disabled:opacity-40"
        disabled={submitting}
      >
        CONFIRM RETURN
      </button>
    </div>
  );
}

