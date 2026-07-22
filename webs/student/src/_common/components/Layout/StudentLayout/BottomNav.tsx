import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import { bottomMenu, isMenuActive } from "./menu";

/** Thanh điều hướng đáy cho mobile — mockup screen/mobile/lop hoc.png */
const BottomNav = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex transform-gpu items-center justify-around rounded-t-hana bg-white px-2 py-2 shadow-[0_-4px_20px_rgba(23,92,211,0.1)] xl:hidden">
      {bottomMenu.map((item) => {
        const active = isMenuActive(item, pathname);
        const Icon = item.icon;
        return (
          <Link
            key={item.key}
            to={item.path}
            className={`flex flex-1 flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] font-semibold ${
              active ? "text-hana-blue" : "text-hana-muted"
            }`}
          >
            <Icon className="h-6 w-6" />
            {t(item.titleKey)}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
