"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { STORAGE_KEY } from "@/store/seed";

export default function ResetPage() {
  const router = useRouter();

  useEffect(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    const t = window.setTimeout(() => {
      router.replace("/my-account/overview");
    }, 250);
    return () => window.clearTimeout(t);
  }, [router]);

  return (
    <div className="min-h-dvh bg-white px-4 py-10 text-black">
      <div className="mx-auto w-full max-w-[430px]">
        <div className="text-xl font-semibold tracking-[0.24em]">NEXT</div>
        <div className="mt-6 rounded border border-black/10 bg-white p-4">
          <div className="text-sm font-semibold">Resetting session</div>
          <div className="mt-2 text-sm text-black/70">
            Clearing prototype data and reseeding for the next participant…
          </div>
          <button
            type="button"
            onClick={() => router.replace("/my-account/overview")}
            className="mt-4 w-full rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white"
          >
            GO TO OVERVIEW NOW
          </button>
        </div>
      </div>
    </div>
  );
}

