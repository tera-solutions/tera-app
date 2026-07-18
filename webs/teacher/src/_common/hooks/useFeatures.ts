import { useMemo } from "react";

import { ProfileService } from "@tera/modules/system";

/**
 * Package feature entitlements for the signed-in tenant, mirroring the backend
 * SubscriptionGate::hasFeature rules:
 *  - no active subscription (grandfathered) → all features
 *  - package with null/absent feature_keys → all features
 *  - otherwise only the keys listed on the current package are granted
 *
 * Sourced from /api/auth/profile (loaded at app bootstrap, shared cache), which
 * embeds the current subscription — no extra request. While the profile is still
 * loading we optimistically grant features so guarded pages don't flash an upsell.
 *
 * staleTime/refetchOnWindowFocus are pinned here because the app's QueryClient
 * has no defaultOptions (staleTime: 0) — without this, every window-focus event
 * silently refetches the profile, and any inconsistency in the subscription
 * payload between requests flips featureKeys between null (optimistic) and the
 * real restricted list, making sidebar items repeatedly appear/disappear.
 */
export const useFeatures = () => {
  const query = ProfileService.useProfile({
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const featureKeys = useMemo<string[] | null>(() => {
    const subscription = query.data?.data?.subscription;
    if (!subscription) return null; // grandfathered → all
    const keys = subscription.package?.feature_keys;
    return Array.isArray(keys) ? keys : null; // null → all
  }, [query.data]);

  const has = (feature?: string): boolean => {
    if (!feature) return true;
    if (featureKeys === null) return true;
    return featureKeys.includes(feature);
  };

  return { has, featureKeys, isLoading: query.isLoading };
};

export default useFeatures;
