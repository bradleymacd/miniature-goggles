"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function ChangePasswordPage() {
  const router = useRouter();
  const updateUser = usePrototypeStore((s) => s.actions.updateUser);

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState(false);

  const ok = current.length >= 4 && next.length >= 8 && next === confirm;

  return (
    <div>
      <SubPageHeader title="Change password" backHref="/my-account/account/sign-in-details" />

      <Card>
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Current password
          </div>
          <input
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            onBlur={() => setTouched(true)}
            type="password"
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
          />
        </div>
        <Divider />
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            New password
          </div>
          <input
            value={next}
            onChange={(e) => setNext(e.target.value)}
            onBlur={() => setTouched(true)}
            type="password"
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
          />
          <div className="mt-2 text-xs text-black/60">
            Use at least 8 characters.
          </div>
        </div>
        <Divider />
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Confirm new password
          </div>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onBlur={() => setTouched(true)}
            type="password"
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
          />
        </div>
      </Card>

      {!ok && touched ? (
        <div className="mt-3 text-xs text-black/60">
          Make sure the new password matches and is at least 8 characters.
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => {
          setTouched(true);
          if (!ok) return;
          updateUser({ signIn: { passwordLastChangedISO: new Date().toISOString() } });
          router.push("/my-account/account/sign-in-details");
        }}
        className="mt-4 w-full rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white disabled:opacity-40"
        disabled={!ok}
      >
        SAVE PASSWORD
      </button>
    </div>
  );
}

