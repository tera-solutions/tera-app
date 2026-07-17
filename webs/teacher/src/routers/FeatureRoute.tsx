import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { PATHS } from "_common/components/Layout/Menu/menus";
import useFeatures from "_common/hooks/useFeatures";

/**
 * Gates a route behind a package feature entitlement. When the tenant's plan
 * does not include `feature`, they're redirected to the package page to upgrade.
 * The backend independently enforces the same gate (subscription.feature
 * middleware), so this is UX, not the security boundary. Features are granted
 * optimistically while the current subscription loads (see useFeatures).
 */
const FeatureRoute = ({ feature, children }: { feature: string; children: ReactNode }) => {
  const { has, isLoading } = useFeatures();

  if (!isLoading && !has(feature)) {
    return <Navigate to={PATHS.packageManagement} replace />;
  }

  return <>{children}</>;
};

export default FeatureRoute;
