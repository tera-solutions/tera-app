/* Import: library */
import { ReactNode, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { PaginationProps, DropdownItem, Modal, notification } from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { IModalProps } from "@tera/commons/interfaces";
import { CLASS_ROOM_PAGE_URL } from "@tera/commons/constants/url";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { ClassRoomService } from "@tera/modules";

/* Import: pages */
import Pagination from "_common/components/Pagination";
import { IClassRoom } from "pages/education/class-room/_interface";

interface ClassRoomTableProps {
  params: any;
  setParams: (v: any) => void;
  setModalData: (v: IModalProps) => void;
}

const ClassRoomTable = observer(
  ({ params, setParams, setModalData }: ClassRoomTableProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const { globalStore } = useStores();
    const queryClient = useQueryClient();

    const { data, isPending } = ClassRoomService.useClassRoomList({ params });
    const { mutate: onSuspend, isPending: isSuspending } =
      ClassRoomService.useClassRoomSuspend();
    const { mutate: onRestore, isPending: isRestoring } =
      ClassRoomService.useClassRoomRestore();

    const [pendingSuspend, setPendingSuspend] = useState<IClassRoom | null>(null);
    const [reason, setReason] = useState("");

    const handleCopy = (code?: string) => {
      if (!code) return;
      navigator.clipboard?.writeText(code);
      notification.success({ message: t("classroom.code_copied") });
    };

    const handleRestore = (record: IClassRoom) => {
      onRestore(
        { id: record.id, params: {} },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["class-room", "list"] });
            notification.success({ message: t("common.update_success") });
          },
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
        { id: pendingSuspend.id, params: { reason: reason.trim() } },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["class-room", "list"] });
            notification.success({ message: t("common.update_success") });
            setPendingSuspend(null);
          },
          onError: (error: any) =>
            notification.error({
              message: error?.message || t("common.error_message"),
            }),
        },
      );
    };

    const itemsAction = (record: IClassRoom): DropdownItem[] => [
      {
        key: "detail",
        label: t("button.detail"),
        onClick: () =>
          isMobile
            ? navigate(CLASS_ROOM_PAGE_URL.detail.path(record.id))
            : setModalData({ open: true, type: "detail", id: record.id }),
      },
      {
        key: "edit",
        label: t("button.edit"),
        onClick: () =>
          isMobile
            ? navigate(CLASS_ROOM_PAGE_URL.update.path(record.id))
            : setModalData({ open: true, type: "update", id: record.id }),
      },
      {
        key: "suspend",
        label: (
          <span className="text-yellow-600">{t("classroom.suspend")}</span>
        ),
        onClick: () => {
          setReason("");
          setPendingSuspend(record);
        },
      },
      {
        key: "restore",
        label: (
          <span className="text-green-600">{t("classroom.restore")}</span>
        ),
        onClick: () => handleRestore(record),
      },
    ];

    const HeaderTitle = ({ children }: { children: ReactNode }) => (
      <span style={{ color: "#111827" }}>{children}</span>
    );

    // Cảnh báo sĩ số: backend đã TÍNH SẴN và trả trong record.capacity_warning.
    // Chỉ map sang nhãn + màu (null/rỗng = bình thường, không hiện badge).
    const getCapacityWarning = (
      record: IClassRoom,
    ): { label: string; color: string; bg: string } | null => {
      const raw = (record as any).capacity_warning;
      if (raw == null || raw === "" || raw === false) return null;
      const key = String(raw).toLowerCase().trim();
      // Thiếu học viên
      if (
        ["under", "low", "lack", "short", "thiếu", "thieu", "missing"].some(
          (k) => key.includes(k),
        )
      )
        return {
          label: t("classroom.warn_under"),
          color: "#1d4ed8",
          bg: "#dbeafe",
        };
      // Sắp đầy — PHẢI kiểm tra trước "đầy" vì "almost_full"/"near_full" có chứa "full"
      if (["almost", "near", "sắp", "sap"].some((k) => key.includes(k)))
        return {
          label: t("classroom.warn_almost_full"),
          color: "#b45309",
          bg: "#fef3c7",
        };
      // Đầy lớp
      if (["full", "đã đầy", "da day", "over"].some((k) => key.includes(k)))
        return { label: t("classroom.warn_full"), color: "#b91c1c", bg: "#fee2e2" };
      // Không khớp code đã biết → hiện nguyên giá trị backend (badge cảnh báo chung)
      return {
        label: String(raw),
        color: "#b45309",
        bg: "#fef3c7",
      };
    };

    const pagination = data?.data?.pagination;
    const currentPage = pagination?.current_page || params?.page || 1;
    const totalItems = pagination?.total || 0;
    const perPage = Number(pagination?.per_page || params?.per_page || 20);

    const CopyCodeIcon = ({ code }: { code?: string }) =>
      code ? (
        <button
          type="button"
          title={t("classroom.copy_code")}
          onClick={() => handleCopy(code)}
          className="text-gray-400 hover:text-blue-500 transition-colors shrink-0"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      ) : null;

    const columns = [
      {
        title: <HeaderTitle>{t("common.stt")}</HeaderTitle>,
        key: "stt",
        width: 60,
        align: "center" as const,
        render: (_: any, __: IClassRoom, index: number) =>
          (currentPage - 1) * perPage + index + 1,
      },
      {
        title: <HeaderTitle>{t("classroom.name")}</HeaderTitle>,
        dataIndex: "name",
        key: "name",
        width: 200,
        render: (name: string, record: IClassRoom) => (
          <div className="flex flex-col">
            <span className="font-medium text-gray-800">{name ?? "—"}</span>
            {record.code && (
              <div className="flex items-center gap-1 text-[12px] text-gray-400">
                <span>{record.code}</span>
                <CopyCodeIcon code={record.code} />
              </div>
            )}
          </div>
        ),
      },
      {
        title: <HeaderTitle>{t("classroom.course")}</HeaderTitle>,
        key: "course",
        width: 180,
        render: (_: any, record: IClassRoom) =>
          record.course?.name ?? <span className="text-gray-300">—</span>,
      },
      {
        title: <HeaderTitle>{t("classroom.lesson_plan")}</HeaderTitle>,
        key: "lesson_plan",
        width: 160,
        render: (_: any, record: IClassRoom) =>
          (record.lesson_plan as any)?.plan_name ??
          record.lesson_plan?.name ?? <span className="text-gray-300">—</span>,
      },
      {
        title: <HeaderTitle>{t("classroom.teacher")}</HeaderTitle>,
        key: "teacher",
        width: 160,
        render: (_: any, record: IClassRoom) =>
          record.teacher?.full_name ?? <span className="text-gray-300">—</span>,
      },
      {
        title: <HeaderTitle>{t("classroom.assignee")}</HeaderTitle>,
        key: "assignee",
        width: 160,
        render: (_: any, record: IClassRoom) =>
          record.assignee?.full_name ?? (
            <span className="text-gray-300">—</span>
          ),
      },
      {
        title: <HeaderTitle>{t("classroom.room")}</HeaderTitle>,
        key: "room",
        width: 140,
        render: (_: any, record: IClassRoom) =>
          record.room?.room_name ?? <span className="text-gray-300">—</span>,
      },
      {
        title: <HeaderTitle>{t("classroom.learning_type")}</HeaderTitle>,
        dataIndex: "learning_type",
        key: "learning_type",
        width: 140,
        align: "center" as const,
        render: (value: string) => {
          const item = globalStore.getMetaItem("class_learning_type", value);
          if (!value) return <span className="text-gray-300">—</span>;
          return (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium"
              style={{
                color: item?.color ?? "#1d4ed8",
                backgroundColor: item?.backgroundColor ?? "#dbeafe",
              }}
            >
              {item?.label ?? value}
            </span>
          );
        },
      },
      {
        title: <HeaderTitle>{t("classroom.capacity")}</HeaderTitle>,
        key: "capacity",
        width: 110,
        align: "center" as const,
        render: (_: any, record: IClassRoom) =>
          record.max_capacity != null ? (
            `${record.max_capacity}`
          ) : (
            <span className="text-gray-300">—</span>
          ),
      },
      {
        title: <HeaderTitle>{t("classroom.capacity_warning")}</HeaderTitle>,
        key: "capacity_warning",
        width: 130,
        align: "center" as const,
        render: (_: any, record: IClassRoom) => {
          const w = getCapacityWarning(record);
          if (!w) return <span className="text-gray-300">—</span>;
          return (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium"
              style={{ color: w.color, backgroundColor: w.bg }}
            >
              {w.label}
            </span>
          );
        },
      },
      {
        title: <HeaderTitle>{t("classroom.start_date")}</HeaderTitle>,
        dataIndex: "start_date",
        key: "start_date",
        width: 120,
        align: "center" as const,
        render: (value: string) =>
          value ? (
            new Date(value).toLocaleDateString("vi-VN")
          ) : (
            <span className="text-gray-300">—</span>
          ),
      },
      {
        title: <HeaderTitle>{t("classroom.end_date")}</HeaderTitle>,
        dataIndex: "end_date",
        key: "end_date",
        width: 120,
        align: "center" as const,
        render: (value: string) =>
          value ? (
            new Date(value).toLocaleDateString("vi-VN")
          ) : (
            <span className="text-gray-300">—</span>
          ),
      },
      {
        title: <HeaderTitle>{t("classroom.status")}</HeaderTitle>,
        dataIndex: "status",
        key: "status",
        width: 130,
        align: "center" as const,
        render: (status: string) => {
          const item = globalStore.getMetaItem("class_status", status);
          return (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium"
              style={{ color: item?.color, backgroundColor: item?.backgroundColor }}
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
        title: <HeaderTitle>{t("button.action")}</HeaderTitle>,
        key: "action",
        width: 80,
        align: "center" as const,
        render: (_: any, record: IClassRoom) => (
          <ActionDropdown dropdownItems={itemsAction(record)} trigger="click" />
        ),
      },
    ];

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
            rowKey="id"
            columns={columns}
            data={tableData}
            scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
            loading={isPending || isRestoring}
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

        <Modal
          title={`${t("classroom.suspend")}: ${pendingSuspend?.name ?? ""}`}
          open={!!pendingSuspend}
          onCancel={() => setPendingSuspend(null)}
          closeIcon={false}
          centered
          width={isMobile ? "92%" : 500}
          className="max-w-[500px]!"
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
                disabled={!reason.trim() || isSuspending}
                className="px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSuspending ? t("common.processing") : t("button.save")}
              </button>
            </div>
          }
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] text-gray-600 font-medium">
              {t("classroom.suspend_reason")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("classroom.suspend_reason_placeholder")}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 resize-none"
            />
          </div>
        </Modal>
      </>
    );
  },
);

export default ClassRoomTable;
