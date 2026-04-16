import type { Metadata } from "next";
import MyAccountChrome from "@/components/my-account/MyAccountChrome";
import { StoreHydrator } from "@/components/my-account/StoreHydrator";

export const metadata: Metadata = {
  title: "My Account",
};

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StoreHydrator />
      <MyAccountChrome>{children}</MyAccountChrome>
    </>
  );
}

