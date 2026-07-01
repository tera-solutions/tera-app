/* Import: library */
import { ReactNode, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { UserService, RoleService } from "@tera/modules";

/* Import: pages */
import { IUser } from "pages/System/user/_interface";

const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString("vi-VN") : undefined;

const fmtDateTime = (v?: string | null) =>
  v ? new Date(v).toLocaleString("vi-VN") : undefined;

interface UserDetailContentProps {
  user?: IUser;
  /** 2 cột trên desktop, 2 cột mobile cho tab thống kê... (không dùng ở đây, giữ đồng bộ API) */
  gridCols?: number;
}

const UserDetailContent = observer(({ user }: UserDetailContentProps) => {
  const { t } = useTranslation();
  const { globalStore } = useStores();
  const [activeTab, setActiveTab] = useState("personal");

  // resolve role_id -> title
  const { data: roleData } = RoleService.useRoleList({
    params: { page: 1, per_page: 100 },
  });
  const roleTitleById: Record<string, string> = {};
  (roleData?.data?.items ?? []).forEach((r: any) => {
    if (r?.id != null) roleTitleById[r.id] = r.title ?? r.name ?? r.role_name;
  });
  const roleName =
    user?.role?.title ??
    (user?.role_id != null ? roleTitleById[user.role_id] : undefined);

  // resolve created_by / updated_by -> tên
  const { data: userData } = UserService.useUserList({
    params: { page: 1, per_page: 100 },
  });
  const userNameById: Record<string, string> = {};
  (userData?.data?.items ?? []).forEach((u: any) => {
    if (u?.id != null) userNameById[u.id] = u.full_name;
  });
  const resolveUser = (v: any) => {
    if (v == null) return undefined;
    if (typeof v === "object") return v.full_name ?? undefined;
    return userNameById[v] ?? `#${v}`;
  };

  const tabs = [
    { key: "personal", label: t("user.tab_personal") },
    { key: "organization", label: t("user.tab_organization") },
    { key: "permission", label: t("user.tab_permission") },
    { key: "status", label: t("user.tab_status") },
    { key: "login", label: t("user.tab_login") },
    { key: "system", label: t("user.tab_system") },
  ];

  const genderLabel = user?.gender
    ? globalStore.getMetaLabel("gender", user.gender)
    : undefined;
  const statusItem = user?.status
    ? globalStore.getMetaItem("user_status", user.status)
    : undefined;

  return (
    <div>
      {/* Profile card (giống teacher) */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-20 h-20 rounded-full mb-3 overflow-hidden">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user?.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "?"}
            </div>
          )}
        </div>
        <p className="text-base font-bold text-gray-800">
          {user?.full_name ?? "—"}
        </p>
        <p className="text-sm text-gray-400 mt-0.5">{user?.user_id ?? "—"}</p>
      </div>

      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-4 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hồ sơ cá nhân */}
      {activeTab === "personal" && (
        <div className="divide-y divide-gray-100">
          <InfoRow label={t("user.user_id")} value={user?.user_id} />
          <InfoRow label={t("user.full_name")} value={user?.full_name} />
          <InfoRow label={t("user.email")} value={user?.email} />
          <InfoRow label={t("user.phone")} value={user?.phone} />
          <InfoRow label={t("user.gender")} value={genderLabel} />
          <InfoRow label={t("user.dob")} value={fmtDate(user?.dob)} />
        </div>
      )}

      {/* Thông tin tổ chức */}
      {activeTab === "organization" && (
        <div className="divide-y divide-gray-100">
          <InfoRow label={t("user.business")} value={user?.business?.name} />
          <InfoRow label={t("user.branch")} value={user?.branch?.name} />
          <InfoRow label={t("user.department")} value={user?.department} />
          <InfoRow label={t("user.position")} value={roleName} />
        </div>
      )}

      {/* Phân quyền */}
      {activeTab === "permission" && (
        <div className="divide-y divide-gray-100">
          <InfoRow label={t("user.roles")} value={roleName} />
          <InfoRow label={t("user.permissions")} value={undefined} />
          <InfoRow
            label={t("user.is_admin")}
            value={user?.is_admin ? t("common.yes") : t("common.no")}
          />
        </div>
      )}

      {/* Trạng thái */}
      {activeTab === "status" && (
        <div className="divide-y divide-gray-100">
          <div className="flex items-start gap-4 py-2.5">
            <span className="w-36 text-[13px] text-gray-500 shrink-0">
              {t("user.status")}
            </span>
            {user?.status ? (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium"
                style={{
                  color: statusItem?.color ?? "#6b7280",
                  backgroundColor: statusItem?.backgroundColor ?? "#f3f4f6",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: statusItem?.color ?? "#6b7280" }}
                />
                {statusItem?.label ?? user.status}
              </span>
            ) : (
              <span className="text-[13px] text-gray-800 font-medium">—</span>
            )}
          </div>
        </div>
      )}

      {/* Nhật ký đăng nhập */}
      {activeTab === "login" && (
        <div className="divide-y divide-gray-100">
          <InfoRow label={t("user.last_login")} value={fmtDateTime(user?.last_login_at)} />
          <InfoRow label={t("user.last_ip")} value={user?.last_ip} />
          <InfoRow label={t("user.login_count")} value={user?.login_count} />
        </div>
      )}

      {/* Thông tin hệ thống */}
      {activeTab === "system" && (
        <div className="divide-y divide-gray-100">
          <InfoRow label={t("user.created_by")} value={resolveUser(user?.created_by)} />
          <InfoRow label={t("user.created_at")} value={fmtDateTime(user?.created_at)} />
          <InfoRow label={t("user.updated_by")} value={resolveUser(user?.updated_by)} />
          <InfoRow label={t("user.updated_at")} value={fmtDateTime(user?.updated_at)} />
        </div>
      )}
    </div>
  );
});

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value?: ReactNode;
}) => (
  <div className="flex items-start gap-4 py-2.5">
    <span className="w-36 text-[13px] text-gray-500 shrink-0">{label}</span>
    <span className="text-[13px] text-gray-800 font-medium">
      {value ?? "—"}
    </span>
  </div>
);

export default UserDetailContent;
