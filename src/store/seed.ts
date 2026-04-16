export type Money = {
  pence: number;
  formatted: string;
};

export type Address = {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  town: string;
  postcode: string;
  country: "United Kingdom";
  isDefault?: boolean;
};

export type PaymentCard = {
  id: string;
  brand: "Visa" | "Mastercard";
  last4: string;
  expiryMMYY: string;
  nameOnCard: string;
  billingAddressId: string;
  isDefault?: boolean;
};

export type CreditLimitPreferences = {
  notify80: boolean;
  autoDeclineOverLimit: boolean;
  allowIncreaseOffers: boolean;
};

export type CreditLimitChangeRequest = {
  id: string;
  requestedLimit: Money;
  reason:
    | "Income change"
    | "More flexibility"
    | "Big upcoming purchase"
    | "Prefer lower limit"
    | "Other";
  submittedAtISO: string;
  status: "Received" | "In review" | "Approved" | "Declined";
};

export type OrderStatus = "order_received" | "expected" | "delivered" | "returned";

export type OrderItem = {
  id: string;
  name: string;
  price: Money;
  qty: number;
  imageUrl: string;
  size?: string;
};

export type Order = {
  id: string;
  placedAtISO: string;
  status: OrderStatus;
  statusLabel: string;
  expectedAtISO?: string;
  deliveredAtISO?: string;
  deliveryAddressId: string;
  items: OrderItem[];
  total: Money;
};

export type RefundStatus = "Pending" | "Refunded to card" | "Refunded to account";

export type ReturnMethod = "Post" | "Collection";

export type ReturnReason =
  | "Wrong size"
  | "Not as described"
  | "Changed mind"
  | "Faulty"
  | "Other";

export type ReturnCase = {
  id: string;
  createdAtISO: string;
  orderId: string;
  orderPlacedAtISO: string;
  item: OrderItem;
  reason: ReturnReason;
  method: ReturnMethod;
  labelReference?: string;
  refundStatus: RefundStatus;
};

export type CollectionBooking = {
  id: string;
  createdAtISO: string;
  orderId: string;
  dateISO: string; // day
  timeSlot: "08:00 - 12:00" | "12:00 - 16:00" | "16:00 - 20:00";
  status: "Scheduled" | "Completed" | "Cancelled";
};

export type RecentlyViewedProduct = {
  id: string;
  name: string;
  price: Money;
  imageUrl: string;
  viewedAtISO: string;
};

export type TransactionType = "purchase" | "payment" | "refund";

export type Transaction = {
  id: string;
  dateISO: string;
  description: string;
  type: TransactionType;
  amount: Money; // positive number, sign depends on type in UI later
  runningBalance: Money;
};

export type Statement = {
  id: string;
  monthLabel: string; // e.g. "Jan 2026"
  periodStartISO: string;
  periodEndISO: string;
  openingBalance: Money;
  closingBalance: Money;
  transactions: Transaction[];
};

export type SeedState = {
  version: 1;
  seededAtISO: string;
  isSignedIn: boolean;
  support: {
    callBack: {
      status: "idle" | "submitted";
      lastRequest?: {
        name: string;
        phone: string;
        preferredWindow: "Morning" | "Afternoon" | "Evening";
        reason:
          | "Delivery query"
          | "Returns"
          | "Payments & balance"
          | "Account details"
          | "Other";
        submittedAtISO: string;
      };
    };
  };
  user: {
    fullName: string;
    email: string;
    phone: string;
    nextUnlimitedMember: boolean;
    defaultDeliveryAddressId: string;
    signIn: {
      securityQuestion: string;
      passwordLastChangedISO: string;
    };
    marketingPrefs: {
      email: boolean;
      sms: boolean;
      post: boolean;
    };
    twoFactor: {
      enabled: boolean;
      method: "SMS" | "Authenticator app";
    };
  };
  balances: {
    creditLimit: Money;
    currentBalance: Money;
    availableToSpend: Money;
  };
  credit: {
    preferences: CreditLimitPreferences;
    changeRequests: CreditLimitChangeRequest[];
  };
  ui: {
    bagCount: number;
  };
  addresses: Address[];
  paymentCards: PaymentCard[];
  orders: Order[];
  returns: ReturnCase[];
  collections: CollectionBooking[];
  recentlyViewed: RecentlyViewedProduct[];
  transactions: Transaction[];
  statements: Statement[];
};

