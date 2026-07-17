import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";

import { BOTTOM_NAV } from "../Menu/menus";
import useFeatures from "_common/hooks/useFeatures";

const isActivePath = (pathname: string, path: string): boolean =>
  pathname === path || pathname.startsWith(`${path}/`);

const BottomNav = () => {
  const { pathname } = useLocation();
  const { has } = useFeatures();
  const items = BOTTOM_NAV.filter((item) => has(item.feature));

  return (
    <nav className="xmd:hidden fixed bottom-0 inset-x-0 z-50 h-bottomnav border-t border-slate-100 bg-white pb-[env(safe-area-inset-bottom)]">
      <ul
        className="grid h-bottomnav"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
      >
        {items.map((item) => {
          const active = isActivePath(pathname, item.path);
          return (
            <li key={item.key}>
              <Link
                to={item.path}
                className={classNames(
                  "flex h-full flex-col items-center justify-center gap-1 text-[11px]",
                  active ? "text-brand" : "text-slate-400",
                )}
              >
                <i className="flex h-6 w-6 items-center justify-center [&_svg]:h-6 [&_svg]:w-6">
                  {item.icon}
                </i>
                <span className="truncate">{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
