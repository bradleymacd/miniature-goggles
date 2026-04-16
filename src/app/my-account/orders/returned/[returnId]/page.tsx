"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function ReturnedDetailPage() {
  const params = useParams<{ returnId: string }>();
  const returnId = params?.returnId;

  const ret = usePrototypeStore((s) => s.returns.find((r) => r.id === returnId));
  const email = usePrototypeStore((s) => s.user.email);

  if (!ret) return notFound();

  return (
    <div>
      <SubPageHeader title="Return Details" backHref="/my-account/orders/returned" />

      <Card className="p-4">
        <div className="flex gap-3">
          <div className="relative h-16 w-16 overflow-hidden rounded bg-black/5">
            <Image
              src={ret.item.imageUrl}
              alt={ret.item.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">{ret.item.name}</div>
            <div className="mt-1 text-xs text-black/60">
              Order {ret.orderId.replace("ord_", "#")} • {ret.item.price.formatted}
            </div>
          </div>
        </div>
      </Card>

      <Card className="mt-4 px-4 py-1">
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Return method</div>
          <div className="font-medium">{ret.method}</div>
        </div>
        <Divider />
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Reason</div>
          <div className="font-medium">{ret.reason}</div>
        </div>
        <Divider />
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Refund status</div>
          <div className="font-medium">{ret.refundStatus}</div>
        </div>
        <Divider />
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Return label</div>
          <div className="font-medium">
            {ret.labelReference ? ret.labelReference : "Not received"}
          </div>
        </div>
      </Card>

      {!ret.labelReference ? (
        <div className="mt-3 text-xs text-black/60">
          If you haven’t received your label, you can request a replacement and
          we’ll email it to <span className="font-medium">{email}</span>.
        </div>
      ) : null}
    </div>
  );
}

