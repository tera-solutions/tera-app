import { ReactNode } from "react";
import { observer } from "mobx-react-lite";
import { Navigate } from "react-router-dom";

import { useStores } from "@tera/stores/useStores";

/**
 * Gates the platform-superadmin panel. Only accounts flagged `is_superadmin`
 * (resolved server-side from the administrator username allow-list and returned
 * on the profile/login payload) may enter; everyone else is bounced to /403.
 * The backend endpoints are independently guarded, so this is UX, not the
 * security boundary.
 */
const SuperadminRoute = observer(({ children }: { children: ReactNode }) => {
  const { globalStore } = useStores();

  if (!globalStore.user?.is_superadmin) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
});

export default SuperadminRoute;
