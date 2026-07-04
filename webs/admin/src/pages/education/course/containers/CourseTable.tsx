/* Import: library */
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  PaginationProps,
  notification,
  DropdownItem,
  BookOpenOutlined,
  Modal,
} from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { IModalProps } from "@tera/commons/interfaces";
import { COURSE_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { CourseService } from "@tera/modules";

/* Import: pages */
import Pagination from "_common/components/Pagination";
import { ICourse } from "pages/education/course/_interface";

interface CourseTableProps {
  params: any;
  setParams: (v: any) => void;
  setModalData: (v: IModalProps) => void;
}

const formatPrice = (value: any) => {
  const num = parseFloat(value);
  return isNaN(num) ? value : num.toLocaleString("vi-VN") + " ₫";
};

const CourseTable = ({ params, setParams, setModalData }: CourseTableProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const { data, isPending } = CourseService.useCourseList({ params });
  const { mutate: onSuspend, isPending: isSuspending } =
    CourseService.useCourseSuspend();
  const { mutate: onRestore, isPending: isRestoring } =
    CourseService.useCourseRestore();
  const isUpdating = isSuspending || isRestoring;

  const [pendingStop, setPendingStop] = useState<ICourse | null>(null);
  const [reason, setReason] = useState("");

  const callbacks = (onDone?: () => void) => ({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", "list"] });
      notification.success({ message: t("common.update_success") });
      onDone?.();
    },
    onError: (error: any) =>
      notification.error({
        message: error?.message || t("common.error_message"),
      }),
  });

  const handleToggleStatus = (record: ICourse) => {
    if (record.is_active) {
      // đang hoạt động → ngừng: cần nhập lý do
      setReason("");
      setPendingStop(record);
    } else {
      // đang ngừng → kích hoạt: restore (không body)
      onRestore({ id: record.id }, callbacks());
    }
  };

  const handleConfirmStop = () => {
    if (!pendingStop) return;
    onSuspend(
      { id: pendingStop.id, params: { reason: reason.trim() } },
      callbacks(() => setPendingStop(null)),
    );
  };

  const itemsAction = (record: ICourse): DropdownItem[] => [
    {
      key: "detail",
      label: t("button.detail"),
      onClick: () =>
        isMobile
          ? navigate(COURSE_PAGE_URL.detail.path(record.id))
          : setModalData({ open: true, type: "detail", id: record.id }),
    },
    {
      key: "edit",
      label: t("button.edit"),
      onClick: () =>
        isMobile
          ? navigate(COURSE_PAGE_URL.update.path(record.id))
          : setModalData({ open: true, type: "update", id: record.id }),
    },
    {
      key: "toggle-status",
      label: record.is_active ? (
        <span className="text-gray-600">{t("course.status_inactive")}</span>
      ) : (
        <span className="text-green-600">{t("course.status_active")}</span>
      ),
      onClick: () => handleToggleStatus(record),
    },
  ];

  const HeaderTitle = ({ children }: { children: ReactNode }) => (
    <span style={{ color: "#111827" }}>{children}</span>
  );

  const columns = [
    {
      title: <HeaderTitle>{t("course.code")}</HeaderTitle>,
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: <HeaderTitle>{t("course.name")}</HeaderTitle>,
      dataIndex: "name",
      key: "name",
      width: 240,
      render: (name: string, record: ICourse) => (
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
            {record.thumbnail ? (
              <img
                src={record.thumbnail}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpenOutlined className="w-4 h-4 text-gray-300" />
            )}
          </div>
          <span className="text-gray-800">{name}</span>
        </div>
      ),
    },
    {
      title: <HeaderTitle>{t("course.business")}</HeaderTitle>,
      key: "business",
      width: 180,
      render: (_: any, record: ICourse) =>
        record.business?.name ?? <span className="text-gray-300">—</span>,
    },
    {
      title: <HeaderTitle>{t("course.duration_minutes")}</HeaderTitle>,
      dataIndex: "duration_minutes",
      key: "duration_minutes",
      width: 130,
      align: "center" as const,
      render: (value: any) =>
        value != null ? (
          `${value} ${t("course.minutes")}`
        ) : (
          <span className="text-gray-300">—</span>
        ),
    },
    {
      title: <HeaderTitle>{t("course.price_per_lesson")}</HeaderTitle>,
      dataIndex: "price_per_lesson",
      key: "price_per_lesson",
      width: 150,
      align: "right" as const,
      render: (value: any) =>
        value != null ? (
          formatPrice(value)
        ) : (
          <span className="text-gray-300">—</span>
        ),
    },
    {
      title: <HeaderTitle>{t("course.status")}</HeaderTitle>,
      dataIndex: "is_active",
      key: "is_active",
      width: 140,
      align: "center" as const,
      render: (isActive: boolean) => {
        const color = isActive ? "#16a34a" : "#6b7280";
        const backgroundColor = isActive ? "#dcfce7" : "#f3f4f6";
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium"
            style={{ color, backgroundColor }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            {isActive
              ? t("course.status_active")
              : t("course.status_inactive")}
          </span>
        );
      },
    },
    {
      title: <HeaderTitle>{t("course.created_at")}</HeaderTitle>,
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
      render: (_: any, record: ICourse) => (
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
          loading={isPending || isUpdating}
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
        title={`${t("course.stop_title")}: ${pendingStop?.name ?? ""}`}
        open={!!pendingStop}
        onCancel={() => setPendingStop(null)}
        closeIcon={false}
        centered
        width={isMobile ? "92%" : 500}
        className="max-w-[500px]!"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPendingStop(null)}
              className="px-4 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              {t("button.cancel")}
            </button>
            <button
              type="button"
              onClick={handleConfirmStop}
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
            {t("course.stop_reason")} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("course.stop_reason_placeholder")}
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 resize-none"
          />
        </div>
      </Modal>
    </>
  );
};

export default CourseTable;
