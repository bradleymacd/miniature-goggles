"use client";

import { useRouter } from "next/navigation";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function ClearRecentlyViewedPage() {
  const router = useRouter();
  const clear = usePrototypeStore((s) => s.actions.clearRecentlyViewed);

  return (
    <div>
      <SubPageHeader title="Clear History" backHref="/my-account/account" />
      <Card className="p-4">
        <div className="text-sm font-semibold">Clear recently viewed?</div>
        <div className="mt-2 text-sm text-black/70">
          This removes items from your Recently Viewed list.
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => router.push("/my-account/account")}
            className="rounded border border-black/15 bg-white px-4 py-4 text-xs font-semibold tracking-wide"
          >
            CANCEL
          </button>
          <button
            type="button"
            onClick={() => {
              clear();
              router.push("/my-account/account");
            }}
            className="rounded bg-black px-4 py-4 text-xs font-semibold tracking-wide text-white"
          >
            CLEAR
          </button>
        </div>
      </Card>
    </div>
  );
}

