"use client";

import Link from "next/link";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function SignInDetailsPage() {
  const user = usePrototypeStore((s) => s.user);

  return (
    <div>
      <SubPageHeader title="Sign In Details" backHref="/my-account/account" />

      <Card className="px-4 py-1">
        <div className="flex items-center justify-between py-3 text-sm">
          <div className="text-black/70">Email</div>
          <div className="font-medium">{user.email}</div>
        </div>
        <Divider />
        <Link href="/my-account/account/change-password" className="block py-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="text-black/70">Password</div>
            <div className="font-medium">Change password</div>
          </div>
          <div className="mt-1 text-xs text-black/60">
            Last changed{" "}
            {new Date(user.signIn.passwordLastChangedISO).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </Link>
        <Divider />
        <div className="py-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="text-black/70">Security question</div>
            <div className="font-medium">Set</div>
          </div>
          <div className="mt-1 text-xs text-black/60">{user.signIn.securityQuestion}</div>
        </div>
      </Card>
    </div>
  );
}

