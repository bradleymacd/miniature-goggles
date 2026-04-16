"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Address,
  CollectionBooking,
  CreditLimitChangeRequest,
  CreditLimitPreferences,
  Order,
  PaymentCard,
  RecentlyViewedProduct,
  ReturnCase,
  ReturnMethod,
  ReturnReason,
  SeedState,
  Statement,
  Transaction,
} from "./seed";
import { buildSeedState, STORAGE_KEY } from "./seed";
import { formatGBP } from "./money";

export type PrototypeState = SeedState & {
  hydrateStatus: {
    hasHydrated: boolean;
  };
  actions: {
    seed: () => void;
    setHasHydrated: (hasHydrated: boolean) => void;
    incrementBag: (by?: number) => void;
    submitCallBackRequest: (req: {
      name: string;
      phone: string;
      preferredWindow: "Morning" | "Afternoon" | "Evening";
      reason:
        | "Delivery query"
        | "Returns"
        | "Payments & balance"
        | "Account details"
        | "Other";
    }) => void;
    makePayment: (input: { amountPence: number; cardId: string }) => void;
    clearCallBackRequest: () => void;
    createReturn: (input: {
      orderId: string;
      itemId: string;
      reason: ReturnReason;
      method: ReturnMethod;
    }) => { returnId: string } | { error: string };
    scheduleCollection: (input: {
      orderId: string;
      dateISO: string;
      timeSlot: CollectionBooking["timeSlot"];
    }) => { bookingId: string };
    requestReplacementLabel: (input: {
      returnId: string;
      reason: "Lost label" | "Never received" | "Other";
    }) => { labelReference: string } | { error: string };
    updateUser: (
      patch: Omit<
        Partial<SeedState["user"]>,
        "marketingPrefs" | "twoFactor" | "signIn"
      > & {
        marketingPrefs?: Partial<SeedState["user"]["marketingPrefs"]>;
        twoFactor?: Partial<SeedState["user"]["twoFactor"]>;
        signIn?: Partial<SeedState["user"]["signIn"]>;
      },
    ) => void;
    signOut: () => void;
    signIn: () => void;
    clearRecentlyViewed: () => void;
    addAddress: (input: Omit<import("./seed").Address, "id">) => { addressId: string };
    updateAddress: (addressId: string, patch: Partial<import("./seed").Address>) => void;
    deleteAddress: (addressId: string) => void;
    setDefaultAddress: (addressId: string) => void;
    subscribeNextUnlimited: () => void;
    addPaymentCard: (input: {
      brand: PaymentCard["brand"];
      cardNumber: string;
      nameOnCard: string;
      expiryMMYY: string;
      billingAddressId: string;
      setAsDefault: boolean;
    }) => { cardId: string };
    setDefaultPaymentCard: (cardId: string) => void;
    updateCreditLimitPreferences: (patch: Partial<CreditLimitPreferences>) => void;
    submitCreditLimitChangeRequest: (input: {
      requestedLimitPence: number;
      reason: CreditLimitChangeRequest["reason"];
    }) => { requestId: string };
  };
};

