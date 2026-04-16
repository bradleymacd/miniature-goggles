"use client";

import { useMemo, useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import { SubPageHeader } from "@/components/my-account/SubPageHeader";
import { Card, Divider } from "@/components/my-account/ui";
import { usePrototypeStore } from "@/store/usePrototypeStore";

export default function EditAddressPage() {
  const router = useRouter();
  const params = useParams<{ addressId: string }>();
  const addressId = params?.addressId;

  const address = usePrototypeStore((s) =>
    s.addresses.find((a) => a.id === addressId),
  );
  const defaultId = usePrototypeStore((s) => s.user.defaultDeliveryAddressId);
  const update = usePrototypeStore((s) => s.actions.updateAddress);
  const del = usePrototypeStore((s) => s.actions.deleteAddress);
  const setDefault = usePrototypeStore((s) => s.actions.setDefaultAddress);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const [label, setLabel] = useState(address?.label ?? "");
  const [line1, setLine1] = useState(address?.line1 ?? "");
  const [line2, setLine2] = useState(address?.line2 ?? "");
  const [town, setTown] = useState(address?.town ?? "");
  const [postcode, setPostcode] = useState(address?.postcode ?? "");

  const canSave = useMemo(
    () => label.trim() && line1.trim() && town.trim() && postcode.trim(),
    [label, line1, town, postcode],
  );

  if (!addressId || !address) return notFound();

  return (
    <div>
      <SubPageHeader title="Edit Address" backHref="/my-account/account/delivery-addresses" />

      <Card>
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Label
          </div>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
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
          />
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
          />
        </div>
        <Divider />
        <div className="px-4 py-4">
          <div className="text-[11px] font-semibold tracking-wide text-black/60">
            Postcode
          </div>
          <input
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            className="mt-2 w-full rounded border border-black/15 px-3 py-2 text-sm"
          />
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {addressId !== defaultId ? (
          <button
            type="button"
            onClick={() => setDefault(addressId)}
            className="rounded border border-black/15 bg-white px-4 py-4 text-xs font-semibold tracking-wide"
          >
            SET AS DEFAULT
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="rounded border border-black/15 bg-white px-4 py-4 text-xs font-semibold tracking-wide opacity-50"
          >
            DEFAULT
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            if (!canSave) return;
            update(addressId, {
              label: label.trim(),
              line1: line1.trim(),
              line2: line2.trim() || undefined,
              town: town.trim(),
              postcode: postcode.trim().toUpperCase(),
            });
            router.push("/my-account/account/delivery-addresses");
          }}
          className="rounded bg-black px-4 py-4 text-xs font-semibold tracking-wide text-white disabled:opacity-40"
          disabled={!canSave}
        >
          SAVE
        </button>
      </div>

      <button
        type="button"
        onClick={() => setConfirmDelete(true)}
        className="mt-3 w-full rounded border border-black/15 bg-white px-4 py-4 text-xs font-semibold tracking-wide"
      >
        DELETE ADDRESS
      </button>

      {confirmDelete ? (
        <Card className="mt-4 p-4">
          <div className="text-sm font-semibold">Delete this address?</div>
          <div className="mt-2 text-sm text-black/70">
            This can’t be undone.
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded border border-black/15 bg-white px-4 py-4 text-xs font-semibold tracking-wide"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={() => {
                del(addressId);
                router.push("/my-account/account/delivery-addresses");
              }}
              className="rounded bg-black px-4 py-4 text-xs font-semibold tracking-wide text-white"
            >
              DELETE
            </button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

