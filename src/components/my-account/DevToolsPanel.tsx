"use client";

import { useMemo, useState } from "react";
import { usePrototypeStore } from "@/store/usePrototypeStore";

function safeStringify(value: unknown) {
  return JSON.stringify(
    value,
    (_k, v) => (typeof v === "function" ? undefined : v),
    2,
  );
}

export function DevToolsPanel() {
  const [open, setOpen] = useState(false);

  const snapshot = usePrototypeStore((s) => ({
    version: s.version,
    seededAtISO: s.seededAtISO,
    isSignedIn: s.isSignedIn,
    user: s.user,
    balances: s.balances,
    credit: s.credit,
    ui: s.ui,
    counts: {
      addresses: s.addresses.length,
      paymentCards: s.paymentCards.length,
      orders: s.orders.length,
      returns: s.returns.length,
      collections: s.collections.length,
      recentlyViewed: s.recentlyViewed.length,
      transactions: s.transactions.length,
      statements: s.statements.length,
    },
    // Include full lists too (useful for debugging unexpected flows)
    addresses: s.addresses,
    paymentCards: s.paymentCards,
    orders: s.orders,
    returns: s.returns,
    collections: s.collections,
    recentlyViewed: s.recentlyViewed,
    transactions: s.transactions,
    statements: s.statements,
  }));

  const json = useMemo(() => safeStringify(snapshot), [snapshot]);

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 mx-auto w-full max-w-[430px]">
      {open ? (
        <div className="overflow-hidden rounded border border-black/15 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-black/10 px-3 py-2">
            <div className="text-[11px] font-semibold tracking-wide text-black/70">
              DEVTOOLS (store snapshot)
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(json);
                  } catch {
                    // no-op
                  }
                }}
                className="rounded border border-black/15 bg-white px-2 py-1 text-[11px] font-semibold tracking-wide"
              >
                COPY
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded bg-black px-2 py-1 text-[11px] font-semibold tracking-wide text-white"
              >
                CLOSE
              </button>
            </div>
          </div>
          <pre className="no-scrollbar max-h-[45vh] overflow-auto p-3 text-[11px] leading-5 text-black/70">
            {json}
          </pre>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded bg-black px-3 py-2 text-[11px] font-semibold tracking-wide text-white shadow"
        >
          DEVTOOLS
        </button>
      )}
    </div>
  );
}

