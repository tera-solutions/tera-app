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
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { ITableProps } from "@tera/commons/interfaces";
import { STUDENT_PAGE_URL } from "@tera/commons/constants/url";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { StudentService, LevelService } from "@tera/modules";

/* Import: pages */
import Pagination from "_common/components/Pagination";
import { IStudent } from "pages/education/student/_interface";

const StudentTable = observer(
  ({ params, setParams, setModalData }: ITableProps<IStudent>) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isMobile = useIsMobile();
    const { globalStore } = useStores();

    const { data, isPending } = StudentService.useStudentList({ params });

    // API student chỉ trả level_id (không kèm object level) → map id→tên qua catalog edu/level
    const { data: levelData } = LevelService.useLevelList({
      params: { page: 1, per_page: 100 },
    });
    const levelMap = new Map<number, string>(
      (levelData?.data?.items ?? []).map((lv: any) => [lv.id, lv.level_name]),
    );
    const { mutate: onSuspend, isPending: isSuspending } =
      StudentService.useStudentSuspend();
    const { mutate: onRestore, isPending: isRestoring } =
      StudentService.useStudentRestore();
    const { mutate: onUpdate } = StudentService.useStudentUpdate();

    const [pendingSuspend, setPendingSuspend] = useState<IStudent | null>(null);
    const [reason, setReason] = useState("");
    const [stopDate, setStopDate] = useState("");

    const invalidateStudent = () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
      queryClient.invalidateQueries({ queryKey: ["student", "detail"] });
    };

    const handleRestore = (record: IStudent) => {
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

    const handleSetStatus = (record: IStudent, status: string) => {
      onUpdate(
        { id: record.id, params: { status } },
        {
          onSuccess: invalidateStudent,
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
        { id: pendingSuspend.id, params: { reason, stop_date: stopDate } },
        {
          onSuccess: () => setPendingSuspend(null),
          onError: (error: any) =>
            notification.error({
              message: error?.message || t("common.error_message"),
            }),
        },
      );
    };

    const graduatedItem = globalStore.getMetaItem(
      "student_status",
      "graduated",
    );
    const droppedItem = globalStore.getMetaItem("student_status", "dropped");

    const itemsAction = (record: IStudent): DropdownItem[] => [
      {
        key: "detail",
        label: t("button.detail"),
        onClick: () =>
          isMobile
            ? navigate(STUDENT_PAGE_URL.detail.path(record.id))
            : setModalData({ open: true, type: "detail", id: record?.id }),
      },
      {
        key: "edit",
        label: t("button.edit"),
        onClick: () =>
          isMobile
            ? navigate(STUDENT_PAGE_URL.update.path(record.id))
            : setModalData({ open: true, type: "update", id: record?.id }),
      },
      ...(record.status !== "active"
        ? [
            {
              key: "status-active",
              label: (
                <span className='text-green-600'>
                  {globalStore.getMetaLabel("student_status", "active") ||
                    t("button.restore")}
                </span>
              ),
              onClick: () => handleRestore(record),
            },
          ]
        : []),
      ...(record.status !== "suspended"
        ? [
            {
              key: "status-suspended",
              label: (
                <span className='text-yellow-600'>
                  {globalStore.getMetaLabel("student_status", "suspended") ||
                    t("button.suspend")}
                </span>
              ),
              onClick: () => {
                setReason("");
                setStopDate("");
                setPendingSuspend(record);
              },
            },
          ]
        : []),
      ...(record.status !== "graduated"
        ? [
            {
              key: "status-graduated",
              label: (
                <span style={{ color: graduatedItem?.color }}>
                  {graduatedItem?.label ?? "graduated"}
                </span>
              ),
              onClick: () => handleSetStatus(record, "graduated"),
            },
          ]
        : []),
      ...(record.status !== "dropped"
        ? [
            {
              key: "status-dropped",
              label: (
                <span style={{ color: droppedItem?.color }}>
                  {droppedItem?.label ?? "dropped"}
                </span>
              ),
              onClick: () => handleSetStatus(record, "dropped"),
            },
          ]
        : []),
    ];

    const HeaderTitle = ({ children }: { children: ReactNode }) => (
      <span style={{ color: "#111827" }}>{children}</span>
    );

    const columns = [
      {
        title: <HeaderTitle>{t("student.code")}</HeaderTitle>,
        dataIndex: "code",
        key: "code",
        width: 120,
      },
      {
        title: <HeaderTitle>{t("student.name")}</HeaderTitle>,
        dataIndex: "name",
        key: "name",
        width: 200,
        render: (name: string, record: IStudent) => (
          <div className='flex flex-col gap-0.5'>
            <span>{name}</span>
            {record.gender && (
              <span className='text-[12px] text-gray-400'>
                {globalStore.getMetaLabel("gender", record.gender)}
              </span>
            )}
          </div>
        ),
      },
      {
        title: <HeaderTitle>{t("student.contact")}</HeaderTitle>,
        key: "contact",
        width: 180,
        render: (_: any, record: IStudent) => (
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
        title: <HeaderTitle>{t("student.dob")}</HeaderTitle>,
        dataIndex: "dob",
        key: "dob",
        width: 120,
        align: "center" as const,
        render: (value: string) =>
          value ? (
            new Date(value).toLocaleDateString("vi-VN")
          ) : (
            <span className='text-gray-300'>—</span>
          ),
      },
      {
        title: <HeaderTitle>{t("student.level")}</HeaderTitle>,
        key: "level",
        width: 100,
        align: "center" as const,
        render: (_: any, record: IStudent) => {
          const levelName =
            record.level?.name ??
            (record.level_id != null
              ? levelMap.get(Number(record.level_id))
              : undefined);
          return levelName ? (
            <span className='inline-block px-2 py-0.5 text-xs rounded bg-indigo-50 text-indigo-700'>
              {levelName}
            </span>
          ) : (
            <span className='text-gray-300'>—</span>
          );
        },
      },
      {
        title: <HeaderTitle>{t("student.branch")}</HeaderTitle>,
        key: "branch",
        width: 160,
        render: (_: any, record: IStudent) =>
          record.branch?.name ?? <span className='text-gray-300'>—</span>,
      },
      {
        title: <HeaderTitle>{t("student.parents")}</HeaderTitle>,
        key: "parents",
        width: 180,
        render: (_: any, record: IStudent) => {
          const parents = record.parents ?? [];
          if (!parents.length) return <span className='text-gray-300'>—</span>;
          const first = parents[0];
          const rest = parents.length - 1;
          return (
            <div className='flex flex-col gap-0.5'>
              <span className='text-[13px] text-gray-800'>{first.name}</span>
              <span className='text-[12px] text-gray-400'>
                {first.phone}
                {rest > 0 && ` · +${rest}`}
              </span>
            </div>
          );
        },
      },
      {
        title: <HeaderTitle>{t("student.enrollment_date")}</HeaderTitle>,
        dataIndex: "enrollment_date",
        key: "enrollment_date",
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
        title: <HeaderTitle>{t("student.status")}</HeaderTitle>,
        dataIndex: "status",
        key: "status",
        width: 130,
        align: "center" as const,
        render: (status: string) => {
          const item = globalStore.getMetaItem("student_status", status);
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
        title: <HeaderTitle>{t("button.action")}</HeaderTitle>,
        key: "action",
        width: 80,
        align: "center" as const,
        render: (_: any, record: IStudent) => (
          <ActionDropdown dropdownItems={itemsAction(record)} trigger='click' />
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
            rowKey={(record: IStudent) => record.id}
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
          title={
            globalStore.getMetaLabel("student_status", "suspended") ||
            t("button.suspend")
          }
          open={!!pendingSuspend}
          onCancel={() => setPendingSuspend(null)}
          closeIcon={false}
          centered
          width={isMobile ? "92%" : 500}
          className='max-w-[500px]!'
          footer={
            <div className='flex justify-end gap-2'>
              <button
                type='button'
                onClick={() => setPendingSuspend(null)}
                className='px-4 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50 transition-colors'
              >
                {t("button.cancel")}
              </button>
              <button
                type='button'
                onClick={handleConfirmSuspend}
                disabled={!reason.trim() || !stopDate || isSuspending}
                className='px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {isSuspending ? t("common.processing") : t("button.save")}
              </button>
            </div>
          }
        >
          <div className='flex flex-col gap-3'>
            <div className='flex flex-col gap-1.5'>
              <label className='text-[13px] text-gray-600 font-medium'>
                {t("student.stop_date")} <span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                value={stopDate}
                onChange={(e) => setStopDate(e.target.value)}
                className='w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500'
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <label className='text-[13px] text-gray-600 font-medium'>
                {t("common.reason")} <span className='text-red-500'>*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t("common.reason_placeholder")}
                rows={3}
                className='w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 resize-none'
              />
            </div>
          </div>
        </Modal>
      </>
    );
  },
);

export default StudentTable;
