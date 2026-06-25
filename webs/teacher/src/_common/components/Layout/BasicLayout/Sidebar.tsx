import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDoubleLeftOutlined,
  ChevronDoubleRightOutlined,
} from "tera-dls";

import { MENU } from "../Menu/menus";

const isActivePath = (pathname: string, path: string): boolean =>
  pathname === path || pathname.startsWith(`${path}/`);

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar = ({ collapsed, onToggleCollapse }: SidebarProps) => {
  const { pathname } = useLocation();

  return (
    <aside
      className={classNames(
        "hidden xmd:flex fixed bottom-0 left-0 top-topbar z-40 flex-col bg-linear-to-b from-brand to-brand-dark text-white transition-[width] duration-200",
        collapsed ? "w-sidebar-collapsed" : "w-sidebar",
      )}
    >
      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-none">
        <ul className="flex flex-col gap-1">
          {MENU.map((item) => {
            const active = isActivePath(pathname, item.path);
            return (
              <li key={item.key}>
                <Link
                  to={item.path}
                  title={collapsed ? item.title : undefined}
                  className={classNames(
                    "flex items-center gap-3 rounded-xl py-2.5 text-sm transition-colors",
                    collapsed ? "justify-center px-0" : "px-3",
                    active
                      ? "bg-white text-brand-dark font-semibold shadow-sm"
                      : "text-white/90 hover:bg-white/15",
                  )}
                >
                  <i className="flex h-5 w-5 shrink-0 items-center justify-center [&_svg]:h-5 [&_svg]:w-5">
                    {item.icon}
                  </i>
                  {!collapsed && <span className="truncate">{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={classNames(
          "p-4 pb-12",
          collapsed && "hidden",
        )}
      >
        <button className="w-full flex items-center justify-between gap-4 p-3 border border-white rounded-lg">
            <div className="flex flex-col text-left">
              <strong>Hana Edu</strong>
              <span>Hỗ trợ giáo viên</span>
            </div>
            <span className="text-2xl">
              ⭐
            </span>
        </button>
      </div>

      <button
        type="button"
        onClick={onToggleCollapse}
        title={collapsed ? "Mở rộng" : "Thu gọn"}
        aria-label={collapsed ? "Mở rộng" : "Thu gọn"}
        className={classNames(
          "flex shrink-0 items-center gap-2 border-t border-white/15 px-4 py-3 text-sm text-white/80 hover:bg-white/10 [&_svg]:h-5 [&_svg]:w-5",
          collapsed && "justify-center px-0",
        )}
      >
        {collapsed ? (
          <ChevronDoubleRightOutlined />
        ) : (
          <>
            <ChevronDoubleLeftOutlined />
            <span>Thu gọn</span>
          </>
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
