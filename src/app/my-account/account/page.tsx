"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, Divider, RowLink, SectionTitle } from "@/components/my-account/ui";
import { IconExit } from "@/components/my-account/icons";
import { usePrototypeStore } from "@/store/usePrototypeStore";

function Thumb({
  href,
  imageUrl,
  price,
}: {
  href: string;
  imageUrl: string;
  price: string;
}) {
  return (
    <Link href={href} className="w-[110px] shrink-0">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded bg-black/5">
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="110px"
        />
      </div>
      <div className="mt-2 text-xs font-semibold">{price}</div>
      <div className="mt-1 text-[11px] text-black/50">Today</div>
    </Link>
  );
}

export default function AccountPage() {
  const isSignedIn = usePrototypeStore((s) => s.isSignedIn);
  const recentlyViewed = usePrototypeStore((s) => s.recentlyViewed);

  if (!isSignedIn) {
    return (
      <div className="space-y-4">
        <Card className="p-4">
          <div className="text-sm font-semibold">You’re signed out</div>
          <div className="mt-2 text-sm text-black/70">
            Sign back in to continue where you left off.
          </div>
          <Link
            href="/my-account/account/sign-in"
            className="mt-4 block rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white"
          >
            SIGN BACK IN
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <RowLink title="Sign In Details" href="/my-account/account/sign-in-details" />
        <Divider />
        <RowLink title="Contact Details" href="/my-account/account/contact-details" />
        <Divider />
        <RowLink
          title="2-Factor Authentication"
          href="/my-account/account/two-factor"
        />
        <Divider />
        <RowLink
          title="Delivery Addresses"
          href="/my-account/account/delivery-addresses"
        />
        <Divider />
        <RowLink
          title="Add New Delivery Address"
          href="/my-account/account/add-address"
        />
        <Divider />
        <RowLink
          title="Subscribe To Nextunlimited"
          href="/my-account/account/nextunlimited"
        />
        <Divider />
        <RowLink
          title="Sign Out"
          href="/my-account/account/sign-out"
          right={<IconExit className="h-4 w-4 text-black/60" />}
        />
      </Card>

      <div className="flex items-end justify-between">
        <SectionTitle>Recently Viewed</SectionTitle>
        <Link
          href="/my-account/account/recently-viewed/clear"
          className="text-[11px] font-semibold tracking-wide text-black/60"
        >
          Clear History
        </Link>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
        {recentlyViewed.length === 0 ? (
          <Card className="w-full p-4 text-sm text-black/60">
            No recently viewed items.
          </Card>
        ) : (
          recentlyViewed.slice(0, 6).map((p) => (
            <Thumb
              key={p.id}
              href={`/my-account/account/product/${p.id}`}
              imageUrl={p.imageUrl}
              price={p.price.formatted}
            />
          ))
        )}
      </div>
    </div>
  );
}

