import { ProfileService } from "@tera/modules/system";

/**
 * Per-resource quota caps for the signed-in tenant's plan, read from
 * /api/auth/profile (subscription.package.limits). Mirrors the backend
 * SubscriptionGate: no active subscription, missing limits, or a null cap all
 * mean unlimited → limitOf returns null.
 */
export const useQuota = () => {
  const query = ProfileService.useProfile();
  const limits: Record<string, number | null> | null =
    query.data?.data?.subscription?.package?.limits ?? null;

  const limitOf = (resource: string): number | null => {
    if (!limits) return null;
    const value = limits[resource];
    return value == null ? null : Number(value);
  };

  return { limitOf, isLoading: query.isLoading };
};

export default useQuota;
