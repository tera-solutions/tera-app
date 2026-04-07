import React from "react";
import { observer } from "mobx-react-lite";
import { ModuleType } from "@tera/commons/interfaces/router";

import { useStores } from "_common/hooks/useStores";
import PageLoading from "@tera/components/web/PageLoading"

import DesktopLayout from "./DesktopLayout";

interface AdminLayoutProps {
  module?: ModuleType;
}

const BasicLayout = observer(({ module }: AdminLayoutProps) => {
  const {
    authStore: { authenticated },
  } = useStores();

  if (!authenticated) return <PageLoading />;
  return (
    <>
      <DesktopLayout module={module} />
    </>
  );
});

export default BasicLayout;
