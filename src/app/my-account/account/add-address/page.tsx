"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function AddAddressPage() {
  const router = useRouter();
  const add = usePrototypeStore((s) => s.actions.addAddress);

  const [label, setLabel] = useState("New address");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [town, setTown] = useState("");
  const [postcode, setPostcode] = useState("");
  const [lookupDone, setLookupDone] = useState(false);

  const canSave = useMemo(
    () => label.trim() && line1.trim() && town.trim() && postcode.trim(),
    [label, line1, town, postcode],
  );

  return (
    <div>
      <SubPageHeader title="Add New Delivery Address" backHref="/my-account/account" />

      <Card>
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Label
          </div>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
            placeholder="Home / Work"
          />
        </div>
        <Divider />
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Address line 1
          </div>
          <input
            value={line1}
            onChange={(e) => setLine1(e.target.value)}
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
            placeholder="House number and street"
          />
        </div>
        <Divider />
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Address line 2 (optional)
          </div>
          <input
            value={line2}
            onChange={(e) => setLine2(e.target.value)}
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
            placeholder="Flat, building, etc."
          />
        </div>
        <Divider />
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold tracking-wide text-black/60">
              Postcode
            </div>
            <button
              type="button"
              onClick={() => {
                // Fake lookup: populate a plausible town for UK postcodes.
                const pc = postcode.trim().toUpperCase();
                if (!pc) return;
                if (pc.startsWith("LE")) {
                  setTown("Leicester");
                } else if (pc.startsWith("SW") || pc.startsWith("SE") || pc.startsWith("E")) {
                  setTown("London");
                } else {
                  setTown("Leicester");
                }
                setLookupDone(true);
              }}
              className="rounded border border-black/15 bg-white px-3 py-2 text-[11px] font-semibold tracking-wide"
            >
              POSTCODE LOOKUP
            </button>
          </div>
          <input
            value={postcode}
            onChange={(e) => {
              setLookupDone(false);
              setPostcode(e.target.value);
            }}
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
            placeholder="LE19 4AT"
          />
          {lookupDone ? (
            <div className="mt-2 text-xs text-black/60">
              Address found. Please confirm details.
            </div>
          ) : null}
        </div>
        <Divider />
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Town/City
          </div>
          <input
            value={town}
            onChange={(e) => setTown(e.target.value)}
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
            placeholder="Town"
          />
        </div>
        <Divider />
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Country
          </div>
          <div className="mt-2 rounded border border-black/10 bg-black/5 px-3 py-2 text-sm">
            United Kingdom
          </div>
        </div>
      </Card>

      <button
        type="button"
        onClick={() => {
          if (!canSave) return;
          add({
            label: label.trim(),
            line1: line1.trim(),
            line2: line2.trim() || undefined,
            town: town.trim(),
            postcode: postcode.trim().toUpperCase(),
            country: "United Kingdom",
          });
          router.push("/my-account/account/delivery-addresses");
        }}
        className="mt-4 w-full rounded bg-black px-4 py-4 text-center text-xs font-semibold tracking-wide text-white disabled:opacity-40"
        disabled={!canSave}
      >
        SAVE ADDRESS
      </button>
    </div>
  );
}

