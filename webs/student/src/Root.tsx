import { useQueryLegacy } from "@tera/commons/hooks/tanstack";

import { observer } from "mobx-react-lite";
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Spin } from "tera-dls";
import { AuthApi } from "@tera/api";

import { useStores } from "@tera/stores/useStores";

import { Routers } from "./routers";

const basename = document.querySelector("base")?.getAttribute("href") ?? "/";

const Root = observer(() => {
  const { globalStore } = useStores();

  const [isWorkflowDefault, setIsWorkflowDefault] = useState<boolean>(false);

  // ⚠️ Đợi store nạp xong từ localStorage (token/business_id/device) TRƯỚC khi
  // bắn request — tránh race lúc reload làm request thiếu header → 404/401 (logout).
  const ready = globalStore.isHydrated;

  // 1. Get Device
  useQueryLegacy({
    queryKey: ["get_device"],
    queryFn: AuthApi.getDeviceCode, // Khai báo tường minh
    staleTime: 300000,
    enabled: ready,
    onSuccess: (data) => {
      globalStore.setInitData(data);
    },
  });

  // 2. Get Profile
  useQueryLegacy({
    queryKey: ["get_profile"],
    queryFn: AuthApi.getProfile, // Khai báo tường minh
    staleTime: 300000,
    enabled: ready && !!globalStore.token,
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

  // Chưa hydrate xong → hiện loader, KHÔNG render routes (tránh page con bắn query sớm)
  if (!ready) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Spin spinning />
      </div>
    );
  }

  return (
    <BrowserRouter basename={basename}>
      <Routers />
    </BrowserRouter>
  );
});

export default Root;
