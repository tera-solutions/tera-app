/* Import: library */
import { ReactNode, useState } from "react";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { PaginationProps, notification, DropdownItem, Modal } from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import { useStores } from "@tera/stores/useStores";
import useConfirm from "@tera/commons/hooks/useConfirm";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { IModalProps } from "@tera/commons/interfaces";
import { ENROLLMENT_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { EnrollmentService } from "@tera/modules";

/* Import: pages */
import Pagination from "_common/components/Pagination";
import { DatePickerField } from "_common/components/DateField";
import TransferStudent from "./TransferStudent";
import { IEnrollment } from "pages/education/enrollment/_interface";

interface EnrollmentTableProps {
  params: any;
  setParams: (v: any) => void;
  setModalData: (v: IModalProps) => void;
}

const money = (v?: number) =>
  v != null ? `${Number(v).toLocaleString("vi-VN")} ₫` : "0 ₫";

const EnrollmentTable = observer(
  ({ params, setParams, setModalData }: EnrollmentTableProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const queryClient = useQueryClient();
    const confirmDialog = useConfirm();
    const { globalStore } = useStores();

    const { data, isPending } = EnrollmentService.useEnrollmentList({ params });

    const { mutate: onSuspend, isPending: isSuspending } =
      EnrollmentService.useEnrollmentSuspend();
    const { mutate: onCancel, isPending: isCancelling } =
      EnrollmentService.useEnrollmentCancel();
    const { mutate: onRefund } = EnrollmentService.useEnrollmentRefund();

    const [suspendTarget, setSuspendTarget] = useState<IEnrollment | null>(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [suspendReason, setSuspendReason] = useState("");

    const [cancelTarget, setCancelTarget] = useState<IEnrollment | null>(null);
    const [cancelReason, setCancelReason] = useState("");

    const [transferTarget, setTransferTarget] = useState<IEnrollment | null>(null);

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", "list"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment", "detail"] });
    };
    const onActionError = (error: any) =>
      notification.error({ message: error?.message || t("common.error_message") });

    const handleConfirmSuspend = () => {
      if (!suspendTarget) return;
      onSuspend(
        {
          id: suspendTarget.id,
          params: {
            start_date: startDate,
            end_date: endDate,
            reason: suspendReason.trim(),
          },
        },
        {
          onSuccess: () => {
            invalidate();
            setSuspendTarget(null);
          },
          onError: onActionError,
        },
      );
    };

    const handleConfirmCancel = () => {
      if (!cancelTarget) return;
      onCancel(
        { id: cancelTarget.id, params: { reason: cancelReason.trim() } },
        {
          onSuccess: () => {
            invalidate();
            setCancelTarget(null);
          },
          onError: onActionError,
        },
      );
    };

    const handleRefund = (record: IEnrollment) => {
      confirmDialog.warning({
        title: t("enrollment.refund_title"),
        content: t("enrollment.refund_question"),
        onOk: () =>
          onRefund(
            { id: record.id },
            { onSuccess: invalidate, onError: onActionError },
          ),
      });
    };

    const itemsAction = (record: IEnrollment): DropdownItem[] => {
      const status = record.status ?? "";
      const items: DropdownItem[] = [
        {
          key: "detail",
          label: t("button.detail"),
          onClick: () =>
            isMobile
              ? navigate(ENROLLMENT_PAGE_URL.detail.path(Number(record.id)))
              : setModalData({ open: true, type: "detail", id: record.id }),
        },
        {
          key: "edit",
          label: t("button.edit"),
          onClick: () =>
            isMobile
              ? navigate(ENROLLMENT_PAGE_URL.update.path(Number(record.id)))
              : setModalData({ open: true, type: "update", id: record.id }),
        },
      ];

      if (["pending", "studying"].includes(status)) {
        items.push({
          key: "suspend",
          label: <span className="text-amber-600">{t("enrollment.suspend")}</span>,
          onClick: () => {
            setStartDate("");
            setEndDate("");
            setSuspendReason("");
            setSuspendTarget(record);
          },
        });
        items.push({
          key: "transfer",
          label: <span className="text-blue-600">{t("enrollment.transfer")}</span>,
          onClick: () => setTransferTarget(record),
        });
      }
      if (!["cancelled", "refunded", "completed"].includes(status)) {
        items.push({
          key: "cancel",
          label: <span className="text-red-500">{t("enrollment.cancel")}</span>,
          onClick: () => {
            setCancelReason("");
            setCancelTarget(record);
          },
        });
      }
      if (status !== "refunded") {
        items.push({
          key: "refund",
          label: <span className="text-purple-600">{t("enrollment.refund")}</span>,
          onClick: () => handleRefund(record),
        });
      }
      return items;
    };

    const HeaderTitle = ({ children }: { children: ReactNode }) => (
      <span style={{ color: "#111827" }}>{children}</span>
    );
    const emptyCell = <span className="text-gray-300">—</span>;

    const columns = [
      {
        title: <HeaderTitle>{t("enrollment.student")}</HeaderTitle>,
        key: "student",
        width: 200,
        render: (_: any, record: IEnrollment) => (
          <div className="flex flex-col gap-0.5">
            <span>{record.student?.name || emptyCell}</span>
            {record.student?.code && (
              <span className="text-[12px] text-gray-400">{record.student.code}</span>
            )}
          </div>
        ),
      },
      {
        title: <HeaderTitle>{t("enrollment.class")}</HeaderTitle>,
        key: "class",
        width: 180,
        render: (_: any, record: IEnrollment) => (
          <div className="flex flex-col gap-0.5">
            <span>{record.class?.name || emptyCell}</span>
            {record.class?.code && (
              <span className="text-[12px] text-gray-400">{record.class.code}</span>
            )}
          </div>
        ),
      },
      {
        title: <HeaderTitle>{t("enrollment.course")}</HeaderTitle>,
        key: "course",
        width: 160,
        render: (_: any, record: IEnrollment) => record.course?.name || emptyCell,
      },
      {
        title: <HeaderTitle>{t("enrollment.enrolled_at")}</HeaderTitle>,
        dataIndex: "enrolled_at",
        key: "enrolled_at",
        width: 120,
        align: "center" as const,
        render: (v: string) =>
          v ? new Date(v).toLocaleDateString("vi-VN") : emptyCell,
      },
      {
        title: <HeaderTitle>{t("enrollment.lessons")}</HeaderTitle>,
        key: "lessons",
        width: 120,
        align: "center" as const,
        render: (_: any, record: IEnrollment) => (
          <span className="text-[13px]">
            {record.completed_lessons ?? 0}/{record.total_lessons ?? 0}
          </span>
        ),
      },
      {
        title: <HeaderTitle>{t("enrollment.tuition_amount")}</HeaderTitle>,
        dataIndex: "tuition_amount",
        key: "tuition_amount",
        width: 130,
        align: "right" as const,
        render: (v: number) => money(v),
      },
      {
        title: <HeaderTitle>{t("enrollment.paid_amount")}</HeaderTitle>,
        dataIndex: "paid_amount",
        key: "paid_amount",
        width: 130,
        align: "right" as const,
        render: (v: number) => money(v),
      },
      {
        title: <HeaderTitle>{t("enrollment.debt_amount")}</HeaderTitle>,
        dataIndex: "debt_amount",
        key: "debt_amount",
        width: 130,
        align: "right" as const,
        render: (v: number) => (
          <span className={v > 0 ? "text-red-500 font-medium" : ""}>{money(v)}</span>
        ),
      },
      {
        title: <HeaderTitle>{t("enrollment.status")}</HeaderTitle>,
        dataIndex: "status",
        key: "status",
        width: 140,
        align: "center" as const,
        render: (status: string) => {
          if (!status) return emptyCell;
          const item = globalStore.getMetaItem("enrollment_status", status);
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
        title: <HeaderTitle>{t("button.action")}</HeaderTitle>,
        key: "action",
        width: 80,
        align: "center" as const,
        render: (_: any, record: IEnrollment) => (
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
            rowKey="id"
            columns={columns}
            data={tableData}
            scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
            loading={isPending}
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

        {/* Modal tạm ngưng */}
        <Modal
          title={t("enrollment.suspend_title")}
          open={!!suspendTarget}
          onCancel={() => setSuspendTarget(null)}
          closeIcon={false}
          centered
          width={isMobile ? "92%" : 500}
          className="max-w-[500px]!"
          footer={
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSuspendTarget(null)}
                className="px-4 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                {t("button.cancel")}
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspend}
                disabled={
                  !startDate || !endDate || !suspendReason.trim() || isSuspending
                }
                className="px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSuspending ? t("common.processing") : t("button.save")}
              </button>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-gray-600 font-medium">
                  {t("enrollment.start_date")} <span className="text-red-500">*</span>
                </label>
                <DatePickerField
                  value={startDate}
                  onChange={setStartDate}
                  disableFuture={false}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[13px] text-gray-600 font-medium">
                  {t("enrollment.end_date")} <span className="text-red-500">*</span>
                </label>
                <DatePickerField
                  value={endDate}
                  onChange={setEndDate}
                  disableFuture={false}
                  minDate={startDate}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-gray-600 font-medium">
                {t("common.reason")} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder={t("common.reason_placeholder")}
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </Modal>

        {/* Modal hủy */}
        <Modal
          title={t("enrollment.cancel_title")}
          open={!!cancelTarget}
          onCancel={() => setCancelTarget(null)}
          closeIcon={false}
          centered
          width={isMobile ? "92%" : 500}
          className="max-w-[500px]!"
          footer={
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="px-4 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                {t("button.cancel")}
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={!cancelReason.trim() || isCancelling}
                className="px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCancelling ? t("common.processing") : t("button.save")}
              </button>
            </div>
          }
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] text-gray-600 font-medium">
              {t("common.reason")} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder={t("common.reason_placeholder")}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 resize-none"
            />
          </div>
        </Modal>

        {/* Chuyển lớp */}
        {transferTarget && (
          <TransferStudent
            enrollment={transferTarget}
            open={!!transferTarget}
            onClose={() => setTransferTarget(null)}
          />
        )}
      </>
    );
  },
);

export default EnrollmentTable;
