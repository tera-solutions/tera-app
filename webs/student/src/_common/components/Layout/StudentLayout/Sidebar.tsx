import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRightStartOnRectangleOutlined,
  ChatBubbleLeftRightOutlined,
  ChevronDoubleLeftOutlined,
  ChevronDoubleRightOutlined,
} from "tera-dls";

import { AuthApi } from "@tera/api";
import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import { useStores } from "@tera/stores/useStores";

import HanaFlower from "_common/components/HanaFlower";
import rabbitImg from "@/assets/characters/rabbit.png";

import HanaLogo from "./HanaLogo";
import { isMenuActive, sidebarMenu } from "./menu";

/** Nhớ trạng thái thu gọn giữa các lần mở app */
const COLLAPSED_STORAGE_KEY = "student_sidebar_collapsed";

const Sidebar = observer(() => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { globalStore } = useStores();

  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSED_STORAGE_KEY) === "1",
  );

  const toggleCollapsed = () =>
    setCollapsed((prev) => {
      localStorage.setItem(COLLAPSED_STORAGE_KEY, prev ? "0" : "1");
      return !prev;
    });

  const { mutate: onLogout } = useMutationLegacy({
    mutationFn: AuthApi.logout,
    onSuccess: () => globalStore.clear(),
    onError: () => globalStore.clear(),
  });

  const toggleButton = (
    <button
      type="button"
      onClick={toggleCollapsed}
      title={collapsed ? t("menu.expand") : t("menu.collapse")}
      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl text-hana-muted transition hover:bg-hana-blue-soft hover:text-hana-blue"
    >
      {collapsed ? (
        <ChevronDoubleRightOutlined className="h-5 w-5" />
      ) : (
        <ChevronDoubleLeftOutlined className="h-5 w-5" />
      )}
    </button>
  );

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col gap-6 bg-white py-5 transition-[width] duration-200 xl:flex ${
        collapsed ? "w-[88px] px-3" : "w-[236px] px-4"
      }`}
    >
      {/* Logo + nút thu gọn: mở rộng thì nút nằm sát mép phải, thu gọn thì xuống dưới logo */}
      <div
        className={
          collapsed
            ? "flex flex-col items-center gap-2"
            : "flex items-center justify-between gap-2"
        }
      >
        <Link to="/" title="Hana">
          {collapsed ? (
            <HanaFlower className="h-9 w-9" />
          ) : (
            <HanaLogo className="pl-2" />
          )}
        </Link>
        {toggleButton}
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {sidebarMenu.map((item) => {
          const active = isMenuActive(item, pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              to={item.path}
              title={collapsed ? t(item.titleKey) : undefined}
              className={`flex items-center gap-3 text-[15px] font-semibold transition ${
                // Thu gọn: ô nền là hình TRÒN 48px căn giữa rail
                collapsed
                  ? "mx-auto h-12 w-12 justify-center rounded-full p-0"
                  : "rounded-2xl px-4 py-3"
              } ${
                active
                  ? "bg-hana-blue text-white shadow-hana"
                  : "text-hana-navy hover:bg-hana-blue-soft"
              }`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 ${active ? "text-white" : "text-hana-muted"}`}
              />
              {!collapsed && t(item.titleKey)}
            </Link>
          );
        })}
      </nav>

      {/* Widget trợ lý AI — mục 5.8 của task [086] */}
      {collapsed ? (
        <button
          type="button"
          title={t("ai.name")}
          className="mx-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-hana-blue-soft transition hover:bg-hana-blue/15"
        >
          <img
            src={rabbitImg}
            alt={t("ai.name")}
            className="h-9 w-9 object-contain"
          />
        </button>
      ) : (
        <div className="rounded-hana bg-hana-blue-soft p-3 text-center">
          <img
            src={rabbitImg}
            alt={t("ai.name")}
            className="mx-auto h-20 w-20 object-contain"
          />
          <p className="mt-1 font-bold text-hana-blue">{t("ai.name")}</p>
          <p className="text-xs text-hana-muted">{t("ai.description")}</p>
          <button
            type="button"
            className="mt-2.5 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-full bg-hana-blue py-2 text-xs font-semibold text-white transition hover:bg-hana-blue-dark"
          >
            <ChatBubbleLeftRightOutlined className="h-4 w-4" />
            {t("ai.chat_now")}
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => onLogout({})}
        title={collapsed ? t("menu.logout") : undefined}
        className={`flex cursor-pointer items-center gap-3 text-[15px] font-semibold text-hana-muted transition hover:text-hana-navy ${
          collapsed
            ? "mx-auto h-12 w-12 justify-center rounded-full p-0 hover:bg-hana-blue-soft"
            : "px-4 py-2"
        }`}
      >
        <ArrowRightStartOnRectangleOutlined className="h-5 w-5 shrink-0" />
        {!collapsed && t("menu.logout")}
      </button>
    </aside>
  );
});

export default Sidebar;
