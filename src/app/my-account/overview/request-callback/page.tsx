"use client";

import { useMemo, useState } from "react";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Button, Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

const REASONS = [
  "Delivery query",
  "Returns",
  "Payments & balance",
  "Account details",
  "Other",
] as const;

const WINDOWS = ["Morning", "Afternoon", "Evening"] as const;

export default function RequestCallbackPage() {
  const user = usePrototypeStore((s) => s.user);
  const callBack = usePrototypeStore((s) => s.support.callBack);
  const submit = usePrototypeStore((s) => s.actions.submitCallBackRequest);
  const clear = usePrototypeStore((s) => s.actions.clearCallBackRequest);

  const defaults = useMemo(
    () => ({
      name: user.fullName,
      phone: user.phone,
      preferredWindow: "Afternoon" as const,
      reason: "Payments & balance" as const,
    }),
    [user.fullName, user.phone],
  );

  const [name, setName] = useState(defaults.name);
  const [phone, setPhone] = useState(defaults.phone);
  const [preferredWindow, setPreferredWindow] = useState<
    (typeof WINDOWS)[number]
  >(defaults.preferredWindow);
  const [reason, setReason] = useState<(typeof REASONS)[number]>(defaults.reason);
  const [touched, setTouched] = useState(false);

  const isValid = name.trim().length > 1 && phone.trim().length >= 8;

  if (callBack.status === "submitted" && callBack.lastRequest) {
    return (
      <div>
        <SubPageHeader title="Request A Call Back" />
        <Card className="p-4">
          <div className="text-sm font-semibold">We’ll call you back</div>
          <div className="mt-2 text-sm text-black/70">
            We’ve received your request. A member of our team will call{" "}
            <span className="font-medium">{callBack.lastRequest.phone}</span>{" "}
            in the <span className="font-medium">{callBack.lastRequest.preferredWindow}</span>.
          </div>
          <div className="mt-4 rounded border border-black/10 bg-white px-3 py-3 text-xs text-black/60">
            Reason: <span className="font-medium text-black/70">{callBack.lastRequest.reason}</span>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => clear()}
            >
              REQUEST ANOTHER
            </Button>
            <a
              href="/my-account/overview"
              className="inline-flex flex-1 items-center justify-center rounded bg-black px-4 py-2 text-xs font-semibold tracking-wide text-white"
            >
              BACK TO OVERVIEW
            </a>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <SubPageHeader title="Request A Call Back" />

      <Card>
        <div className="px-4 py-4">
          <div className="text-xs font-semibold tracking-wide text-black/60">
            Tell us how to reach you
          </div>
        </div>
        <Divider />

        <div className="px-4 py-4">
          <label className="block text-xs font-semibold tracking-wide text-black/60">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setTouched(true)}
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
            placeholder="Your name"
          />
        </div>
        <Divider />

        <div className="px-4 py-4">
          <label className="block text-xs font-semibold tracking-wide text-black/60">
            Phone number
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => setTouched(true)}
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
            placeholder="07..."
            inputMode="tel"
          />
        </div>
        <Divider />

        <div className="px-4 py-4">
          <label className="block text-xs font-semibold tracking-wide text-black/60">
            Preferred time
          </label>
          <select
            value={preferredWindow}
            onChange={(e) =>
              setPreferredWindow(e.target.value as (typeof WINDOWS)[number])
            }
            className="mt-2 w-full rounded border border-black/15 bg-white px-3 py-2 text-sm"
          >
            {WINDOWS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
        <Divider />

        <div className="px-4 py-4">
          <label className="block text-xs font-semibold tracking-wide text-black/60">
            Reason
          </label>
          <select
            value={reason}
            onChange={(e) =>
              setReason(e.target.value as (typeof REASONS)[number])
            }
            className="mt-2 w-full rounded border border-black/15 bg-white px-3 py-2 text-sm"
          >
            {REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {!isValid && touched ? (
        <div className="mt-3 text-xs text-black/60">
          Please enter your name and a valid phone number.
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setTouched(true);
          if (!isValid) return;
          submit({ name: name.trim(), phone: phone.trim(), preferredWindow, reason });
        }}
        className="mt-4 w-full rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white disabled:opacity-40"
        disabled={!isValid}
      >
        SUBMIT REQUEST
      </button>
    </div>
  );
}

