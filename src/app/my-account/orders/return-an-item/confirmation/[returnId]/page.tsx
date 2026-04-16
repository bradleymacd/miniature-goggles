"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function ReturnConfirmationPage() {
  const params = useParams<{ returnId: string }>();
  const returnId = params?.returnId;
  const ret = usePrototypeStore((s) => s.returns.find((r) => r.id === returnId));
  const email = usePrototypeStore((s) => s.user.email);

  if (!returnId || !ret) return notFound();

  return (
    <div>
      <SubPageHeader title="Return Confirmed" backHref="/my-account/orders" />

      <Card className="p-4">
        <div className="text-sm font-semibold">Return set up</div>
        <div className="mt-2 text-sm text-black/70">
          Your return has been created for <span className="font-medium">{ret.item.name}</span>.
        </div>

        {ret.method === "Post" ? (
          <div className="mt-4 rounded border border-black/10 bg-white px-3 py-3 text-xs text-black/60">
            <div className="flex items-center justify-between">
              <div>Return label reference</div>
              <div className="font-semibold text-black">
                {ret.labelReference ?? "—"}
              </div>
            </div>
            <div className="mt-2">
              Use this reference at the Post Office. We’ll also email the details to{" "}
              <span className="font-medium">{email}</span>.
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded border border-black/10 bg-white px-3 py-3 text-xs text-black/60">
            You chose collection. You can arrange a date/time from the Orders menu.
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link
            href="/my-account/orders/returned"
            className="block rounded border border-black/15 bg-white px-4 py-3 text-center text-xs font-semibold tracking-wide"
          >
            VIEW RETURNS
          </Link>
          <Link
            href="/my-account/orders/delivered"
            className="block rounded bg-black px-4 py-3 text-center text-xs font-semibold tracking-wide text-white"
          >
            BACK TO DELIVERED
          </Link>
        </div>
      </Card>
    </div>
  );
}

