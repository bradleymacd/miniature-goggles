"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePrototypeStore } from "@/store/usePrototypeStore";
import { STORAGE_KEY } from "@/store/seed";
import {
  IconAccount,
  IconBag,
  IconHeart,
  IconOrders,
  IconOverview,
  IconPayment,
  IconSearch,
  IconUser,
} from "./icons";
import { DevToolsPanel } from "./DevToolsPanel";

const CATEGORIES = ["FOR YOU", "WOMEN", "MEN", "BOYS", "GIRLS", "HOME"] as const;

type Tab = {
  label: string;
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const TABS: Tab[] = [
  { label: "OVERVIEW", href: "/my-account/overview", Icon: IconOverview },
  { label: "ORDERS", href: "/my-account/orders", Icon: IconOrders },
  { label: "ACCOUNT", href: "/my-account/account", Icon: IconAccount },
  { label: "PAYMENTS", href: "/my-account/payment", Icon: IconPayment },
];

export default function MyAccountChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const bagCount = usePrototypeStore((s) => s.ui.bagCount);

  const activeHref = useMemo(() => {
    const match = TABS.find((t) => pathname?.startsWith(t.href));
    return match?.href ?? "/my-account/overview";
  }, [pathname]);

  const tapsRef = useRef<number[]>([]);
  const handleLogoTap = useCallback(() => {
    const now = Date.now();
    tapsRef.current = [...tapsRef.current, now].slice(-3);
    const [a, b, c] = tapsRef.current;
    if (a && b && c && c - a < 650) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      window.location.assign("/reset");
    }
  }, []);

  const [showDevtools, setShowDevtools] = useState(false);
  useEffect(() => {
    try {
      setShowDevtools(new URLSearchParams(window.location.search).get("devtools") === "1");
    } catch {
      setShowDevtools(false);
    }
  }, []);

  return (
    <div className="min-h-dvh bg-white text-black">
      <div className="sticky top-0 z-40 bg-white">
        <div className="bg-black px-4 py-2 text-center text-[11px] font-medium tracking-wide text-white">
          Next day delivery to home or free to store*
        </div>

        <div className="border-b border-black/10 px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="grid h-9 w-9 place-items-center text-black/80"
                aria-label="My account"
              >
                <IconUser className="h-5 w-5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogoTap}
              className="select-none text-xl font-semibold tracking-[0.24em]"
              aria-label="NEXT logo"
            >
              NEXT
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="grid h-9 w-9 place-items-center text-black/80"
                aria-label="Favourites"
              >
                <IconHeart className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center text-black/80"
                aria-label="Search"
              >
                <IconSearch className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="relative grid h-9 w-9 place-items-center text-black/80"
                aria-label="Bag"
              >
                <IconBag className="h-5 w-5" />
                {bagCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-black px-1 text-[10px] font-semibold text-white">
                    {bagCount}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          <div className="-mx-4 border-t border-black/10">
            <div className="no-scrollbar flex gap-5 overflow-x-auto px-4 py-2 text-[11px] font-semibold tracking-wide">
              {CATEGORIES.map((c) => (
                <a
                  key={c}
                  href="#"
                  className="whitespace-nowrap text-black/80"
                >
                  {c}
                </a>
              ))}
            </div>
          </div>

          <div className="-mx-4 border-t border-black/10">
            <nav className="grid grid-cols-4">
              {TABS.map(({ label, href, Icon }) => {
                const isActive = activeHref === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className="relative flex flex-col items-center justify-center gap-1 px-1 py-3 text-[10px] font-semibold tracking-wide text-black/80"
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                    {isActive ? (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" />
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-[430px] px-4 py-4">
        {children}
      </main>

      {showDevtools ? <DevToolsPanel /> : null}
    </div>
  );
}

