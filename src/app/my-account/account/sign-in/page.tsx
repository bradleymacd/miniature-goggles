"use client";

import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const signIn = usePrototypeStore((s) => s.actions.signIn);

  return (
    <div>
      <SubPageHeader title="Sign In" backHref="/my-account/account" />
      <Card className="p-4">
        <div className="text-sm font-semibold">Sign back in</div>
        <div className="mt-2 text-sm text-black/70">
          This prototype restores your session so you can keep testing flows.
        </div>
        <button
          type="button"
          onClick={() => {
            signIn();
            router.push("/my-account/account");
          }}
          className="mt-4 w-full rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white"
        >
          SIGN IN
        </button>
      </Card>
    </div>
  );
}

