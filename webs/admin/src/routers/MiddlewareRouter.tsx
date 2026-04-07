import { useStores } from "_common/hooks/useStores";
import { observer } from "mobx-react-lite";
import { Navigate, useLocation } from "react-router-dom";
import { IMiddleRouterProps } from "@tera/commons/interfaces/router";

const MiddlewareRouter = observer(({ children }: IMiddleRouterProps) => {
  const { authStore } = useStores();
  const location = useLocation();

  if (authStore.device && !authStore.authenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
});

export default MiddlewareRouter;
