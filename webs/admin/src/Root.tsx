import { useQueryLegacy } from "@tera/commons/hooks/tanstack";

import { observer } from "mobx-react-lite";
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthApi } from "@tera/api";

import { useStores } from "_common/hooks/useStores";

import ModalWorkflowDefault from "@tera/components/web/ModalWorkflowDefault";
import { Routers } from "./routers";

const basename = document.querySelector("base")?.getAttribute("href") ?? "/";

const Root = observer(() => {
  const {
    authStore,
  } = useStores();

  const [isWorkflowDefault, setIsWorkflowDefault] = useState<boolean>(false);

  // 1. Get Device
  useQueryLegacy({
    queryKey: ["get_device"],
    queryFn: AuthApi.getDeviceCode, // Khai báo tường minh
    staleTime: 300000,
    onSuccess: (data) => {
      authStore.setInitData(data);
    },
  });

  // 2. Get Profile
  useQueryLegacy({
    queryKey: ["get_profile"],
    queryFn: AuthApi.getProfile, // Khai báo tường minh
    staleTime: 300000,
    enabled: !!authStore.token,
    onSuccess: (res) => {
      authStore.updateUser({ user: res?.data });
      if (
        res?.data?.is_workflow_default === null &&
        res?.data?.type === "owner"
      ) {
        setIsWorkflowDefault(true);
      }
    },
  });

  return (
    <BrowserRouter basename={basename}>
      <Routers />
      {isWorkflowDefault && (
        <ModalWorkflowDefault
          open={isWorkflowDefault}
          onClose={() => setIsWorkflowDefault(false)}
        />
      )}
    </BrowserRouter>
  );
});

export default Root;
