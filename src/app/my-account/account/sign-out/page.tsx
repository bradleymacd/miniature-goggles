"use client";

import { useRouter } from "next/navigation";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function SignOutPage() {
  const router = useRouter();
  const signOut = usePrototypeStore((s) => s.actions.signOut);

  return (
    <div>
      <SubPageHeader title="Sign Out" backHref="/my-account/account" />
      <Card className="p-4">
        <div className="text-sm font-semibold">Sign out?</div>
        <div className="mt-2 text-sm text-black/70">
          You can sign back in at any time and continue the session.
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
              signOut();
              router.push("/my-account/account");
            }}
            className="rounded bg-black px-4 py-4 text-xs font-semibold tracking-wide text-white"
          >
            SIGN OUT
          </button>
        </div>
      </Card>
    </div>
  );
}

