"use client";

import Link from "next/link";
import Image from "next/image";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function ReturnedPage() {
  const returns = usePrototypeStore((s) => s.returns);

  return (
    <div>
      <SubPageHeader title="Returned" backHref="/my-account/orders" />

      <Card>
        {returns.length === 0 ? (
          <div className="px-4 py-4 text-sm text-black/60">No returns yet.</div>
        ) : (
          returns.map((r, idx) => (
            <div key={r.id}>
              <Link
                href={`/my-account/orders/returned/${r.id}`}
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
                    {r.refundStatus} • {r.item.price.formatted}
                  </div>
                </div>
                <div className="text-[11px] font-semibold text-black/60">
                  {new Date(r.createdAtISO).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </Link>
              {idx < returns.length - 1 ? <Divider /> : null}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

