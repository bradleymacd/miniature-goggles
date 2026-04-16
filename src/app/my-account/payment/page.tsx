"use client";

import Image from "next/image";
import { Card, Divider, RowLink } from "@/components/my-account/ui";

export default function PaymentPage() {
  return (
    <div className="space-y-4">
      <Card>
        <RowLink title="Make A Payment" href="/my-account/payment/make-a-payment" />
        <Divider />
        <RowLink
          title="Add a New Payment Card"
          href="/my-account/payment/add-card"
        />
        <Divider />
        <RowLink title="Statements" href="/my-account/payment/statements" />
        <Divider />
        <RowLink
          title="Change Credit Limit"
          href="/my-account/payment/change-credit-limit"
        />
        <Divider />
        <RowLink
          title="Credit Limit Preferences"
          href="/my-account/payment/credit-limit-preferences"
        />
        <Divider />
        <RowLink
          title="Recent Transactions"
          href="/my-account/payment/recent-transactions"
        />
      </Card>

      <div className="relative overflow-hidden rounded border border-black/10 bg-black/5">
        <div className="relative aspect-[9/10] w-full">
          <Image
            src="https://images.unsplash.com/photo-1520975688661-1b8f8d8a52ce?auto=format&fit=crop&w=1200&q=60"
            alt="Summer"
            fill
            className="object-cover"
            sizes="(max-width: 430px) 100vw, 430px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
          <div className="absolute bottom-4 left-4 text-3xl font-semibold tracking-[0.22em] text-white">
            SUMMER
          </div>
        </div>
      </div>
    </div>
  );
}

