/* Import: library */
import { ReactNode } from "react";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { PaginationProps, notification, DropdownItem } from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import { useStores } from "@tera/stores/useStores";
import useConfirm from "@tera/commons/hooks/useConfirm";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { IModalProps } from "@tera/commons/interfaces";
import { USER_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { UserService, RoleService } from "@tera/modules";

/* Import: pages */
import Pagination from "_common/components/Pagination";
import { IUser } from "pages/System/user/_interface";

interface UserTableProps {
  params: any;
  setParams: (v: any) => void;
  setModalData: (v: IModalProps) => void;
}

const UserTable = observer(
  ({ params, setParams, setModalData }: UserTableProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const queryClient = useQueryClient();
    const confirmDialog = useConfirm();
    const { globalStore } = useStores();

    const { data, isPending } = UserService.useUserList({ params });

    // resolve role_id -> tên vai trò
    const { data: roleData } = RoleService.useRoleList({
      params: { page: 1, per_page: 100 },
    });
    const roleNameById: Record<string, string> = {};
    (roleData?.data?.items ?? []).forEach((r: any) => {
      if (r?.id != null) roleNameById[r.id] = r.title ?? r.name ?? r.role_name;
    });
    const roleName = (record: IUser) =>
      record.role?.title ??
      (record.role_id != null ? roleNameById[record.role_id] : undefined);

    const { mutate: onDelete, isPending: isDeleting } =
      UserService.useUserDelete();
    const { mutate: onActivate } = UserService.useUserActivate();
    const { mutate: onDeactivate } = UserService.useUserDeactivate();
    const { mutate: onUnlock } = UserService.useUserUnlock();
    const { mutate: onResetPassword } = UserService.useUserResetPassword();

    const invalidateUser = () => {
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
      queryClient.invalidateQueries({ queryKey: ["user", "detail"] });
    };

    const onActionError = (error: any) =>
      notification.error({ message: error?.message || t("common.error_message") });

    const handleActivate = (record: IUser) =>
      onActivate({ id: record.id }, { onSuccess: invalidateUser, onError: onActionError });

    const handleUnlock = (record: IUser) =>
      onUnlock({ id: record.id }, { onSuccess: invalidateUser, onError: onActionError });

    const handleDeactivate = (record: IUser) => {
      confirmDialog.warning({
        title: t("user.deactivate_confirm_title"),
        content: t("user.deactivate_confirm_question"),
        onOk: () =>
          onDeactivate(
            { id: record.id },
            { onSuccess: invalidateUser, onError: onActionError },
          ),
      });
    };

    const handleResetPassword = (record: IUser) => {
      confirmDialog.warning({
        title: t("user.reset_password_confirm_title"),
        content: t("user.reset_password_confirm_question"),
        onOk: () =>
          onResetPassword(
            { id: record.id },
            {
              onSuccess: () =>
                notification.success({
                  message: t("user.reset_password_success"),
                }),
              onError: onActionError,
            },
          ),
      });
    };

    const handleDelete = (record: IUser) => {
      confirmDialog.warning({
        title: t("common.delete_confirm_title"),
        content: t("common.delete_confirm_question"),
        onOk: () =>
          onDelete(
            { id: record.id },
            {
              onSuccess: () =>
                queryClient.invalidateQueries({ queryKey: ["user", "list"] }),
              onError: onActionError,
            },
          ),
      });
    };

    const itemsAction = (record: IUser): DropdownItem[] => {
      const items: DropdownItem[] = [
        {
          key: "detail",
          label: t("button.detail"),
          onClick: () =>
            isMobile
              ? navigate(USER_PAGE_URL.detail.path(Number(record.id)))
              : setModalData({ open: true, type: "detail", id: record.id }),
        },
        {
          key: "edit",
          label: t("button.edit"),
          onClick: () =>
            isMobile
              ? navigate(USER_PAGE_URL.update.path(Number(record.id)))
              : setModalData({ open: true, type: "update", id: record.id }),
        },
      ];

      if (record.status !== "active") {
        items.push({
          key: "activate",
          label: <span className="text-green-600">{t("user.activate")}</span>,
          onClick: () => handleActivate(record),
        });
      }
      if (record.status === "active") {
        items.push({
          key: "deactivate",
          label: <span className="text-gray-600">{t("user.deactivate")}</span>,
          onClick: () => handleDeactivate(record),
        });
      }
      if (record.status === "locked") {
        items.push({
          key: "unlock",
          label: <span className="text-amber-600">{t("user.unlock")}</span>,
          onClick: () => handleUnlock(record),
        });
      }
      items.push({
        key: "reset-password",
        label: t("user.reset_password"),
        onClick: () => handleResetPassword(record),
      });
      items.push({
        key: "delete",
        label: <span className="text-red-500">{t("button.delete")}</span>,
        onClick: () => handleDelete(record),
      });
      return items;
    };

    const HeaderTitle = ({ children }: { children: ReactNode }) => (
      <span style={{ color: "#111827" }}>{children}</span>
    );

    const emptyCell = <span className="text-gray-300">—</span>;

    const columns = [
      {
        title: <HeaderTitle>{t("user.user_id")}</HeaderTitle>,
        dataIndex: "user_id",
        key: "user_id",
        width: 120,
        render: (value: string) => value || emptyCell,
      },
      {
        title: <HeaderTitle>{t("user.full_name")}</HeaderTitle>,
        dataIndex: "full_name",
        key: "full_name",
        width: 200,
        render: (name: string, record: IUser) => (
          <div className="flex flex-col gap-0.5">
            <span>{name || emptyCell}</span>
            {record.username && (
              <span className="text-[12px] text-gray-400">@{record.username}</span>
            )}
          </div>
        ),
      },
      {
        title: <HeaderTitle>{t("user.email")}</HeaderTitle>,
        dataIndex: "email",
        key: "email",
        width: 200,
        render: (value: string) => value || emptyCell,
      },
      {
        title: <HeaderTitle>{t("user.phone")}</HeaderTitle>,
        dataIndex: "phone",
        key: "phone",
        width: 130,
        render: (value: string) => value || emptyCell,
      },
      {
        title: <HeaderTitle>{t("user.role")}</HeaderTitle>,
        key: "role",
        width: 150,
        render: (_: any, record: IUser) => roleName(record) ?? emptyCell,
      },
      {
        title: <HeaderTitle>{t("user.branch")}</HeaderTitle>,
        key: "branch",
        width: 170,
        render: (_: any, record: IUser) => record.branch?.name || emptyCell,
      },
      {
        title: <HeaderTitle>{t("user.status")}</HeaderTitle>,
        dataIndex: "status",
        key: "status",
        width: 140,
        align: "center" as const,
        render: (status: string) => {
          if (!status) return emptyCell;
          const item = globalStore.getMetaItem("user_status", status);
          return (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium"
              style={{
                color: item?.color ?? "#6b7280",
                backgroundColor: item?.backgroundColor ?? "#f3f4f6",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: item?.color ?? "#6b7280" }}
              />
              {item?.label ?? status}
            </span>
          );
        },
      },
      {
        title: <HeaderTitle>{t("user.created_at")}</HeaderTitle>,
        dataIndex: "created_at",
        key: "created_at",
        width: 130,
        align: "center" as const,
        render: (value: string) =>
          value ? new Date(value).toLocaleDateString("vi-VN") : emptyCell,
      },
      {
        title: <HeaderTitle>{t("button.action")}</HeaderTitle>,
        key: "action",
        width: 80,
        align: "center" as const,
        render: (_: any, record: IUser) => (
          <ActionDropdown dropdownItems={itemsAction(record)} trigger="click" />
        ),
      },
    ];

    const pagination = data?.data?.pagination;
    const currentPage = pagination?.current_page || params?.page || 1;
    const totalItems = pagination?.total || 0;
    const perPage = Number(pagination?.per_page || params?.per_page || 20);

    const handleChangePage: PaginationProps["onChange"] = (page, pageSize) => {
      setParams((prev: any) => {
        const prevPerPage = Number(prev?.per_page || 20);
        const isPageSizeChanged = pageSize !== prevPerPage;
        return {
          ...prev,
          page: isPageSizeChanged ? 1 : page,
          per_page: pageSize,
        };
      });
    };

    const tableData = data?.data?.items ?? [];

    return (
      <div style={{ width: "100%", overflowX: "auto", colorScheme: "light" }}>
        <TableTera
          rowKey="id"
          columns={columns}
          data={tableData}
          scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
          loading={isPending || isDeleting}
          pagination={false}
        />
        <Pagination
          total={totalItems}
          current={currentPage}
          pageSize={perPage}
          onChange={handleChangePage}
          pageSizeOptions={[20, 50, 100]}
        />
      </div>
    );
  },
);

export default UserTable;
