import { useLocation } from "react-router-dom";

import {
  BOTTOM_NAV,
  MENU,
} from "_common/components/Layout/Menu/menus";
import { CARD } from "_common/constants/dashboard";

const ALL_ITEMS = [...MENU, ...BOTTOM_NAV];

interface PlaceholderProps {
  title?: string;
}

const Placeholder = ({ title }: PlaceholderProps) => {
  const { pathname } = useLocation();
  const matched = ALL_ITEMS.find((item) => item.path === pathname);
  const heading = title ?? matched?.title ?? "Trang";

  return (
    <div className="p-4 xmd:p-6">
      <div
        className={`${CARD} flex min-h-[60vh] flex-col items-center justify-center gap-3 p-10 text-center`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-brand [&_svg]:h-7 [&_svg]:w-7">
          {matched?.icon}
        </div>
        <h2 className="text-xl font-semibold text-slate-800">{heading}</h2>
        <p className="text-sm text-slate-400">
          Nội dung trang đang được xây dựng.
        </p>
      </div>
    </div>
  );
};

export default Placeholder;
