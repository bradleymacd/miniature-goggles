"use client";

import Link from "next/link";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function StatementsPage() {
  const statements = usePrototypeStore((s) => s.statements);

  return (
    <div>
      <SubPageHeader title="Statements" backHref="/my-account/payment" />
      <Card>
        {statements.map((st, idx) => (
          <div key={st.id}>
            <Link href={`/my-account/payment/statements/${st.id}`} className="block px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{st.monthLabel}</div>
                <div className="text-sm font-semibold">{st.closingBalance.formatted}</div>
              </div>
              <div className="mt-1 text-xs text-black/60">
                Opening {st.openingBalance.formatted} • Closing {st.closingBalance.formatted}
              </div>
            </Link>
            {idx < statements.length - 1 ? <Divider /> : null}
          </div>
        ))}
      </Card>
    </div>
  );
}

