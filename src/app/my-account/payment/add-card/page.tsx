"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function AddCardPage() {
  const router = useRouter();
  const addresses = usePrototypeStore((s) => s.addresses);
  const defaultAddressId = usePrototypeStore((s) => s.user.defaultDeliveryAddressId);
  const addCard = usePrototypeStore((s) => s.actions.addPaymentCard);

  const [brand, setBrand] = useState<"Visa" | "Mastercard">("Visa");
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("Sophie Turner");
  const [expiry, setExpiry] = useState("11/28");
  const [cvv, setCvv] = useState("");
  const [useDefaultBilling, setUseDefaultBilling] = useState(true);
  const [billingAddressId, setBillingAddressId] = useState(defaultAddressId);
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [touched, setTouched] = useState(false);

  const effectiveBillingId = useDefaultBilling ? defaultAddressId : billingAddressId;

  const isValid =
    cardNumber.replace(/\D/g, "").length >= 12 &&
    nameOnCard.trim().length > 2 &&
    /^\d{2}\/\d{2}$/.test(expiry.trim()) &&
    cvv.replace(/\D/g, "").length >= 3 &&
    Boolean(effectiveBillingId);

  const billingPreview = useMemo(
    () => addresses.find((a) => a.id === effectiveBillingId),
    [addresses, effectiveBillingId],
  );

  return (
    <div>
      <SubPageHeader title="Add a New Payment Card" backHref="/my-account/payment" />

      <Card>
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Card type
          </div>
          <select
            value={brand}
            onChange={(e) => setBrand(e.target.value as "Visa" | "Mastercard")}
            className="mt-2 w-full rounded border border-black/15 bg-white px-3 py-2 text-sm"
          >
            <option value="Visa">Visa</option>
            <option value="Mastercard">Mastercard</option>
          </select>
        </div>
        <Divider />
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Card number
          </div>
          <input
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            onBlur={() => setTouched(true)}
            inputMode="numeric"
            placeholder="1234 5678 9012 3456"
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
          />
        </div>
        <Divider />
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Name on card
          </div>
          <input
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            onBlur={() => setTouched(true)}
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
          />
        </div>
        <Divider />
        <div className="grid grid-cols-2 gap-3 px-4 py-4">
          <div>
            <div className="text-[11px] font-semibold tracking-wide text-black/60">
              Expiry (MM/YY)
            </div>
            <input
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              onBlur={() => setTouched(true)}
              inputMode="numeric"
              placeholder="11/28"
              className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-wide text-black/60">
              CVV
            </div>
            <input
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              onBlur={() => setTouched(true)}
              inputMode="numeric"
              placeholder="123"
              className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </Card>

      <div className="mt-5 text-xs font-semibold tracking-wide text-black/70">
        Billing address
      </div>
      <Card className="mt-2">
        <button
          type="button"
          onClick={() => setUseDefaultBilling(true)}
          className="flex w-full items-center justify-between px-4 py-4 text-sm"
        >
          <div className="text-black/70">Use default delivery address</div>
          <div className="text-[11px] font-semibold text-black/60">
            {useDefaultBilling ? "Selected" : "Select"}
          </div>
        </button>
        <Divider />
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-black/70">Choose another address</div>
            <button
              type="button"
              onClick={() => setUseDefaultBilling(false)}
              className="rounded border border-black/15 bg-white px-3 py-2 text-[11px] font-semibold tracking-wide"
            >
              SELECT
            </button>
          </div>
          {!useDefaultBilling ? (
            <select
              value={billingAddressId}
              onChange={(e) => setBillingAddressId(e.target.value)}
              className="mt-3 w-full rounded border border-black/15 bg-white px-3 py-2 text-sm"
            >
              {addresses.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label} • {a.postcode}
                </option>
              ))}
            </select>
          ) : null}

          {billingPreview ? (
            <div className="mt-3 rounded border border-black/10 bg-white px-3 py-3 text-xs text-black/60">
              <div className="font-semibold text-black">{billingPreview.label}</div>
              <div className="mt-1">
                {billingPreview.line1}
                {billingPreview.line2 ? `, ${billingPreview.line2}` : ""}
              </div>
              <div>
                {billingPreview.town}, {billingPreview.postcode}
              </div>
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="mt-4 px-4 py-1">
        <button
          type="button"
          onClick={() => setSetAsDefault((v) => !v)}
          className="flex w-full items-center justify-between py-3 text-sm"
        >
          <div className="text-black/70">Set as default card</div>
          <div
            className={`h-6 w-11 rounded-full p-1 transition-colors ${
              setAsDefault ? "bg-black" : "bg-black/15"
            }`}
            aria-hidden
          >
            <div
              className={`h-4 w-4 rounded-full bg-white transition-transform ${
                setAsDefault ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </button>
      </Card>

      {!isValid && touched ? (
        <div className="mt-3 text-xs text-black/60">
          Please complete all card fields.
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setTouched(true);
          if (!isValid) return;
          addCard({
            brand,
            cardNumber,
            nameOnCard: nameOnCard.trim(),
            expiryMMYY: expiry.trim(),
            billingAddressId: effectiveBillingId,
            setAsDefault,
          });
          router.push("/my-account/payment");
        }}
        className="mt-4 w-full rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white disabled:opacity-40"
        disabled={!isValid}
      >
        SAVE CARD
      </button>
    </div>
  );
}

