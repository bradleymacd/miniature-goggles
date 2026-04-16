"use client";

import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

const SIZES = ["6", "8", "10", "12", "14", "16"] as const;

export default function ProductDetailPage() {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId;

  const product = usePrototypeStore((s) =>
    s.recentlyViewed.find((p) => p.id === productId),
  );
  const incBag = usePrototypeStore((s) => s.actions.incrementBag);

  const [size, setSize] = useState<(typeof SIZES)[number]>("10");
  const [added, setAdded] = useState(false);

  const title = useMemo(() => product?.name ?? "Product", [product?.name]);
  if (!productId || !product) return notFound();

  return (
    <div>
      <SubPageHeader title={title} backHref="/my-account/account" />

      <Card>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t bg-black/5">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 430px) 100vw, 430px"
          />
        </div>
        <div className="px-4 py-4">
          <div className="text-sm font-semibold">{product.name}</div>
          <div className="mt-2 text-lg font-semibold">{product.price.formatted}</div>
        </div>
        <Divider />
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Size
          </div>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as (typeof SIZES)[number])}
            className="mt-2 w-full rounded border border-black/15 bg-white px-3 py-2 text-sm"
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {added ? (
            <div className="mt-2 text-xs text-black/60">
              Added size {size} to bag.
            </div>
          ) : null}
        </div>
      </Card>

      <button
        type="button"
        onClick={() => {
          incBag(1);
          setAdded(true);
        }}
        className="mt-4 w-full rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white"
      >
        ADD TO BAG
      </button>
    </div>
  );
}

