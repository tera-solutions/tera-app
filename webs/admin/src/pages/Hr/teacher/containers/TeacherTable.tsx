/* Import: library */
import { ReactNode, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PaginationProps, notification, DropdownItem, Modal } from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { IModalProps } from "@tera/commons/interfaces";
import { TEACHER_PAGE_URL } from "@tera/commons/constants/url";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { TeacherService } from "@tera/modules";

/* Import: pages */
import Pagination from "_common/components/Pagination";
import { ITeacher } from "pages/Hr/teacher/_interface";

interface TeacherTableProps {
  params: any;
  setParams: (v: any) => void;
  setModalData: (v: IModalProps) => void;
}

const TeacherTable = observer(
  ({ params, setParams, setModalData }: TeacherTableProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { globalStore } = useStores();

    const skillLevelLabels: Record<string, string> = {
      beginner: t("teacher.skill_level_beginner"),
      intermediate: t("teacher.skill_level_intermediate"),
      advanced: t("teacher.skill_level_advanced"),
      expert: t("teacher.skill_level_expert"),
    };
    const isMobile = useIsMobile();
    const { data, isPending } = TeacherService.useTeacherList({ params });
    const { mutate: onSuspend, isPending: isSuspending } =
      TeacherService.useTeacherSuspend();
    const { mutate: onRestore, isPending: isRestoring } =
      TeacherService.useTeacherRestore();
    const { mutate: onResign, isPending: isResigning } =
      TeacherService.useTeacherResign();

    const [pendingStatus, setPendingStatus] = useState<{
      record: ITeacher;
      status: string;
    } | null>(null);
    const [reason, setReason] = useState("");
    const [resignDate, setResignDate] = useState("");

    const handleChangeStatus = (record: ITeacher, status: string) => {
      if (status === "active") {
        onRestore(
          { id: record.id, params: {} },
          {
            onError: (error: any) =>
              notification.error({
                message: error?.message || t("common.error_message"),
              }),
          },
        );
        return;
      }
      setReason("");
      setResignDate("");
      setPendingStatus({ record, status });
    };

    const handleConfirmStatus = () => {
      if (!pendingStatus) return;
      const { record, status } = pendingStatus;
      const isResign = status === "resigned";
      const params: Record<string, any> = { reason };
      if (isResign) params.resigned_at = resignDate;
      const mutate = status === "suspended" ? onSuspend : onResign;
      mutate(
        { id: record.id, params },
        {
          onSuccess: () => setPendingStatus(null),
          onError: (error: any) =>
            notification.error({
              message: error?.message || t("common.error_message"),
            }),
        },
      );
    };

    const itemsAction = (record: ITeacher): DropdownItem[] => [
      {
        key: "detail",
        label: t("button.detail"),
        onClick: () =>
          isMobile
            ? navigate(TEACHER_PAGE_URL.detail.path(record.id))
            : setModalData({ open: true, type: "detail", id: record.id }),
      },
      {
        key: "edit",
        label: t("button.edit"),
        onClick: () =>
          isMobile
            ? navigate(TEACHER_PAGE_URL.update.path(record.id))
            : setModalData({ open: true, type: "update", id: record.id }),
      },
      ...(record.status !== "active"
        ? [
            {
              key: "status-active",
              label: (
                <span className='text-green-600'>
                  {t("teacher.status_active")}
                </span>
              ),
              onClick: () => handleChangeStatus(record, "active"),
            },
          ]
        : []),
      ...(record.status !== "suspended"
        ? [
            {
              key: "status-suspended",
              label: (
                <span className='text-yellow-600'>
                  {t("teacher.status_suspended")}
                </span>
              ),
              onClick: () => handleChangeStatus(record, "suspended"),
            },
          ]
        : []),
      ...(record.status !== "resigned"
        ? [
            {
              key: "status-resigned",
              label: (
                <span className='text-red-500'>
                  {t("teacher.status_resigned")}
                </span>
              ),
              onClick: () => handleChangeStatus(record, "resigned"),
            },
          ]
        : []),
    ];

    const HeaderTitle = ({ children }: { children: ReactNode }) => (
      <span style={{ color: "#111827" }}>{children}</span>
    );

    const columns = [
      {
        title: <HeaderTitle>{t("teacher.code")}</HeaderTitle>,
        dataIndex: "code",
        key: "code",
        width: 120,
      },
      {
        title: <HeaderTitle>{t("teacher.name")}</HeaderTitle>,
        dataIndex: "full_name",
        key: "full_name",
        width: 200,
        render: (name: string, record: ITeacher) => (
          <div className='flex flex-col gap-0.5'>
            <span>{name}</span>
            {record.teacher_type && (
              <span className='inline-block w-fit px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-700'>
                {globalStore.getMetaLabel("teacher_type", record.teacher_type)}
              </span>
            )}
          </div>
        ),
      },
      {
        title: <HeaderTitle>{t("teacher.contact")}</HeaderTitle>,
        key: "contact",
        width: 180,
        render: (_: any, record: ITeacher) => (
          <div className='flex flex-col gap-0.5'>
            {record.phone && (
              <span className='text-[13px] text-gray-800'>{record.phone}</span>
            )}
            {record.email && (
              <span className='text-[12px] text-gray-400'>{record.email}</span>
            )}
            {!record.phone && !record.email && (
              <span className='text-gray-300'>—</span>
            )}
          </div>
        ),
      },
      {
        title: <HeaderTitle>{t("teacher.skill_name")}</HeaderTitle>,
        key: "skills",
        width: 200,
        render: (_: any, record: ITeacher) => {
          const skills = record.skills ?? [];
          if (!skills.length) return <span className='text-gray-300'>—</span>;
          const visible = skills.slice(0, 2);
          const rest = skills.length - 2;
          return (
            <div className='flex flex-wrap gap-1'>
              {visible.map((s) => (
                <span
                  key={s.id}
                  className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[11px] text-blue-700'
                >
                  {s.skill_name}
                  {s.level && (
                    <span className='text-blue-400'>
                      · {skillLevelLabels[s.level] ?? s.level}
                    </span>
                  )}
                </span>
              ))}
              {rest > 0 && (
                <span className='inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-[11px] text-gray-500'>
                  +{rest}
                </span>
              )}
            </div>
          );
        },
      },
      {
        title: <HeaderTitle>{t("teacher.joined_at")}</HeaderTitle>,
        dataIndex: "joined_at",
        key: "joined_at",
        width: 130,
        align: "center" as const,
        render: (value: string) =>
          value ? (
            new Date(value).toLocaleDateString("vi-VN")
          ) : (
            <span className='text-gray-300'>—</span>
          ),
      },
      {
        title: <HeaderTitle>{t("teacher.status")}</HeaderTitle>,
        dataIndex: "status",
        key: "status",
        width: 130,
        align: "center" as const,
        render: (status: string) => {
          const item = globalStore.getMetaItem("teacher_status", status);
          return (
            <span
              className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium'
              style={{
                color: item?.color,
                backgroundColor: item?.backgroundColor,
              }}
            >
              <span
                className='w-1.5 h-1.5 rounded-full shrink-0'
                style={{ backgroundColor: item?.color }}
              />
              {item?.label ?? status}
            </span>
          );
        },
      },
      {
        title: <HeaderTitle>{t("teacher.salary_per_hour")}</HeaderTitle>,
        dataIndex: "hourly_rate",
        key: "hourly_rate",
        width: 150,
        align: "center" as const,
        render: (value: any) => {
          const num = parseFloat(value);
          return isNaN(num) ? value : num.toLocaleString("vi-VN");
        },
      },
      {
        title: <HeaderTitle>{t("button.action")}</HeaderTitle>,
        key: "action",
        width: 80,
        align: "center" as const,
        render: (_: any, record: ITeacher) => (
          <ActionDropdown dropdownItems={itemsAction(record)} trigger='click' />
        ),
      },
    ];

    const pagination = data?.data?.pagination;
    const currentPage = pagination?.current_page || params?.page || 1;
    const lastPage = pagination?.last_page || 1;
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

    const visibleColumns = columns;

    const statusActionLabels: Record<string, string> = {
      suspended: t("teacher.status_suspended"),
      active: t("teacher.status_active"),
      resigned: t("teacher.status_resigned"),
    };

    const isStatusPending = isSuspending || isRestoring || isResigning;

    return (
      <>
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            colorScheme: "light",
          }}
        >
          <TableTera
            rowKey='code'
            columns={visibleColumns}
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

        <Modal
          title={`${t("teacher.change_status")}: ${statusActionLabels[pendingStatus?.status ?? ""] ?? ""}`}
          open={!!pendingStatus}
          onCancel={() => setPendingStatus(null)}
          closeIcon={false}
          centered
          width={isMobile ? "92%" : 500}
          className='max-w-[500px]!'
          footer={
            <div className='flex justify-end gap-2'>
              <button
                type='button'
                onClick={() => setPendingStatus(null)}
                className='px-4 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50 transition-colors'
              >
                {t("button.cancel")}
              </button>
              <button
                type='button'
                onClick={handleConfirmStatus}
                disabled={
                  !reason.trim() ||
                  (pendingStatus?.status === "resigned" && !resignDate) ||
                  isStatusPending
                }
                className='px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {isStatusPending ? t("common.processing") : t("button.save")}
              </button>
            </div>
          }
        >
          <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-1.5'>
              <label className='text-[13px] text-gray-600 font-medium'>
                {t("teacher.reason")} <span className='text-red-500'>*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t("teacher.reason_placeholder")}
                rows={3}
                className='w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 resize-none'
              />
            </div>
            {pendingStatus?.status === "resigned" && (
              <div className='flex flex-col gap-1.5'>
                <label className='text-[13px] text-gray-600 font-medium'>
                  {t("teacher.resigned_date")}{" "}
                  <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  value={resignDate}
                  onChange={(e) => setResignDate(e.target.value)}
                  className='w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500'
                />
              </div>
            )}
          </div>
        </Modal>
      </>
    );
  },
);

export default TeacherTable;
