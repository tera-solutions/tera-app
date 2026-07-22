import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { BellOutlined, FireSolid, StarSolid } from "tera-dls";

import { useStores } from "@tera/stores/useStores";

import {
  useStudentHome,
  useUnreadNotificationCount,
} from "_common/services/student/home.service";

import HanaLogo from "./HanaLogo";
import LanguageSwitcher from "./LanguageSwitcher";
import StudentAvatar from "./StudentAvatar";

const getShortName = (fullName?: string) => {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : "";
};

const TopBar = observer(() => {
  const { t } = useTranslation();
  const { globalStore } = useStores();
  const { data } = useStudentHome();
  const { data: unread } = useUnreadNotificationCount();

  // Tên + ảnh lấy từ hồ sơ đăng nhập thật (AuthApi.getProfile trong Root.tsx);
  // chỉ rơi về dữ liệu mock khi chưa có hồ sơ.
  const profile = globalStore.user;
  const student = data?.student;
  const fullName = profile?.full_name || profile?.username || student?.name;
  const displayName = getShortName(fullName) || t("topbar.friend");
  const avatar = profile?.avatar_url || student?.avatar;
  const count = unread?.count ?? 0;

  return (
    <header className='flex flex-wrap items-center justify-between gap-3 py-4'>
      <div className='flex items-center gap-3'>
        {/* Logo chỉ hiện ở mobile vì desktop đã có trên sidebar */}
        <HanaLogo className='xl:hidden' />
        <div className='hidden items-center gap-3 xl:flex'>
          <StudentAvatar name={fullName} src={avatar} className='h-11 w-11' />
          <span className='text-lg font-bold text-hana-navy'>
            {t("topbar.greeting", { name: displayName })}
          </span>
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <div className='hana-chip' title={t("topbar.streak_tooltip")}>
          <FireSolid className='h-5 w-5 text-orange-500' />
          <span className='font-bold text-hana-navy'>
            {student?.streak ?? 0}
          </span>
        </div>

        <div className='hana-chip' title={t("topbar.xp_tooltip")}>
          <StarSolid className='h-5 w-5 text-amber-400' />
          <span className='font-bold text-hana-navy'>{student?.xp ?? 0}</span>
          <span className='text-xs font-semibold text-hana-muted'>
            {t("topbar.xp_unit")}
          </span>
        </div>

        <LanguageSwitcher />

        <button
          type='button'
          className='relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white shadow-hana-sm'
          title={t("topbar.notification_tooltip")}
        >
          <BellOutlined className='h-5 w-5 text-hana-navy' />
          {count > 0 && (
            <span className='absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white'>
              {count > 9 ? "9+" : count}
            </span>
          )}
        </button>

        <StudentAvatar
          name={fullName}
          src={avatar}
          className='h-10 w-10 cursor-pointer'
        />
      </div>
    </header>
  );
});

export default TopBar;
