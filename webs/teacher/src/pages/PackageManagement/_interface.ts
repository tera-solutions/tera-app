export interface PackageOption {
  id: number;
  code: string;
  name: string;
  description: string | null;
  price: number;
  billingCycle: string;
  features: string[];
  badge: string | null;
}

export interface CurrentSubscription {
  id: number;
  packageId: number;
  packageName: string;
  price: number;
  billingCycle: string;
  status: string;
  startedAt: string | null;
  expiresAt: string | null;
  features: string[];
}

export interface SubscriptionInvoiceRow {
  id: number;
  code: string;
  packageName: string;
  billingCycle: string;
  amount: number;
  paymentMethod: string | null;
  status: string;
  paidAt: string | null;
}
