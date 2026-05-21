import React from "react";
import { observer } from "mobx-react-lite";
import { ModuleType } from "@tera/commons/interfaces/router";

import { useStores } from "@tera/stores/useStores";
import PageLoading from "@tera/components/web/PageLoading";

import DesktopLayout from "./DesktopLayout";

const BasicLayout = observer(() => {
  const {
    globalStore: { authenticated },
  } = useStores();

  // if (!authenticated) return <PageLoading />;
  return (
    <>
      <DesktopLayout  />
    </>
  );
});

export default BasicLayout;
