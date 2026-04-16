export type Money = { pence: number; formatted: string };

export function formatGBP(pence: number): Money {
  const pounds = pence / 100;
  return {
    pence,
    formatted: pounds.toLocaleString("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
  };
}

