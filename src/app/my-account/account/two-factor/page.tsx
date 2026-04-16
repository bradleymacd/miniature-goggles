"use client";

import { useState } from "react";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function TwoFactorPage() {
  const twoFactor = usePrototypeStore((s) => s.user.twoFactor);
  const updateUser = usePrototypeStore((s) => s.actions.updateUser);
  const phone = usePrototypeStore((s) => s.user.phone);

  const [stage, setStage] = useState<"idle" | "setup">("idle");
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);

  const enabled = twoFactor.enabled;

  return (
    <div>
      <SubPageHeader title="2-Factor Authentication" backHref="/my-account/account" />

      <Card className="px-4 py-1">
        <button
          type="button"
          onClick={() => {
            if (enabled) {
              updateUser({ twoFactor: { enabled: false } });
              setStage("idle");
              setVerified(false);
              setCode("");
              return;
            }
            setStage("setup");
          }}
          className="flex w-full items-center justify-between py-3 text-sm"
        >
          <div className="text-black/70">2FA</div>
          <div
            className={`h-6 w-11 rounded-full p-1 transition-colors ${
              enabled ? "bg-black" : "bg-black/15"
            }`}
            aria-hidden
          >
            <div
              className={`h-4 w-4 rounded-full bg-white transition-transform ${
                enabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </button>
        <Divider />
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Method</div>
          <select
            value={twoFactor.method}
            onChange={(e) =>
              updateUser({
                twoFactor: { method: e.target.value as "SMS" | "Authenticator app" },
              })
            }
            className="rounded border border-black/15 bg-white px-2 py-1 text-sm"
            disabled={!enabled && stage !== "setup"}
          >
            <option value="SMS">SMS</option>
            <option value="Authenticator app">Authenticator app</option>
          </select>
        </div>
      </Card>

      {stage === "setup" && !enabled ? (
        <Card className="mt-4">
          <div className="px-4 py-4">
            <div className="text-sm font-semibold">Set up 2FA</div>
            <div className="mt-2 text-sm text-black/70">
              We’ll send a one-time code to{" "}
              <span className="font-medium">{phone}</span>.
            </div>
          </div>
          <Divider />
          <div className="px-4 py-4">
            <div className="text-[11px] font-semibold tracking-wide text-black/60">
              Enter code
            </div>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              placeholder="123456"
              className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
            />
            <div className="mt-2 text-xs text-black/60">
              Use any 6 digits for this prototype.
            </div>
            {verified ? (
              <div className="mt-2 text-xs text-black/60">2FA enabled.</div>
            ) : null}
          </div>
        </Card>
      ) : null}

      {stage === "setup" && !enabled ? (
        <button
          type="button"
          onClick={() => {
            if (code.trim().length < 6) return;
            updateUser({ twoFactor: { enabled: true } });
            setVerified(true);
            setStage("idle");
          }}
          className="mt-4 w-full rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white disabled:opacity-40"
          disabled={code.trim().length < 6}
        >
          ENABLE 2FA
        </button>
      ) : null}
    </div>
  );
}