export const usePrototypeStore = create<PrototypeState>()(
  persist(
    (set, get) => ({
      ...buildSeedState(),
      hydrateStatus: { hasHydrated: false },
      actions: {
        seed: () => {
          const seeded = buildSeedState();
          set(() => ({
            ...seeded,
            hydrateStatus: { hasHydrated: true },
            actions: get().actions,
          }));
        },
        setHasHydrated: (hasHydrated) =>
          set((s) => ({
            hydrateStatus: { ...s.hydrateStatus, hasHydrated },
          })),
        incrementBag: (by = 1) =>
          set((s) => ({
            ui: { ...s.ui, bagCount: Math.max(0, s.ui.bagCount + by) },
          })),
        submitCallBackRequest: (req) =>
          set((s) => ({
            support: {
              ...s.support,
              callBack: {
                status: "submitted",
                lastRequest: { ...req, submittedAtISO: new Date().toISOString() },
              },
            },
          })),
        makePayment: ({ amountPence, cardId }) =>
          set((s) => {
            const nowISO = new Date().toISOString();
            const newBalancePence = Math.max(0, s.balances.currentBalance.pence - amountPence);
            const paymentCard = s.paymentCards.find((c) => c.id === cardId);
            const description = paymentCard
              ? `Payment - ${paymentCard.brand} •••• ${paymentCard.last4}`
              : "Payment";

            const txId = `tx_${nowISO.replace(/[-:.TZ]/g, "")}_payment`;
            const newTx = {
              id: txId,
              dateISO: nowISO,
              description,
              type: "payment" as const,
              amount: formatGBP(amountPence),
              runningBalance: formatGBP(newBalancePence),
            };

            // Keep statements loosely consistent: add to a current-month statement.
            const monthLabel = new Date().toLocaleString("en-GB", {
              month: "short",
              year: "numeric",
            });
            let statements = s.statements;
            const existingIdx = statements.findIndex((st) => st.monthLabel === monthLabel);
            if (existingIdx === -1) {
              const d = new Date();
              const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0));
              const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 23, 59, 59));
              statements = [
                {
                  id: `st_${d.getUTCFullYear()}_${String(d.getUTCMonth() + 1).padStart(2, "0")}`,
                  monthLabel,
                  periodStartISO: start.toISOString(),
                  periodEndISO: end.toISOString(),
                  openingBalance: s.balances.currentBalance,
                  closingBalance: formatGBP(newBalancePence),
                  transactions: [newTx, ...s.transactions].slice(0, 40),
                },
                ...statements,
              ];
            } else {
              statements = statements.map((st, idx) =>
                idx === existingIdx
                  ? {
                      ...st,
                      closingBalance: formatGBP(newBalancePence),
                      transactions: [newTx, ...st.transactions],
                    }
                  : st,
              );
            }

            return {
              balances: {
                ...s.balances,
                currentBalance: formatGBP(newBalancePence),
                availableToSpend: formatGBP(
                  Math.max(0, s.balances.creditLimit.pence - newBalancePence),
                ),
              },
              transactions: [newTx, ...s.transactions],
              statements,
            };
          }),
        clearCallBackRequest: () =>
          set((s) => ({
            support: { ...s.support, callBack: { status: "idle" } },
          })),
        createReturn: ({ orderId, itemId, reason, method }) => {
          const s = get();
          const order = s.orders.find((o) => o.id === orderId);
          const item = order?.items.find((i) => i.id === itemId);
          if (!order || !item) return { error: "Item not found" };

          const nowISO = new Date().toISOString();
          const returnId = `ret_${nowISO.replace(/[-:.TZ]/g, "")}`;
          const newReturn: ReturnCase = {
            id: returnId,
            createdAtISO: nowISO,
            orderId,
            orderPlacedAtISO: order.placedAtISO,
            item,
            reason,
            method,
            labelReference: method === "Post" ? `NL-${returnId.slice(-6).toUpperCase()}` : undefined,
            refundStatus: "Pending",
          };

          // Remove item from delivered order (or keep order if other items remain)
          const updatedOrders = s.orders.map((o) => {
            if (o.id !== orderId) return o;
            const remainingItems = o.items.filter((i) => i.id !== itemId);
            return {
              ...o,
              items: remainingItems,
              status: remainingItems.length === 0 ? "returned" : o.status,
              statusLabel: remainingItems.length === 0 ? "Returned" : o.statusLabel,
            };
          });

          // Apply a refund immediately to feel realistic for testing.
          const refundPence = item.price.pence * item.qty;
          const newBalancePence = Math.max(0, s.balances.currentBalance.pence - refundPence);
          const txId = `tx_${nowISO.replace(/[-:.TZ]/g, "")}_refund`;
          const refundTx: Transaction = {
            id: txId,
            dateISO: nowISO,
            description: `Refund - ${item.name}`,
            type: "refund",
            amount: formatGBP(refundPence),
            runningBalance: formatGBP(newBalancePence),
          };

          // Attach to current-month statement (same strategy as payments)
          const monthLabel = new Date().toLocaleString("en-GB", {
            month: "short",
            year: "numeric",
          });
          let statements = s.statements;
          const existingIdx = statements.findIndex((st) => st.monthLabel === monthLabel);
          if (existingIdx === -1) {
            const d = new Date();
            const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0));
            const end = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 23, 59, 59));
            statements = [
              {
                id: `st_${d.getUTCFullYear()}_${String(d.getUTCMonth() + 1).padStart(2, "0")}`,
                monthLabel,
                periodStartISO: start.toISOString(),
                periodEndISO: end.toISOString(),
                openingBalance: s.balances.currentBalance,
                closingBalance: formatGBP(newBalancePence),
                transactions: [refundTx, ...s.transactions].slice(0, 40),
              },
              ...statements,
            ];
          } else {
            statements = statements.map((st, idx) =>
              idx === existingIdx
                ? {
                    ...st,
                    closingBalance: formatGBP(newBalancePence),
                    transactions: [refundTx, ...st.transactions],
                  }
                : st,
            );
          }

          set(() => ({
            orders: updatedOrders,
            returns: [newReturn, ...s.returns],
            balances: {
              ...s.balances,
              currentBalance: formatGBP(newBalancePence),
              availableToSpend: formatGBP(
                Math.max(0, s.balances.creditLimit.pence - newBalancePence),
              ),
            },
            transactions: [refundTx, ...s.transactions],
            statements,
          }));

          return { returnId };
        },
        scheduleCollection: ({ orderId, dateISO, timeSlot }) => {
          const nowISO = new Date().toISOString();
          const bookingId = `col_${nowISO.replace(/[-:.TZ]/g, "")}`;
          set((s) => ({
            collections: [
              {
                id: bookingId,
                createdAtISO: nowISO,
                orderId,
                dateISO,
                timeSlot,
                status: "Scheduled",
              },
              ...s.collections,
            ],
          }));
          return { bookingId };
        },
        requestReplacementLabel: ({ returnId }) => {
          const s = get();
          const existing = s.returns.find((r) => r.id === returnId);
          if (!existing) return { error: "Return not found" };
          if (existing.labelReference) return { error: "Label already issued" };

          const labelReference = `NL-${returnId.slice(-6).toUpperCase()}`;
          set((st) => ({
            returns: st.returns.map((r) =>
              r.id === returnId ? { ...r, labelReference } : r,
            ),
          }));
          return { labelReference };
        },
        updateUser: (patch) =>
          set((s) => ({
            user: {
              ...s.user,
              ...patch,
              marketingPrefs: {
                ...s.user.marketingPrefs,
                ...(patch.marketingPrefs ?? {}),
              },
              twoFactor: { ...s.user.twoFactor, ...(patch.twoFactor ?? {}) },
              signIn: { ...s.user.signIn, ...(patch.signIn ?? {}) },
            },
          })),
        signOut: () => set(() => ({ isSignedIn: false })),
        signIn: () => set(() => ({ isSignedIn: true })),
        clearRecentlyViewed: () => set(() => ({ recentlyViewed: [] })),
        addAddress: (input) => {
          const nowISO = new Date().toISOString();
          const addressId = `addr_${nowISO.replace(/[-:.TZ]/g, "")}`;
          set((s) => ({
            addresses: [
              {
                ...input,
                id: addressId,
                country: "United Kingdom",
                isDefault: false,
              },
              ...s.addresses.map((a) => ({ ...a, isDefault: Boolean(a.isDefault) })),
            ],
          }));
          return { addressId };
        },
        updateAddress: (addressId, patch) =>
          set((s) => ({
            addresses: s.addresses.map((a) =>
              a.id === addressId ? { ...a, ...patch } : a,
            ),
          })),
        deleteAddress: (addressId) =>
          set((s) => {
            const next = s.addresses.filter((a) => a.id !== addressId);
            let defaultId = s.user.defaultDeliveryAddressId;
            if (defaultId === addressId) {
              defaultId = next.find((a) => a.isDefault)?.id ?? next[0]?.id ?? defaultId;
            }
            return {
              addresses: next,
              user: { ...s.user, defaultDeliveryAddressId: defaultId },
            };
          }),
        setDefaultAddress: (addressId) =>
          set((s) => ({
            addresses: s.addresses.map((a) => ({ ...a, isDefault: a.id === addressId })),
            user: { ...s.user, defaultDeliveryAddressId: addressId },
          })),
        subscribeNextUnlimited: () =>
          set((s) => ({
            user: { ...s.user, nextUnlimitedMember: true },
          })),
        addPaymentCard: ({
          brand,
          cardNumber,
          nameOnCard,
          expiryMMYY,
          billingAddressId,
          setAsDefault,
        }) => {
          const nowISO = new Date().toISOString();
          const cardId = `card_${nowISO.replace(/[-:.TZ]/g, "")}`;
          const last4 = cardNumber.replace(/\D/g, "").slice(-4).padStart(4, "0");
          set((s) => ({
            paymentCards: [
              {
                id: cardId,
                brand,
                last4,
                expiryMMYY,
                nameOnCard,
                billingAddressId,
                isDefault: setAsDefault ? true : false,
              },
              ...s.paymentCards.map((c) => ({
                ...c,
                isDefault: setAsDefault ? false : Boolean(c.isDefault),
              })),
            ],
          }));
          if (setAsDefault) {
            set((s) => ({
              paymentCards: s.paymentCards.map((c) => ({
                ...c,
                isDefault: c.id === cardId,
              })),
            }));
          }
          return { cardId };
        },
        setDefaultPaymentCard: (cardId) =>
          set((s) => ({
            paymentCards: s.paymentCards.map((c) => ({
              ...c,
              isDefault: c.id === cardId,
            })),
          })),
        updateCreditLimitPreferences: (patch) =>
          set((s) => ({
            credit: {
              ...s.credit,
              preferences: { ...s.credit.preferences, ...patch },
            },
          })),
        submitCreditLimitChangeRequest: ({ requestedLimitPence, reason }) => {
          const nowISO = new Date().toISOString();
          const requestId = `clr_${nowISO.replace(/[-:.TZ]/g, "")}`;
          const req: CreditLimitChangeRequest = {
            id: requestId,
            requestedLimit: formatGBP(requestedLimitPence),
            reason,
            submittedAtISO: nowISO,
            status: "Received",
          };
          set((s) => ({
            credit: {
              ...s.credit,
              changeRequests: [req, ...s.credit.changeRequests],
            },
          }));
          return { requestId };
        },
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      partialize: (s) => ({
        version: s.version,
        seededAtISO: s.seededAtISO,
        isSignedIn: s.isSignedIn,
        support: s.support,
        user: s.user,
        balances: s.balances,
        credit: s.credit,
        ui: s.ui,
        addresses: s.addresses as Address[],
        paymentCards: s.paymentCards as PaymentCard[],
        orders: s.orders as Order[],
        returns: s.returns as ReturnCase[],
        collections: s.collections as CollectionBooking[],
        recentlyViewed: s.recentlyViewed as RecentlyViewedProduct[],
        transactions: s.transactions as Transaction[],
        statements: s.statements as Statement[],
      }),
    },
  ),
);

