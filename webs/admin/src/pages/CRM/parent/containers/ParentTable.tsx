/* Import: library */
import { ReactNode, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { DropdownItem, Modal, PaginationProps, notification } from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import useConfirm from "@tera/commons/hooks/useConfirm";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { ITableProps } from "@tera/commons/interfaces";
import { PARENT_PAGE_URL } from "@tera/commons/constants/url";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { ParentService } from "@tera/modules";

/* Import: pages */
import { IParent } from "pages/CRM/parent/_interface";

const ParentTable = observer(
  ({ params, setParams, setModalData }: ITableProps<IParent>) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const confirm = useConfirm();
    const queryClient = useQueryClient();
    const isMobile = useIsMobile();
    const { globalStore } = useStores();

    const { data, isPending } = ParentService.useParentList({ params });
    const { mutate: onDelete, isPending: isDeleting } =
      ParentService.useParentDelete();
    const { mutate: onUpdate } = ParentService.useParentUpdate();
    const { mutate: onSuspend, isPending: isSuspending } =
      ParentService.useParentSuspend();
    const { mutate: onRestore, isPending: isRestoring } =
      ParentService.useParentRestore();

    const [pendingSuspend, setPendingSuspend] = useState<IParent | null>(null);
    const [reason, setReason] = useState("");
    const [suspendDate, setSuspendDate] = useState("");

    const invalidateParent = () => {
      queryClient.invalidateQueries({ queryKey: ["parent", "list"] });
      queryClient.invalidateQueries({ queryKey: ["parent", "detail"] });
    };

    const handleSetStatus = (record: IParent, status: string) => {
      onUpdate(
        { id: record.id, params: { status } },
        {
          onSuccess: invalidateParent,
          onError: (error: any) =>
            notification.error({
              message: error?.message || t("common.error_message"),
            }),
        },
      );
    };

    const handleRestore = (record: IParent) => {
      onRestore(
        { id: record.id, params: {} },
        {
          onError: (error: any) =>
            notification.error({
              message: error?.message || t("common.error_message"),
            }),
        },
      );
    };

    const handleConfirmSuspend = () => {
      if (!pendingSuspend) return;
      onSuspend(
        {
          id: pendingSuspend.id,
          params: { reason, suspend_date: suspendDate },
        },
        {
          onSuccess: () => setPendingSuspend(null),
          onError: (error: any) =>
            notification.error({
              message: error?.message || t("common.error_message"),
            }),
        },
      );
    };

    const statusOptions = globalStore.getOptions("parent_status") ?? [];

    const itemsAction = (record: IParent): DropdownItem[] => [
      {
        key: "detail",
        label: t("button.detail"),
        onClick: () =>
          isMobile
            ? navigate(PARENT_PAGE_URL.detail.path(record.id as number))
            : setModalData({ open: true, type: "detail", id: record?.id }),
      },
      {
        key: "edit",
        label: t("button.edit"),
        onClick: () =>
          isMobile
            ? navigate(PARENT_PAGE_URL.update.path(record.id as number))
            : setModalData({ open: true, type: "update", id: record?.id }),
      },
      ...statusOptions
        .filter((opt: any) => opt.value !== record.status)
        .map((opt: any) => ({
          key: `status-${opt.value}`,
          label: <span style={{ color: opt.color }}>{opt.label}</span>,
          onClick: () => {
            if (opt.value === "active") return handleRestore(record);
            if (opt.value === "suspended") {
              setReason("");
              setSuspendDate("");
              setPendingSuspend(record);
              return;
            }
            handleSetStatus(record, opt.value);
          },
        })),
      {
        key: "delete",
        label: <span className="text-red-500">{t("button.delete")}</span>,
        onClick: () => {
          confirm.warning({
            title: t("common.delete_confirm_title"),
            content: t("common.delete_confirm_question"),
            onOk: () =>
              onDelete(
                { id: record?.id },
                {
                  onSuccess: () =>
                    queryClient.invalidateQueries({
                      queryKey: ["parent", "list"],
                    }),
                  onError: (error: any) =>
                    notification.error({
                      message: error?.message || t("common.error_message"),
                    }),
                },
              ),
          });
        },
      },
    ];

    const HeaderTitle = ({ children }: { children: ReactNode }) => (
      <span style={{ color: "#111827" }}>{children}</span>
    );

    const columns = [
      {
        title: <HeaderTitle>{t("parent.code")}</HeaderTitle>,
        dataIndex: "code",
        key: "code",
        width: 120,
        render: (value: string) =>
          value ?? <span className="text-gray-300">—</span>,
      },
      {
        title: <HeaderTitle>{t("parent.name")}</HeaderTitle>,
        dataIndex: "name",
        key: "name",
        width: 200,
        render: (value: string) =>
          value ?? <span className="text-gray-300">—</span>,
      },
      {
        title: <HeaderTitle>{t("parent.phone")}</HeaderTitle>,
        dataIndex: "phone",
        key: "phone",
        width: 140,
        render: (value: string) =>
          value ?? <span className="text-gray-300">—</span>,
      },
      {
        title: <HeaderTitle>{t("parent.email")}</HeaderTitle>,
        dataIndex: "email",
        key: "email",
        width: 200,
        render: (value: string) =>
          value ?? <span className="text-gray-300">—</span>,
      },
      {
        title: <HeaderTitle>{t("parent.student_count")}</HeaderTitle>,
        key: "students",
        width: 120,
        align: "center" as const,
        render: (_: any, record: IParent) => {
          const count =
            record.students_count ?? record.students?.length ?? 0;
          return count > 0 ? (
            <span className="inline-block px-2 py-0.5 text-xs rounded bg-indigo-50 text-indigo-700">
              {count}
            </span>
          ) : (
            <span className="text-gray-300">0</span>
          );
        },
      },
      {
        title: <HeaderTitle>{t("parent.branch")}</HeaderTitle>,
        key: "branch",
        width: 160,
        render: (_: any, record: IParent) =>
          record.branch?.name ?? <span className="text-gray-300">—</span>,
      },
      {
        title: <HeaderTitle>{t("parent.status")}</HeaderTitle>,
        dataIndex: "status",
        key: "status",
        width: 130,
        align: "center" as const,
        render: (status: string) => {
          const item = globalStore.getMetaItem("parent_status", status);
          return (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium"
              style={{
                color: item?.color,
                backgroundColor: item?.backgroundColor,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: item?.color }}
              />
              {item?.label ?? status}
            </span>
          );
        },
      },
      {
        title: <HeaderTitle>{t("parent.created_at")}</HeaderTitle>,
        dataIndex: "created_at",
        key: "created_at",
        width: 130,
        align: "center" as const,
        render: (value: string) =>
          value ? (
            new Date(value).toLocaleDateString("vi-VN")
          ) : (
            <span className="text-gray-300">—</span>
          ),
      },
      {
        title: <HeaderTitle>{t("button.action")}</HeaderTitle>,
        key: "action",
        width: 80,
        align: "center" as const,
        render: (_: any, record: IParent) => (
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
      <>
        <div style={{ width: "100%", overflowX: "auto", colorScheme: "light" }}>
          <TableTera
            rowKey={(record: IParent) => record.id}
            columns={columns}
            data={tableData}
            scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
            loading={isPending || isDeleting || isRestoring}
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
          title={
            globalStore.getMetaLabel("parent_status", "suspended") ||
            t("button.suspend")
          }
          open={!!pendingSuspend}
          onCancel={() => setPendingSuspend(null)}
          closeIcon={false}
          centered
          width={500}
          footer={
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingSuspend(null)}
                className="px-4 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                {t("button.cancel")}
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspend}
                disabled={!reason.trim() || !suspendDate || isSuspending}
                className="px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSuspending ? t("common.processing") : t("button.save")}
              </button>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-600 font-medium">
                {t("parent.suspend_date")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={suspendDate}
                onChange={(e) => setSuspendDate(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500"
              />
            </div>
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
          </div>
        </Modal>
      </>
    );
  },
);

export default ParentTable;
