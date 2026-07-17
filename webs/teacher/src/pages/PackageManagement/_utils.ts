import type { CurrentSubscription, PackageOption, SubscriptionInvoiceRow } from "./_interface";

export const toPackages = (raw: any): PackageOption[] =>
  (raw?.data?.items ?? []).map((item: any) => ({
    id: item.id,
    code: item.package_code,
    name: item.name,
    description: item.description ?? null,
    price: Number(item.price ?? 0),
    billingCycle: item.billing_cycle ?? "month",
    features: item.features ?? [],
    badge: item.badge ?? null,
  }));

export const toCurrentSubscription = (raw: any): CurrentSubscription | null => {
  const data = raw?.data;
  if (!data) return null;
  return {
    id: data.id,
    packageId: data.package_id,
    packageName: data.package?.name ?? "—",
    price: Number(data.price ?? 0),
    billingCycle: data.billing_cycle ?? "month",
    status: data.status,
    startedAt: data.started_at,
    expiresAt: data.expires_at,
    features: data.package?.features ?? [],
  };
};

export const toSubscriptionInvoices = (raw: any): SubscriptionInvoiceRow[] =>
  (raw?.data?.items ?? []).map((item: any) => ({
    id: item.id,
    code: item.code,
    packageName: item.package_name,
    billingCycle: item.billing_cycle,
    amount: Number(item.amount ?? 0),
    paymentMethod: item.payment_method ?? null,
    status: item.status,
    paidAt: item.paid_at,
  }));

export const formatCurrency = (value: number): string => `${Math.round(value).toLocaleString("vi-VN")}đ`;

export const daysRemaining = (expiresAt: string | null): number | null => {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};
