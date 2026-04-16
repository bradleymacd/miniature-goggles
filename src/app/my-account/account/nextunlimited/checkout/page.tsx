"use client";

import { useRouter } from "next/navigation";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function NextUnlimitedCheckoutPage() {
  const router = useRouter();
  const subscribe = usePrototypeStore((s) => s.actions.subscribeNextUnlimited);
  const defaultCard = usePrototypeStore(
    (s) => s.paymentCards.find((c) => c.isDefault) ?? s.paymentCards[0],
  );

  return (
    <div>
      <SubPageHeader title="Checkout" backHref="/my-account/account/nextunlimited" />

      <Card className="px-4 py-1">
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Annual pass</div>
          <div className="font-semibold">£22.50</div>
        </div>
        <Divider />
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Payment method</div>
          <div className="font-medium">
            {defaultCard ? `${defaultCard.brand} •••• ${defaultCard.last4}` : "—"}
          </div>
        </div>
      </Card>

      <button
        type="button"
        onClick={() => {
          subscribe();
          router.push("/my-account/account/nextunlimited/success");
        }}
        className="mt-4 w-full rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white"
      >
        CONFIRM PURCHASE
      </button>
    </div>
  );
}

