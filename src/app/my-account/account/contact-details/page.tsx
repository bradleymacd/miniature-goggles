"use client";

import { useMemo, useState } from "react";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between py-3 text-sm"
    >
      <div className="text-black/70">{label}</div>
      <div
        className={`h-6 w-11 rounded-full p-1 transition-colors ${
          checked ? "bg-black" : "bg-black/15"
        }`}
        aria-hidden
      >
        <div
          className={`h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    </button>
  );
}

export default function ContactDetailsPage() {
  const user = usePrototypeStore((s) => s.user);
  const updateUser = usePrototypeStore((s) => s.actions.updateUser);

  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [prefs, setPrefs] = useState(user.marketingPrefs);
  const [saved, setSaved] = useState(false);

  const canSave =
    fullName.trim().length > 2 &&
    email.trim().includes("@") &&
    phone.trim().length >= 8;

  const preview = useMemo(
    () => ({
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
    }),
    [fullName, phone, email],
  );

  return (
    <div>
      <SubPageHeader title="Contact Details" backHref="/my-account/account" />

      <Card>
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Name
          </div>
          <input
            value={fullName}
            onChange={(e) => {
              setSaved(false);
              setFullName(e.target.value);
            }}
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
          />
        </div>
        <Divider />
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Phone
          </div>
          <input
            value={phone}
            onChange={(e) => {
              setSaved(false);
              setPhone(e.target.value);
            }}
            inputMode="tel"
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
          />
        </div>
        <Divider />
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Email
          </div>
          <input
            value={email}
            onChange={(e) => {
              setSaved(false);
              setEmail(e.target.value);
            }}
            inputMode="email"
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
          />
        </div>
      </Card>

      <div className="mt-5 text-xs font-semibold tracking-wide text-black/70">
        Marketing preferences
      </div>
      <Card className="mt-2 px-4 py-1">
        <Toggle
          label="Email"
          checked={prefs.email}
          onChange={(v) => {
            setSaved(false);
            setPrefs((p) => ({ ...p, email: v }));
          }}
        />
        <Divider />
        <Toggle
          label="SMS"
          checked={prefs.sms}
          onChange={(v) => {
            setSaved(false);
            setPrefs((p) => ({ ...p, sms: v }));
          }}
        />
        <Divider />
        <Toggle
          label="Post"
          checked={prefs.post}
          onChange={(v) => {
            setSaved(false);
            setPrefs((p) => ({ ...p, post: v }));
          }}
        />
      </Card>

      {saved ? (
        <div className="mt-3 text-xs text-black/60">
          Saved for {preview.fullName}.
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          if (!canSave) return;
          updateUser({
            fullName: preview.fullName,
            phone: preview.phone,
            email: preview.email,
            marketingPrefs: prefs,
          });
          setSaved(true);
        }}
        className="mt-4 w-full rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white disabled:opacity-40"
        disabled={!canSave}
      >
        SAVE
      </button>
    </div>
  );
}

