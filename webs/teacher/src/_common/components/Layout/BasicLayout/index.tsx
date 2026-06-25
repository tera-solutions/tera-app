import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import PageLoading from "@tera/components/web/PageLoading";
import { useStores } from "@tera/stores/useStores";

import { PAGE_BG } from "_common/constants/dashboard";

import BottomNav from "./BottomNav";
import DesktopLayout from "./DesktopLayout";

const BasicLayout = observer(() => {
  const {
    globalStore: { authenticated },
  } = useStores();
  const [collapsed, setCollapsed] = useState(false);

  if (!authenticated) return <PageLoading />;

  return (
    <div className={`min-h-screen ${PAGE_BG}`}>
      <DesktopLayout
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((value) => !value)}
      />

      <main
        className={`xmd:pt-topbar pb-[calc(var(--spacing-bottomnav)+16px)] transition-[padding] duration-200 xmd:pb-0 ${
          collapsed ? "xmd:pl-sidebar-collapsed" : "xmd:pl-sidebar"
        }`}
      >
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
});

export default BasicLayout;
