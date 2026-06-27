import { observer } from "mobx-react-lite";
import { AcademicCapOutlined } from "tera-dls";

import { useStores } from "@tera/stores/useStores";

import { HERO_GRADIENT } from "_common/constants/dashboard";
import { getUserDisplay } from "_common/utils/user";

const DashboardHero = observer(() => {
  const {
    globalStore: { user },
  } = useStores();
  const { name, role, initials } = getUserDisplay(user);

  return (
    <div
      className={`${HERO_GRADIENT} rounded-b-[30%] px-4 pr-10 pb-20 pt-10 text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold">Hana Edu ⭐</p>
          <p className="text-sm font-medium">Xin chào, {name} 👋</p>
          <p className="mt-0.5 text-xs text-white/80">
            Chúc cô một ngày dạy học hiệu quả!
          </p>
        </div>
        <div className="relative shrink-0">
          <div className="h-16 w-16 overflow-hidden rounded-full border-[3px] border-white bg-sky-100 shadow-sm">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xl font-bold text-brand">
                {initials}
              </span>
            )}
          </div>
          <span className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-white px-2.5 py-1 shadow-md">
            <AcademicCapOutlined className="h-3.5 w-3.5 text-brand" />
            <span className="text-[11px] font-semibold text-brand">{role}</span>
          </span>
        </div>
      </div>
    </div>
  );
});

export default DashboardHero;
