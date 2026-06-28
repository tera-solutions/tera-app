/* Import: library */
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  PaginationProps,
  notification,
  DropdownItem,
  LockClosedOutlined,
  Modal,
  DatePicker as DatePickerTera,
} from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { IModalProps } from "@tera/commons/interfaces";
import { LESSON_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { LessonService, RoomService } from "@tera/modules";

/* Import: pages */
import Pagination from "_common/components/Pagination";
import {
  ILesson,
  LESSON_STATUS_COLOR,
} from "pages/education/lesson/_interface";

interface LessonTableProps {
  params: any;
  setParams: (v: any) => void;
  setModalData: (v: IModalProps) => void;
}

const SELECT_CLASS =
  "w-full h-9 border border-gray-300 bg-white px-2 text-[13px] rounded-[3px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 box-border";
const TIME_CLASS = SELECT_CLASS;

const fmtDate = (v?: string) =>
  v ? new Date(v).toLocaleDateString("vi-VN") : "—";
const fmtTime = (v?: string) => (v ? String(v).slice(0, 5) : "");

const LessonTable = ({ params, setParams, setModalData }: LessonTableProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data, isPending } = LessonService.useLessonList({ params });
  const { mutate: onReschedule, isPending: isRescheduling } =
    LessonService.useLessonReschedule();
  const { mutate: onCancel, isPending: isCancelling } =
    LessonService.useLessonCancel();
  const { mutate: onUnlock, isPending: isUnlocking } =
    LessonService.useLessonUnlock();
  const { mutate: onLock } = LessonService.useLessonLock();

  const { data: roomData } = RoomService.useRoomList({
    params: { page: 1, per_page: 100, status: "active" },
  });
  const rooms: any[] = roomData?.data?.items ?? [];

  // Đổi lịch
  const [rescheduleTarget, setRescheduleTarget] = useState<ILesson | null>(
    null,
  );
  const [reDate, setReDate] = useState("");
  const [reStart, setReStart] = useState("");
  const [reEnd, setReEnd] = useState("");
  const [reRoom, setReRoom] = useState("");

  // Modal nhập lý do dùng chung cho Hủy + Mở khóa
  const [reasonAction, setReasonAction] = useState<{
    type: "cancel" | "unlock";
    record: ILesson;
  } | null>(null);
  const [reason, setReason] = useState("");

  const openReschedule = (record: ILesson) => {
    setReDate(
      record.lesson_date ? moment(record.lesson_date).format("YYYY-MM-DD") : "",
    );
    setReStart(fmtTime(record.start_time));
    setReEnd(fmtTime(record.end_time));
    setReRoom(record.room_id ? String(record.room_id) : "");
    setRescheduleTarget(record);
  };

  const handleConfirmReschedule = () => {
    if (!rescheduleTarget) return;
    onReschedule(
      {
        id: rescheduleTarget.id,
        params: {
          lesson_date: reDate || undefined,
          start_time: reStart || undefined,
          end_time: reEnd || undefined,
          room_id: reRoom ? Number(reRoom) : undefined,
        },
      },
      {
        onSuccess: () => {
          notification.success({ message: t("lesson.reschedule_success") });
          setRescheduleTarget(null);
        },
        onError: (error: any) =>
          notification.error({
            message: error?.message || t("common.error_message"),
          }),
      },
    );
  };

  const handleConfirmReason = () => {
    if (!reasonAction) return;
    const { type, record } = reasonAction;
    const fn = type === "cancel" ? onCancel : onUnlock;
    fn(
      { id: record.id, params: { reason: reason.trim() } },
      {
        onSuccess: () => {
          notification.success({
            message:
              type === "cancel"
                ? t("lesson.cancel_success")
                : t("lesson.unlock_success"),
          });
          setReasonAction(null);
        },
        onError: (error: any) =>
          notification.error({
            message: error?.message || t("common.error_message"),
          }),
      },
    );
  };

  const handleLock = (record: ILesson) => {
    onLock(
      { id: record.id },
      {
        onSuccess: () =>
          notification.success({ message: t("lesson.lock_success") }),
        onError: (error: any) =>
          notification.error({
            message: error?.message || t("common.error_message"),
          }),
      },
    );
  };

  const itemsAction = (record: ILesson): DropdownItem[] => {
    const isLocked = record.is_locked || record.status === "locked";
    const isCancelled = record.status === "cancelled";
    const isCompleted = record.status === "completed";

    const actions: DropdownItem[] = [
      {
        key: "detail",
        label: t("button.detail"),
        onClick: () =>
          isMobile
            ? navigate(LESSON_PAGE_URL.detail.path(record.id))
            : setModalData({ open: true, type: "detail", id: record.id }),
      },
    ];

    // BR004/BR005: không sửa/đổi lịch/hủy lesson đã hoàn thành hoặc đã khóa
    if (!isLocked && !isCancelled && !isCompleted) {
      actions.push({
        key: "edit",
        label: t("button.edit"),
        onClick: () =>
          isMobile
            ? navigate(LESSON_PAGE_URL.update.path(record.id))
            : setModalData({ open: true, type: "update", id: record.id }),
      });
      actions.push({
        key: "reschedule",
        label: t("lesson.reschedule"),
        onClick: () => openReschedule(record),
      });
      actions.push({
        key: "cancel",
        label: <span className='text-red-500'>{t("lesson.cancel")}</span>,
        onClick: () => {
          setReason("");
          setReasonAction({ type: "cancel", record });
        },
      });
    }
    // Khóa: chỉ buổi đã hoàn thành & chưa khóa
    if (isCompleted && !isLocked) {
      actions.push({
        key: "lock",
        label: t("lesson.lock"),
        onClick: () => handleLock(record),
      });
    }
    // Mở khóa: buổi đang khóa (cần lý do)
    if (isLocked) {
      actions.push({
        key: "unlock",
        label: t("lesson.unlock"),
        onClick: () => {
          setReason("");
          setReasonAction({ type: "unlock", record });
        },
      });
    }
    return actions;
  };

  const HeaderTitle = ({ children }: { children: ReactNode }) => (
    <span style={{ color: "#111827" }}>{children}</span>
  );

  const pagination = data?.data?.pagination;
  const currentPage = pagination?.current_page || params?.page || 1;
  const totalItems = pagination?.total || 0;
  const perPage = Number(pagination?.per_page || params?.per_page || 20);

  const columns = [
    {
      title: <HeaderTitle>{t("lesson.lesson_no")}</HeaderTitle>,
      key: "lesson_no",
      width: 60,
      align: "center" as const,
      render: (_: any, record: ILesson, index: number) =>
        record.lesson_no ?? (currentPage - 1) * perPage + index + 1,
    },
    {
      title: <HeaderTitle>{t("lesson.lesson_title")}</HeaderTitle>,
      dataIndex: "lesson_title",
      key: "lesson_title",
      width: 220,
      align: "center" as const,
      render: (title: string, record: ILesson) => (
        <span className='inline-flex items-center gap-1.5 pl-2'>
          <span className='text-gray-800 font-medium'>{title ?? "—"}</span>
          {(record.is_locked || record.status === "locked") && (
            <LockClosedOutlined className='w-3.5 h-3.5 text-gray-400 shrink-0' />
          )}
        </span>
      ),
    },
    {
      title: <HeaderTitle>{t("lesson.class")}</HeaderTitle>,
      key: "class",
      width: 160,
      align: "center" as const,
      render: (_: any, record: ILesson) => (
        <span className='pl-2'>
          {record.class?.name ?? <span className='text-gray-300'>—</span>}
        </span>
      ),
    },
    {
      title: <HeaderTitle>{t("lesson.lesson_date")}</HeaderTitle>,
      dataIndex: "lesson_date",
      key: "lesson_date",
      width: 120,
      align: "center" as const,
      render: (v: string) => <span className='pl-2'>{fmtDate(v)}</span>,
    },
    {
      title: <HeaderTitle>{t("lesson.time")}</HeaderTitle>,
      key: "time",
      width: 120,
      align: "center" as const,
      render: (_: any, record: ILesson) => (
        <span className='pl-2'>
          {record.start_time
            ? `${fmtTime(record.start_time)} - ${fmtTime(record.end_time)}`
            : "—"}
        </span>
      ),
    },
    {
      title: <HeaderTitle>{t("lesson.teacher")}</HeaderTitle>,
      key: "teacher",
      width: 150,
      align: "center" as const,
      render: (_: any, record: ILesson) => (
        <span className='pl-2'>
          {record.teacher?.full_name ?? record.teacher?.name ?? (
            <span className='text-gray-300'>—</span>
          )}
        </span>
      ),
    },
    {
      title: <HeaderTitle>{t("lesson.room")}</HeaderTitle>,
      key: "room",
      width: 130,
      align: "center" as const,
      render: (_: any, record: ILesson) => (
        <span className='pl-2'>
          {record.room?.room_name ?? record.room?.name ?? (
            <span className='text-gray-300'>—</span>
          )}
        </span>
      ),
    },
    {
      title: <HeaderTitle>{t("lesson.status")}</HeaderTitle>,
      dataIndex: "status",
      key: "status",
      width: 130,
      align: "center" as const,
      render: (status: string) => {
        const cfg = LESSON_STATUS_COLOR[status] ?? {
          color: "#6b7280",
          backgroundColor: "#f3f4f6",
        };
        return (
          <span
            className='inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium ml-2'
            style={{ color: cfg.color, backgroundColor: cfg.backgroundColor }}
          >
            <span
              className='w-1.5 h-1.5 rounded-full shrink-0'
              style={{ backgroundColor: cfg.color }}
            />
            {status ? t(`lesson.status_${status}`) : "—"}
          </span>
        );
      },
    },
    {
      title: <HeaderTitle>{t("button.action")}</HeaderTitle>,
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: any, record: ILesson) => (
        <ActionDropdown dropdownItems={itemsAction(record)} trigger='click' />
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

  const reasonIsCancel = reasonAction?.type === "cancel";

  return (
    <>
      <div style={{ width: "100%", overflowX: "auto", colorScheme: "light" }}>
        <TableTera
          rowKey='id'
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

      {/* Modal Đổi lịch */}
      <Modal
        title={`${t("lesson.reschedule")}: ${rescheduleTarget?.lesson_title ?? ""}`}
        open={!!rescheduleTarget}
        onCancel={() => setRescheduleTarget(null)}
        closeIcon={false}
        centered
        width={isMobile ? "92%" : 480}
        className='max-w-[480px]!'
        footer={
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={() => setRescheduleTarget(null)}
              className='px-4 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50 transition-colors'
            >
              {t("button.cancel")}
            </button>
            <button
              type='button'
              onClick={handleConfirmReschedule}
              disabled={!reDate || !reStart || !reEnd || isRescheduling}
              className='px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {isRescheduling ? t("common.processing") : t("button.save")}
            </button>
          </div>
        }
      >
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[13px] text-gray-600 font-medium'>
              {t("lesson.lesson_date")} <span className='text-red-500'>*</span>
            </label>
            <DatePickerTera
              className='w-full'
              format='DD/MM/YYYY'
              placeholder='dd/mm/yyyy'
              disabledDate={(d: any) => d && d.isBefore(moment(), "day")}
              value={reDate ? moment(reDate, "YYYY-MM-DD") : undefined}
              onChange={(date: any) =>
                setReDate(date ? moment(date).format("YYYY-MM-DD") : "")
              }
            />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col gap-1.5'>
              <label className='text-[13px] text-gray-600 font-medium'>
                {t("lesson.start_time")} <span className='text-red-500'>*</span>
              </label>
              <input
                type='time'
                className={TIME_CLASS}
                value={reStart}
                onChange={(e) => setReStart(e.target.value)}
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <label className='text-[13px] text-gray-600 font-medium'>
                {t("lesson.end_time")} <span className='text-red-500'>*</span>
              </label>
              <input
                type='time'
                className={TIME_CLASS}
                value={reEnd}
                onChange={(e) => setReEnd(e.target.value)}
              />
            </div>
          </div>
          <div className='flex flex-col gap-1.5'>
            <label className='text-[13px] text-gray-600 font-medium'>
              {t("lesson.room")}
            </label>
            <select
              className={SELECT_CLASS}
              style={{ color: reRoom ? "#111827" : "#9ca3af" }}
              value={reRoom}
              onChange={(e) => setReRoom(e.target.value)}
            >
              <option value=''>—</option>
              {rooms.map((r) => (
                <option
                  key={r.id}
                  value={String(r.id)}
                  style={{ color: "#111827" }}
                >
                  {r.room_name ?? r.name ?? `#${r.id}`}
                  {r.room_code ? ` (${r.room_code})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* Modal nhập lý do — Hủy / Mở khóa */}
      <Modal
        title={`${
          reasonIsCancel ? t("lesson.cancel") : t("lesson.unlock")
        }: ${reasonAction?.record?.lesson_title ?? ""}`}
        open={!!reasonAction}
        onCancel={() => setReasonAction(null)}
        closeIcon={false}
        centered
        width={isMobile ? "92%" : 460}
        className='max-w-[460px]!'
        footer={
          <div className='flex justify-end gap-2'>
            <button
              type='button'
              onClick={() => setReasonAction(null)}
              className='px-4 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50 transition-colors'
            >
              {t("button.cancel")}
            </button>
            <button
              type='button'
              onClick={handleConfirmReason}
              disabled={!reason.trim() || isCancelling || isUnlocking}
              className={`px-4 py-1.5 text-[13px] text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                reasonIsCancel
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {isCancelling || isUnlocking
                ? t("common.processing")
                : reasonIsCancel
                  ? t("lesson.cancel")
                  : t("lesson.unlock")}
            </button>
          </div>
        }
      >
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
      </Modal>
    </>
  );
};

export default LessonTable;
