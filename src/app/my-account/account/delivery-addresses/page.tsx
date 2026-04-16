"use client";

import Link from "next/link";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function DeliveryAddressesPage() {
  const addresses = usePrototypeStore((s) => s.addresses);
  const defaultId = usePrototypeStore((s) => s.user.defaultDeliveryAddressId);

  return (
    <div>
      <SubPageHeader title="Delivery Addresses" backHref="/my-account/account" />

      <Card>
        {addresses.map((a, idx) => (
          <div key={a.id}>
            <Link
              href={`/my-account/account/delivery-addresses/${a.id}`}
              className="block px-4 py-4"
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{a.label}</div>
                {a.id === defaultId ? (
                  <div className="rounded bg-black px-2 py-1 text-[10px] font-semibold tracking-wide text-white">
                    DEFAULT
                  </div>
                ) : null}
              </div>
              <div className="mt-2 text-sm text-black/70">
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ""}
              </div>
              <div className="mt-1 text-sm text-black/70">
                {a.town}, {a.postcode}
              </div>
            </Link>
            {idx < addresses.length - 1 ? <Divider /> : null}
          </div>
        ))}
      </Card>

      <Link
        href="/my-account/account/add-address"
        className="mt-4 block rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white"
      >
        ADD NEW ADDRESS
      </Link>
    </div>
  );
}

