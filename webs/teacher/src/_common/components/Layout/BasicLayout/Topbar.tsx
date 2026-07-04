import { observer } from "mobx-react-lite";
import {
  ArrowRightOnRectangleOutlined,
  BellOutlined,
  ChevronDownOutlined,
  MagnifyingGlassOutlined,
  ChatBubbleLeftOutlined,
  CalendarOutlined,
  Popover,
} from "tera-dls";

import { useMutationLegacy } from "@tera/commons/hooks/tanstack";
import { AuthApi } from "@tera/api/auth/auth";
import { useStores } from "@tera/stores/useStores";

import { useStates } from "_common/hooks/useStates";
import { getUserDisplay } from "_common/utils/user";
import { formatDate } from "@tera/commons/utils";

import logo from "@/assets/logo.webp";

const Topbar = observer(() => {
  const {
    globalStore: { user, clear },
  } = useStores();
  const {
    commonStore: { clear: clearCommon },
  } = useStates();
  const { name, roleName, initials } = getUserDisplay(user);

  const handleLogoutCleanup = () => {
    clear();
    clearCommon();
  };

  const { mutate: onLogout } = useMutationLegacy({
    mutationFn: AuthApi.logout,
    onSuccess: handleLogoutCleanup,
    onError: handleLogoutCleanup,
  });

  return (
    <header className="hidden xmd:flex fixed inset-x-0 top-0 z-50 h-topbar items-center gap-4 border-b border-slate-100 bg-white px-4">
      <div className="flex items-center gap-2.5">
        <img src={logo} alt="Hana Edu" className="h-9 w-9 object-contain" />
        <span className="text-lg font-semibold tracking-wide text-brand">
          Hana Edu ⭐
        </span>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <div className="flex h-9 w-72 items-center gap-2 rounded-md bg-slate-100 px-4 text-slate-400">
          <MagnifyingGlassOutlined className="h-4 w-4" />
          <span className="text-sm">Tìm kiếm nhanh...</span>
        </div>

        <div className="flex h-9 w-52 items-center gap-2 rounded-md bg-slate-100 px-4 text-slate-400">
          <CalendarOutlined className="h-4 w-4" />
          <span className="text-sm">{formatDate(Date(), 'dddd DD/MM/YYYY')}</span>
        </div>

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500"
        >
          <BellOutlined className="size-6" />
          <span className="absolute right-1 top-1 size-3.5 rounded-full bg-red-500 text-white text-xss">
            3
          </span>
        </button>

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-500"
        >
          <ChatBubbleLeftOutlined className="size-6" />
          <span className="absolute right-1 top-1 size-3.5 rounded-full bg-red-500 text-white text-xss">
            3
          </span>
        </button>

        <Popover
          trigger="click"
          placement="bottom-end"
          content={
            <div className="w-56 p-1.5">
              <div className="flex items-center gap-2.5 px-2 py-2">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={name}
                    className="size-9 object-cover"
                  />
                ) : (
                  <div className="flex size-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                    {initials}
                  </div>
                )}
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {name}
                  </p>
                  <p className="truncate text-xs text-slate-400">{roleName}</p>
                </div>
              </div>
              <div className="my-1 h-px bg-slate-100" />
              <button
                type="button"
                onClick={() => onLogout()}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
              >
                <ArrowRightOnRectangleOutlined className="h-4 w-4" />
                Đăng xuất
              </button>
            </div>
          }
        >
          <button
            type="button"
            className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 hover:bg-slate-50"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={name}
                className="size-9 object-cover"
              />
            ) : (
              <div className="flex size-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                {initials}
              </div>
            )}
            <div className="leading-tight text-left">
              <p className="text-sm font-medium text-slate-800">{name}</p>
              <p className="text-xs text-slate-400">{roleName}</p>
            </div>
            <ChevronDownOutlined className="h-4 w-4 text-slate-400" />
          </button>
        </Popover>
      </div>
    </header>
  );
});

export default Topbar;
