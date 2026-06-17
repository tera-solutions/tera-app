/* Import: library */
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { PaginationProps, notification, DropdownItem, Modal } from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import useConfirm from "@tera/commons/hooks/useConfirm";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { IModalProps } from "@tera/commons/interfaces";
import { BRANCH_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { BranchService, UserService } from "@tera/modules";

/* Import: pages */
import { IBranch } from "pages/System/branch/_interface";

interface BranchTableProps {
  params: any;
  setParams: (v: any) => void;
  setModalData: (v: IModalProps) => void;
}

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  active: { color: "#16a34a", bg: "#dcfce7" },
  inactive: { color: "#6b7280", bg: "#f3f4f6" },
};

const BranchTable = ({ params, setParams, setModalData }: BranchTableProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const confirmDialog = useConfirm();

  const { data, isPending } = BranchService.useBranchList({ params });

  // list API không trả full_name trong object manager → resolve id -> tên qua user list
  const { data: userData } = UserService.useUserList({
    params: { page: 1, per_page: 100 },
  });
  const userNameById: Record<string, string> = {};
  (userData?.data?.items ?? []).forEach((u: any) => {
    if (u?.id != null) userNameById[u.id] = u.full_name;
  });
  const managerName = (record: IBranch) => {
    const id = record.manager?.id ?? record.manager_id;
    return (
      record.manager?.full_name ??
      (id != null ? userNameById[id] : undefined) ??
      undefined
    );
  };
  const { mutate: onDelete, isPending: isDeleting } =
    BranchService.useBranchDelete();
  const { mutate: onUpdate, isPending: isUpdating } =
    BranchService.useBranchUpdate();

  const [pendingStatus, setPendingStatus] = useState<{
    record: IBranch;
    status: string;
  } | null>(null);
  const [reason, setReason] = useState("");

  const STATUS_LIST = [
    { value: "active", label: t("branch.status_active"), color: STATUS_STYLE.active.color },
    { value: "inactive", label: t("branch.status_inactive"), color: STATUS_STYLE.inactive.color },
  ];

  const invalidateBranch = () => {
    queryClient.invalidateQueries({ queryKey: ["branch", "list"] });
    queryClient.invalidateQueries({ queryKey: ["branch", "detail"] });
  };

  const handleChangeStatus = (record: IBranch, status: string) => {
    if (status === "active") {
      onUpdate(
        { id: record.id, params: { status } },
        {
          onSuccess: invalidateBranch,
          onError: (error: any) =>
            notification.error({
              message: error?.message || t("common.error_message"),
            }),
        },
      );
      return;
    }
    setReason("");
    setPendingStatus({ record, status });
  };

  const handleConfirmStatus = () => {
    if (!pendingStatus) return;
    const { record, status } = pendingStatus;
    onUpdate(
      { id: record.id, params: { status, reason } },
      {
        onSuccess: () => {
          invalidateBranch();
          setPendingStatus(null);
        },
        onError: (error: any) =>
          notification.error({
            message: error?.message || t("common.error_message"),
          }),
      },
    );
  };

  const handleDelete = (record: IBranch) => {
    confirmDialog.warning({
      title: t("common.delete_confirm_title"),
      content: t("common.delete_confirm_question"),
      onOk: () =>
        onDelete(
          { id: record.id },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["branch", "list"] });
            },
            onError: (error: any) => {
              notification.error({
                message: error?.message || t("common.error_message"),
              });
            },
          },
        ),
    });
  };

  const itemsAction = (record: IBranch): DropdownItem[] => [
    {
      key: "detail",
      label: t("button.detail"),
      onClick: () =>
        isMobile
          ? navigate(BRANCH_PAGE_URL.detail.path(Number(record.id)))
          : setModalData({ open: true, type: "detail", id: record.id }),
    },
    {
      key: "edit",
      label: t("button.edit"),
      onClick: () =>
        isMobile
          ? navigate(BRANCH_PAGE_URL.update.path(Number(record.id)))
          : setModalData({ open: true, type: "update", id: record.id }),
    },
    ...STATUS_LIST.filter((opt) => opt.value !== record.status).map((opt) => ({
      key: `status-${opt.value}`,
      label: <span style={{ color: opt.color }}>{opt.label}</span>,
      onClick: () => handleChangeStatus(record, opt.value),
    })),
    {
      key: "delete",
      label: <span className="text-red-500">{t("button.delete")}</span>,
      onClick: () => handleDelete(record),
    },
  ];

  const HeaderTitle = ({ children }: { children: ReactNode }) => (
    <span style={{ color: "#111827" }}>{children}</span>
  );

  const emptyCell = <span className="text-gray-300">—</span>;

  const columns = [
    {
      title: <HeaderTitle>{t("branch.code")}</HeaderTitle>,
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: <HeaderTitle>{t("branch.name")}</HeaderTitle>,
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, record: IBranch) => (
        <div className="flex flex-col gap-0.5">
          <span>{name}</span>
          {record.short_name && (
            <span className="text-[12px] text-gray-400">
              {record.short_name}
            </span>
          )}
        </div>
      ),
    },
    {
      title: <HeaderTitle>{t("branch.business")}</HeaderTitle>,
      key: "business",
      width: 180,
      render: (_: any, record: IBranch) => record.business?.name || emptyCell,
    },
    {
      title: <HeaderTitle>{t("branch.phone")}</HeaderTitle>,
      dataIndex: "phone",
      key: "phone",
      width: 130,
      render: (value: string) => value || emptyCell,
    },
    {
      title: <HeaderTitle>{t("branch.address")}</HeaderTitle>,
      key: "address",
      width: 220,
      render: (_: any, record: IBranch) => {
        const parts = [record.address, record.district, record.province].filter(
          Boolean,
        );
        return parts.length ? (
          <span className="text-[13px] text-gray-700">{parts.join(", ")}</span>
        ) : (
          emptyCell
        );
      },
    },
    {
      title: <HeaderTitle>{t("branch.email")}</HeaderTitle>,
      dataIndex: "email",
      key: "email",
      width: 180,
      render: (value: string) => value || emptyCell,
    },
    {
      title: <HeaderTitle>{t("branch.manager")}</HeaderTitle>,
      key: "manager",
      width: 160,
      render: (_: any, record: IBranch) => managerName(record) ?? emptyCell,
    },
    {
      title: <HeaderTitle>{t("branch.status")}</HeaderTitle>,
      dataIndex: "status",
      key: "status",
      width: 140,
      align: "center" as const,
      render: (status: string) => {
        const style = STATUS_STYLE[status] ?? STATUS_STYLE.inactive;
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium"
            style={{ color: style.color, backgroundColor: style.bg }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: style.color }}
            />
            {status ? t(`branch.status_${status}`) : "—"}
          </span>
        );
      },
    },
    {
      title: <HeaderTitle>{t("branch.created_at")}</HeaderTitle>,
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
      render: (_: any, record: IBranch) => (
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

  const pendingStatusLabel = pendingStatus
    ? STATUS_LIST.find((s) => s.value === pendingStatus.status)?.label ?? ""
    : "";

  return (
    <>
      <div style={{ width: "100%", overflowX: "auto", colorScheme: "light" }}>
        <TableTera
          rowKey="id"
          columns={columns}
          data={tableData}
          scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
          loading={isPending || isDeleting}
          pagination={{
            onChange: handleChangePage,
            total: totalItems,
            current: currentPage,
            pageSize: perPage,
            pageSizeOptions: [20, 50, 100],
          }}
        />
      </div>

      <Modal
        title={`${t("branch.change_status")}: ${pendingStatusLabel}`}
        open={!!pendingStatus}
        onCancel={() => setPendingStatus(null)}
        closeIcon={false}
        centered
        width={500}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPendingStatus(null)}
              className="px-4 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              {t("button.cancel")}
            </button>
            <button
              type="button"
              onClick={handleConfirmStatus}
              disabled={!reason.trim() || isUpdating}
              className="px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUpdating ? t("common.processing") : t("button.save")}
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] text-gray-600 font-medium">
            {t("common.reason")} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("common.reason_placeholder")}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 resize-none"
          />
        </div>
      </Modal>
    </>
  );
};

export default BranchTable;
