import { Card, Divider, RowLink } from "@/components/my-account/ui";

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <Card>
        <RowLink title="Return An Item" href="/my-account/orders/return-an-item" />
        <Divider />
        <RowLink title="Expected" href="/my-account/orders/expected" />
        <Divider />
        <RowLink title="Delivered" href="/my-account/orders/delivered" />
        <Divider />
        <RowLink title="Returned" href="/my-account/orders/returned" />
        <Divider />
        <RowLink
          title="Arrange A Collection"
          href="/my-account/orders/arrange-a-collection"
        />
        <Divider />
        <RowLink
          title="Replacement Label"
          href="/my-account/orders/replacement-label"
        />
      </Card>

      <div className="rounded border border-black/10 bg-[#2a63b8] p-4 text-white">
        <div className="text-[11px] font-semibold tracking-wide opacity-90">
          NEXT UNLIMITED
        </div>
        <div className="mt-2 text-lg font-semibold leading-6">
          Unlock unlimited
          <br />
          free delivery
        </div>
        <div className="mt-2 text-xs opacity-90">
          Across Fashion, Brands &amp; Beauty
          <br />
          with no minimum spend
        </div>
        <div className="mt-4 inline-flex items-center rounded bg-white px-3 py-2 text-[11px] font-semibold tracking-wide text-[#2a63b8]">
          ANNUAL PASS £22.50*
        </div>
      </div>
    </div>
  );
}

