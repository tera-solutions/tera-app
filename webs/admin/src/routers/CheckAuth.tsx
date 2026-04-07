import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStores } from "_common/hooks/useStores";
import { IMiddleRouterProps } from "@tera/commons/interfaces/router";
import { getQueryParams } from "tera-dls";

const CheckAuth: React.FC<IMiddleRouterProps> = observer(({ children }) => {
  const { authStore } = useStores();
  const location = useLocation();
  const params: { [key: string]: any } = getQueryParams(location.search);

  if (
    authStore.authenticated &&
    !params?.callback &&
    !location?.pathname.includes("/auth/check-auth")
  ) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <>{children}</>;
});

export default CheckAuth;
