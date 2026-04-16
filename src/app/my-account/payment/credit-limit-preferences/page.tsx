"use client";

import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

function ToggleRow({
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

export default function CreditLimitPreferencesPage() {
  const prefs = usePrototypeStore((s) => s.credit.preferences);
  const update = usePrototypeStore((s) => s.actions.updateCreditLimitPreferences);

  return (
    <div>
      <SubPageHeader title="Credit Limit Preferences" backHref="/my-account/payment" />

      <Card className="px-4 py-1">
        <ToggleRow
          label="Notify me when I reach 80% of my limit"
          checked={prefs.notify80}
          onChange={(v) => update({ notify80: v })}
        />
        <Divider />
        <ToggleRow
          label="Auto-decline transactions that would exceed limit"
          checked={prefs.autoDeclineOverLimit}
          onChange={(v) => update({ autoDeclineOverLimit: v })}
        />
        <Divider />
        <ToggleRow
          label="Allow limit increase offers"
          checked={prefs.allowIncreaseOffers}
          onChange={(v) => update({ allowIncreaseOffers: v })}
        />
      </Card>
    </div>
  );
}

