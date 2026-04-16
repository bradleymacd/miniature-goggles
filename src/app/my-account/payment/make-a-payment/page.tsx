"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

function poundsToPence(v: string) {
  const cleaned = v.replace(/[^\d.]/g, "");
  if (!cleaned) return 0;
  const num = Number.parseFloat(cleaned);
  if (Number.isNaN(num)) return 0;
  return Math.round(num * 100);
}

export default function MakePaymentPage() {
  const router = useRouter();
  const balances = usePrototypeStore((s) => s.balances);
  const cards = usePrototypeStore((s) => s.paymentCards);
  const makePayment = usePrototypeStore((s) => s.actions.makePayment);

  const defaultCard = useMemo(
    () => cards.find((c) => c.isDefault) ?? cards[0],
    [cards],
  );

  const [amount, setAmount] = useState("");
  const [cardId, setCardId] = useState(defaultCard?.id ?? "");
  const [touched, setTouched] = useState(false);

  const minPence = 2500;
  const amountPence = poundsToPence(amount);
  const isValid = amountPence >= minPence && amountPence > 0 && Boolean(cardId);

  return (
    <div>
      <SubPageHeader title="Make A Payment" backHref="/my-account/overview" />

      <Card>
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Amount
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-semibold">£</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onBlur={() => setTouched(true)}
              inputMode="decimal"
              placeholder="0.00"
              className="w-full rounded border border-black/15 px-3 py-2 text-sm"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setAmount("25.00")}
              className="flex-1 rounded border border-black/15 bg-white px-3 py-2 text-[11px] font-semibold tracking-wide"
            >
              Pay minimum £25
            </button>
            <button
              type="button"
              onClick={() =>
                setAmount((balances.currentBalance.pence / 100).toFixed(2))
              }
              className="flex-1 rounded border border-black/15 bg-white px-3 py-2 text-[11px] font-semibold tracking-wide"
            >
              Pay balance {balances.currentBalance.formatted}
            </button>
          </div>
        </div>
        <Divider />

        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Payment method
          </div>
          <select
            value={cardId}
            onChange={(e) => setCardId(e.target.value)}
            className="mt-2 w-full rounded border border-black/15 bg-white px-3 py-2 text-sm"
          >
            {cards.map((c) => (
              <option key={c.id} value={c.id}>
                {c.brand} •••• {c.last4} {c.isDefault ? "(Default)" : ""}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {!isValid && touched ? (
        <div className="mt-3 text-xs text-black/60">
          Enter an amount of at least £25.00 and choose a card.
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setTouched(true);
          if (!isValid) return;
          makePayment({ amountPence, cardId });
          router.push("/my-account/payment/make-a-payment/success");
        }}
        className="mt-4 w-full rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white disabled:opacity-40"
        disabled={!isValid}
      >
        CONFIRM PAYMENT
      </button>
    </div>
  );
}

