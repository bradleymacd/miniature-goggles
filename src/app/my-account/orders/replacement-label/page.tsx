"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function ReplacementLabelPage() {
  const returns = usePrototypeStore((s) => s.returns);
  const missing = useMemo(() => returns.filter((r) => !r.labelReference), [returns]);

  return (
    <div>
      <SubPageHeader title="Replacement Label" backHref="/my-account/orders" />

      <Card>
        {missing.length === 0 ? (
          <div className="px-4 py-4 text-sm text-black/60">
            No returns are missing a label.
          </div>
        ) : (
          missing.map((r, idx) => (
            <div key={r.id}>
              <Link
                href={`/my-account/orders/replacement-label/${r.id}`}
                className="flex gap-3 px-4 py-4"
              >
                <div className="relative h-14 w-14 overflow-hidden rounded bg-black/5">
                  <Image
                    src={r.item.imageUrl}
                    alt={r.item.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{r.item.name}</div>
                  <div className="mt-1 text-xs text-black/60">
                    Order {r.orderId.replace("ord_", "#")} • {r.item.price.formatted}
                  </div>
                </div>
                <div className="text-[11px] font-semibold text-black/60">Request</div>
              </Link>
              {idx < missing.length - 1 ? <Divider /> : null}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

