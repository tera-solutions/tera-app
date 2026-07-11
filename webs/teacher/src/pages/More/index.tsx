import { Link } from "react-router-dom";
import { ChevronRightOutlined } from "tera-dls";

import { MORE_MENU_ITEMS } from "_common/components/Layout/Menu/menus";
import { CARD } from "_common/constants/dashboard";

const More = () => {
  return (
    <div className="p-4 xmd:p-6">
      <div className={`${CARD} divide-y divide-slate-100 overflow-hidden`}>
        {MORE_MENU_ITEMS.map((item) => (
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
    </div>
  );
};

export default More;
