import { useStores } from "@tera/stores/useStores";
import { observer } from "mobx-react-lite";
import { Navigate, useLocation } from "react-router-dom";
import { IMiddleRouterProps } from "@tera/commons/interfaces/router";

const MiddlewareRouter = observer(({ children }: IMiddleRouterProps) => {
  const { globalStore } = useStores();
  const location = useLocation();

  // if (globalStore.device && !globalStore.authenticated) {
  //   return <Navigate to="/auth/login" state={{ from: location }} replace />;
  // }

  return <>{children}</>;
});

export default MiddlewareRouter;