function money(pence: number): Money {
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

export const STORAGE_KEY = "next-my-account-prototype";

export function buildSeedState(now = new Date()): SeedState {
  const seededAtISO = now.toISOString();

  const addr1: Address = {
    id: "addr_home",
    label: "Home",
    line1: "14 Grove Road",
    line2: "Flat 2B",
    town: "Leicester",
    postcode: "LE19 4AT",
    country: "United Kingdom",
    isDefault: true,
  };
  const addr2: Address = {
    id: "addr_work",
    label: "Work",
    line1: "100 Wellington Street",
    town: "Leicester",
    postcode: "LE1 1AA",
    country: "United Kingdom",
  };

  const cards: PaymentCard[] = [
    {
      id: "card_1",
      brand: "Visa",
      last4: "1842",
      expiryMMYY: "11/28",
      nameOnCard: "Sophie Turner",
      billingAddressId: addr1.id,
      isDefault: true,
    },
    {
      id: "card_2",
      brand: "Mastercard",
      last4: "9021",
      expiryMMYY: "07/27",
      nameOnCard: "Sophie Turner",
      billingAddressId: addr1.id,
    },
  ];

  const products: RecentlyViewedProduct[] = [
    {
      id: "rv_42",
      name: "Printed Midi Dress",
      price: money(4200),
      imageUrl:
        "https://images.unsplash.com/photo-1520975958225-b1d57f0a66ee?auto=format&fit=crop&w=600&q=60",
      viewedAtISO: seededAtISO,
    },
    {
      id: "rv_45",
      name: "Linen Blend Shirt",
      price: money(4500),
      imageUrl:
        "https://images.unsplash.com/photo-1520975682033-0f4f2d18f0e2?auto=format&fit=crop&w=600&q=60",
      viewedAtISO: seededAtISO,
    },
    {
      id: "rv_29",
      name: "Leather Sandals",
      price: money(2900),
      imageUrl:
        "https://images.unsplash.com/photo-1528701800489-20be9c3ea4f4?auto=format&fit=crop&w=600&q=60",
      viewedAtISO: seededAtISO,
    },
  ];

  // Balances from the brief
  const currentBalance = money(161183);
  const availableToSpend = money(338817);
  const creditLimit = money(500000);

  const orders: Order[] = [
    {
      id: "ord_10004561",
      placedAtISO: "2026-01-11T11:15:00.000Z",
      status: "order_received",
      statusLabel: "Order Received",
      expectedAtISO: "2026-01-12T10:00:00.000Z",
      deliveryAddressId: addr1.id,
      items: [
        {
          id: "item_1",
          name: "Cotton T-Shirt (2 Pack)",
          price: money(2400),
          qty: 1,
          imageUrl:
            "https://images.unsplash.com/photo-1520976001188-7d70b3b7f0ea?auto=format&fit=crop&w=600&q=60",
          size: "M",
        },
        {
          id: "item_2",
          name: "Slim Fit Jeans",
          price: money(5200),
          qty: 1,
          imageUrl:
            "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=600&q=60",
          size: "32R",
        },
      ],
      total: money(7600),
    },
    {
      id: "ord_10004219",
      placedAtISO: "2026-02-18T18:40:00.000Z",
      status: "expected",
      statusLabel: "Expected 20 Feb",
      expectedAtISO: "2026-02-20T10:00:00.000Z",
      deliveryAddressId: addr1.id,
      items: [
        {
          id: "item_3",
          name: "Lightweight Jacket",
          price: money(6500),
          qty: 1,
          imageUrl:
            "https://images.unsplash.com/photo-1520975867592-6c8b3b1d5b1d?auto=format&fit=crop&w=600&q=60",
          size: "L",
        },
      ],
      total: money(6500),
    },
    {
      id: "ord_10003804",
      placedAtISO: "2025-12-03T09:20:00.000Z",
      status: "delivered",
      statusLabel: "Delivered",
      deliveredAtISO: "2025-12-06T12:00:00.000Z",
      deliveryAddressId: addr2.id,
      items: [
        {
          id: "item_4",
          name: "Wool Blend Jumper",
          price: money(4800),
          qty: 1,
          imageUrl:
            "https://images.unsplash.com/photo-1520975534500-8a6c1d5d45c3?auto=format&fit=crop&w=600&q=60",
          size: "M",
        },
      ],
      total: money(4800),
    },
    {
      id: "ord_10003477",
      placedAtISO: "2025-11-10T14:10:00.000Z",
      status: "delivered",
      statusLabel: "Delivered",
      deliveredAtISO: "2025-11-13T12:00:00.000Z",
      deliveryAddressId: addr1.id,
      items: [
        {
          id: "item_5",
          name: "Trainer Socks (5 Pack)",
          price: money(1200),
          qty: 1,
          imageUrl:
            "https://images.unsplash.com/photo-1520975382205-3fa9a316bed4?auto=format&fit=crop&w=600&q=60",
          size: "One size",
        },
      ],
      total: money(1200),
    },
    {
      id: "ord_10003011",
      placedAtISO: "2025-10-05T16:00:00.000Z",
      status: "returned",
      statusLabel: "Returned",
      deliveredAtISO: "2025-10-08T12:00:00.000Z",
      deliveryAddressId: addr1.id,
      items: [
        {
          id: "item_6",
          name: "Occasion Shirt",
          price: money(3500),
          qty: 1,
          imageUrl:
            "https://images.unsplash.com/photo-1520975690154-1d15a1bb0f9e?auto=format&fit=crop&w=600&q=60",
          size: "M",
        },
      ],
      total: money(3500),
    },
  ];

  const returns: ReturnCase[] = [
    {
      id: "ret_1001",
      createdAtISO: "2025-10-12T10:30:00.000Z",
      orderId: "ord_10003011",
      orderPlacedAtISO: "2025-10-05T16:00:00.000Z",
      item: {
        id: "item_6",
        name: "Occasion Shirt",
        price: money(3500),
        qty: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1520975690154-1d15a1bb0f9e?auto=format&fit=crop&w=600&q=60",
        size: "M",
      },
      reason: "Wrong size",
      method: "Post",
      // intentionally missing labelReference to support "Replacement Label" flow
      refundStatus: "Pending",
    },
  ];

  const collections: CollectionBooking[] = [];

  const tx: Transaction[] = [
    {
      id: "tx_2026_03_29_payment",
      dateISO: "2026-03-29T09:40:00.000Z",
      description: "Payment - Visa •••• 1842",
      type: "payment",
      amount: money(9800),
      runningBalance: money(161183),
    },
    {
      id: "tx_2026_03_12_purchase",
      dateISO: "2026-03-12T13:20:00.000Z",
      description: "Next Online Purchase",
      type: "purchase",
      amount: money(7600),
      runningBalance: money(170983),
    },
    {
      id: "tx_2026_02_19_purchase",
      dateISO: "2026-02-19T17:05:00.000Z",
      description: "Next Online Purchase",
      type: "purchase",
      amount: money(6500),
      runningBalance: money(163383),
    },
    {
      id: "tx_2026_01_08_payment",
      dateISO: "2026-01-08T08:10:00.000Z",
      description: "Payment - Mastercard •••• 9021",
      type: "payment",
      amount: money(9800),
      runningBalance: money(156883),
    },
    {
      id: "tx_2025_12_14_purchase",
      dateISO: "2025-12-14T11:31:00.000Z",
      description: "Next Store Purchase",
      type: "purchase",
      amount: money(4800),
      runningBalance: money(166683),
    },
    {
      id: "tx_2025_11_21_purchase",
      dateISO: "2025-11-21T12:12:00.000Z",
      description: "Next Online Purchase",
      type: "purchase",
      amount: money(1200),
      runningBalance: money(161883),
    },
    {
      id: "tx_2025_10_22_refund",
      dateISO: "2025-10-22T10:05:00.000Z",
      description: "Refund - Returned item",
      type: "refund",
      amount: money(3500),
      runningBalance: money(160683),
    },
    {
      id: "tx_2025_10_06_purchase",
      dateISO: "2025-10-06T15:34:00.000Z",
      description: "Next Online Purchase",
      type: "purchase",
      amount: money(3500),
      runningBalance: money(164183),
    },
    {
      id: "tx_2025_09_29_payment",
      dateISO: "2025-09-29T09:01:00.000Z",
      description: "Payment - Visa •••• 1842",
      type: "payment",
      amount: money(10000),
      runningBalance: money(160683),
    },
    {
      id: "tx_2025_09_12_purchase",
      dateISO: "2025-09-12T11:09:00.000Z",
      description: "Next Online Purchase",
      type: "purchase",
      amount: money(5200),
      runningBalance: money(170683),
    },
    {
      id: "tx_2025_08_28_purchase",
      dateISO: "2025-08-28T19:22:00.000Z",
      description: "Next Store Purchase",
      type: "purchase",
      amount: money(2400),
      runningBalance: money(165483),
    },
    {
      id: "tx_2025_08_08_payment",
      dateISO: "2025-08-08T08:23:00.000Z",
      description: "Payment - Visa •••• 1842",
      type: "payment",
      amount: money(9000),
      runningBalance: money(163083),
    },
  ];

  const statements: Statement[] = [
    {
      id: "st_jan_2026",
      monthLabel: "Jan 2026",
      periodStartISO: "2026-01-01T00:00:00.000Z",
      periodEndISO: "2026-01-31T23:59:59.000Z",
      openingBalance: money(166683),
      closingBalance: money(156883),
      transactions: tx.filter((t) => t.dateISO.startsWith("2026-01")),
    },
    {
      id: "st_dec_2025",
      monthLabel: "Dec 2025",
      periodStartISO: "2025-12-01T00:00:00.000Z",
      periodEndISO: "2025-12-31T23:59:59.000Z",
      openingBalance: money(161883),
      closingBalance: money(166683),
      transactions: tx.filter((t) => t.dateISO.startsWith("2025-12")),
    },
    {
      id: "st_nov_2025",
      monthLabel: "Nov 2025",
      periodStartISO: "2025-11-01T00:00:00.000Z",
      periodEndISO: "2025-11-30T23:59:59.000Z",
      openingBalance: money(160683),
      closingBalance: money(161883),
      transactions: tx.filter((t) => t.dateISO.startsWith("2025-11")),
    },
    {
      id: "st_oct_2025",
      monthLabel: "Oct 2025",
      periodStartISO: "2025-10-01T00:00:00.000Z",
      periodEndISO: "2025-10-31T23:59:59.000Z",
      openingBalance: money(170683),
      closingBalance: money(160683),
      transactions: tx.filter((t) => t.dateISO.startsWith("2025-10")),
    },
    {
      id: "st_sep_2025",
      monthLabel: "Sep 2025",
      periodStartISO: "2025-09-01T00:00:00.000Z",
      periodEndISO: "2025-09-30T23:59:59.000Z",
      openingBalance: money(165483),
      closingBalance: money(170683),
      transactions: tx.filter((t) => t.dateISO.startsWith("2025-09")),
    },
    {
      id: "st_aug_2025",
      monthLabel: "Aug 2025",
      periodStartISO: "2025-08-01T00:00:00.000Z",
      periodEndISO: "2025-08-31T23:59:59.000Z",
      openingBalance: money(172083),
      closingBalance: money(165483),
      transactions: tx.filter((t) => t.dateISO.startsWith("2025-08")),
    },
  ];

  return {
    version: 1,
    seededAtISO,
    isSignedIn: true,
    support: {
      callBack: { status: "idle" },
    },
    user: {
      fullName: "Sophie Turner",
      email: "sophie.turner@example.com",
      phone: "07911 234 567",
      nextUnlimitedMember: false,
      defaultDeliveryAddressId: addr1.id,
      signIn: {
        securityQuestion: "What was the name of your first pet?",
        passwordLastChangedISO: "2025-11-01T10:00:00.000Z",
      },
      marketingPrefs: { email: true, sms: false, post: false },
      twoFactor: { enabled: false, method: "SMS" },
    },
    balances: {
      creditLimit,
      currentBalance,
      availableToSpend,
    },
    credit: {
      preferences: {
        notify80: true,
        autoDeclineOverLimit: false,
        allowIncreaseOffers: true,
      },
      changeRequests: [],
    },
    ui: {
      bagCount: 0,
    },
    addresses: [addr1, addr2],
    paymentCards: cards,
    orders,
    returns,
    collections,
    recentlyViewed: products,
    transactions: tx,
    statements,
  };
}

