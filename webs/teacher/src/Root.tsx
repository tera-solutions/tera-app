import { useQueryLegacy } from "@tera/commons/hooks/tanstack";

import { observer } from "mobx-react-lite";
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthApi } from "@tera/api";

import { useStores } from "@tera/stores/useStores";

import { Routers } from "./routers";

const basename = document.querySelector("base")?.getAttribute("href") ?? "/";

const Root = observer(() => {
  const { globalStore } = useStores();

  const [isWorkflowDefault, setIsWorkflowDefault] = useState<boolean>(false);

  // 1. Get Device
  useQueryLegacy({
    queryKey: ["get_device"],
    queryFn: AuthApi.getDeviceCode, // Khai báo tường minh
    staleTime: 300000,
    onSuccess: (data) => {
      globalStore.setInitData(data);
    },
  });

  // 2. Get Profile
  useQueryLegacy({
    queryKey: ["get_profile"],
    queryFn: AuthApi.getProfile, // Khai báo tường minh
    staleTime: 300000,
    enabled: !!globalStore.token,
    onSuccess: (res) => {
      globalStore.updateUser({ user: res?.data });
      if (
        res?.data?.is_workflow_default === null &&
        res?.data?.type === "owner"
      ) {
        setIsWorkflowDefault(true);
      }
    },
  });

  // 3. Get Metadata
  useQueryLegacy({
    queryKey: ["get_metadata"],
    queryFn: AuthApi.getMetadata,
    staleTime: 300000,
    enabled: !!globalStore.token,
    onSuccess: (res) => {
      globalStore.setMetadata(res?.data);
    },
  });

  return (
    <BrowserRouter basename={basename}>
      <Routers />
    </BrowserRouter>
  );
});

export default Root;
