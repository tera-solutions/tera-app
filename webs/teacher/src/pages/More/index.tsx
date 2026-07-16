import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { ChevronRightOutlined } from "tera-dls";

import { useStores } from "@tera/stores/useStores";

import {
  MORE_MENU_ITEMS,
  SUPERADMIN_MENU_ITEMS,
  type MenuItem,
} from "_common/components/Layout/Menu/menus";
import { CARD } from "_common/constants/dashboard";
import useFeatures from "_common/hooks/useFeatures";

const MenuList = ({ items }: { items: MenuItem[] }) => (
  <div className={`${CARD} divide-y divide-slate-100 overflow-hidden`}>
    {items.map((item) => (
      <Link
        key={item.key}
        to={item.path}
        className="flex items-center gap-3 px-4 py-3.5 text-sm text-slate-700 hover:bg-slate-50"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-brand [&_svg]:h-5 [&_svg]:w-5">
          {item.icon}
        </span>
        <span className="flex-1 font-medium">{item.title}</span>
        <ChevronRightOutlined className="h-4 w-4 text-slate-300" />
      </Link>
    ))}
  </div>
);

const More = observer(() => {
  const { globalStore } = useStores();
  const isSuperadmin = !!globalStore.user?.is_superadmin;
  const { has } = useFeatures();

  const items = MORE_MENU_ITEMS.filter((item) => has(item.feature));

  return (
    <div className="space-y-4 p-4 xmd:p-6">
      {isSuperadmin && (
        <div className="space-y-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Quản trị nền tảng
          </p>
          <MenuList items={SUPERADMIN_MENU_ITEMS} />
        </div>
      )}

      <MenuList items={items} />
    </div>
  );
});

export default More;
