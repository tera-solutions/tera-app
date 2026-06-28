/* Import: library */
import { ReactNode, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import {
  BoltOutlined,
  Button,
  DatePicker,
  DropdownItem,
  LockClosedOutlined,
  Modal,
  PaginationProps,
  PlusOutlined,
  RangePicker,
  notification,
} from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import { useStores } from "@tera/stores/useStores";
import useIsMobile from "@tera/commons/hooks/useIsMobile";

/* Import: services */
import {
  ClassSessionService,
  RoomService,
  TeacherService,
} from "@tera/modules";

/* Import: pages */
import SearchBar from "_common/components/SearchBar";
import FilterSelect from "_common/components/FilterSelect";
import MultiSelect from "_common/components/MultiSelect";
import Pagination from "_common/components/Pagination";
import { IClassSession } from "pages/education/class-room/_interface";
import ClassSessionFormModal from "./ClassSessionFormModal";
import ClassSessionCalendar from "./ClassSessionCalendar";

const DATE_INPUT_CLASS =
  "w-full h-9 border border-gray-300 bg-white px-2 text-[13px] rounded-[3px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 box-border";

const time = (v?: string) => (v ? String(v).slice(0, 5) : "—");
const fmtDate = (v?: string) =>
  v ? new Date(v).toLocaleDateString("vi-VN") : "—";
const money = (v?: number | string) =>
  `${Number(v ?? 0).toLocaleString("vi-VN")} ₫`;

const ClassSessionPanel = observer(({ classId }: { classId?: number }) => {
  const { t } = useTranslation();
  const { globalStore } = useStores();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const statusOptions = globalStore.getOptions("class_session_status") ?? [];

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [teacher, setTeacher] = useState("");
  const [room, setRoom] = useState("");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Options bộ lọc (chưa có catalog tag/phòng → lấy từ data có sẵn)
  const { data: teacherData } = TeacherService.useTeacherList({
    params: { page: 1, per_page: 100 },
  });
  const teacherOptions = (teacherData?.data?.items ?? []).map((tc: any) => ({
    value: String(tc.id),
    label: tc.full_name,
  }));

  const { data: roomData } = RoomService.useRoomList({
    params: { page: 1, per_page: 100, status: "active" },
  });
  const roomItems: any[] = roomData?.data?.items ?? [];
  const roomOptions = roomItems.map((r: any) => {
    const name = r.room_name ?? r.name ?? `#${r.id}`;
    const code = r.room_code ? ` (${r.room_code})` : "";
    const cap = r.capacity != null ? ` · ${r.capacity} ${t("classroom.seats")}` : "";
    return { value: String(r.id), label: `${name}${code}${cap}` };
  });
  // Resolve room_id → tên phòng (session list chỉ trả room_id)
  const roomMap = useMemo(() => {
    const map = new Map<number, string>();
    roomItems.forEach((r: any) =>
      map.set(r.id, r.room_name ?? r.name ?? r.room_code ?? `#${r.id}`),
    );
    return map;
  }, [roomItems]);

  const [modalData, setModalData] = useState<{
    open: boolean;
    type: "create" | "update" | "detail";
    session?: IClassSession | null;
  }>({ open: false, type: "create", session: null });

  const [genOpen, setGenOpen] = useState(false);
  const [gen, setGen] = useState({ from_date: "", to_date: "", override: false });

  const [pendingCancel, setPendingCancel] = useState<IClassSession | null>(null);
  const [reason, setReason] = useState("");

  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const [compact, setCompact] = useState(false);

  const listParams = {
    class_id: classId,
    ...params,
    // Lịch cần đủ buổi (không phân trang)
    per_page: viewMode === "calendar" ? 500 : params.per_page,
    search: search || undefined,
    status: status || undefined,
    teacher_id: teacher || undefined,
    room_id: room || undefined,
    tag_ids: tagIds.length ? tagIds.map(Number) : undefined,
    from_date: fromDate || undefined,
    to_date: toDate || undefined,
    // Mặc định sắp xếp theo STT (session_no) tăng dần — buổi 1 ở trên
    sort_by: "session_no",
    sort_dir: "asc",
  };

  const { data, isPending } = ClassSessionService.useClassSessionList(
    { params: listParams },
    { enabled: !!classId },
  );
  const { mutate: onGenerate, isPending: generating } =
    ClassSessionService.useClassSessionGenerate();
  const { mutate: onCancel, isPending: canceling } =
    ClassSessionService.useClassSessionCancel();
  const { mutate: onDelete } = ClassSessionService.useClassSessionDelete();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["class-session", "list"] });
    // Statistics vận hành (total_sessions...) nằm trong class-room detail → refresh
    queryClient.invalidateQueries({ queryKey: ["class-room", "detail"] });
    queryClient.invalidateQueries({ queryKey: ["class-room", "list"] });
  };

  // Sắp xếp client-side theo session_no tăng dần (phòng backend chưa sort)
  const rows: IClassSession[] = useMemo(
    () =>
      [...(data?.data?.items ?? [])].sort(
        (a: any, b: any) => (a.session_no ?? 0) - (b.session_no ?? 0),
      ),
    [data],
  );

  // Tag options lấy distinct từ data buổi học (chưa có catalog tag riêng)
  const tagOptions = useMemo(() => {
    const map = new Map<string, string>();
    rows.forEach((r) =>
      (r.tags ?? []).forEach((tg: any) => {
        const id = String(tg?.id ?? tg);
        map.set(id, tg?.name ?? tg?.label ?? id);
      }),
    );
    return [...map.entries()].map(([value, label]) => ({ value, label }));
  }, [rows]);

  const pagination = data?.data?.pagination;
  const currentPage = pagination?.current_page || params?.page || 1;
  const totalItems = pagination?.total || 0;
  const perPage = Number(pagination?.per_page || params?.per_page || 20);

  const resetPage = () => setParams((p: any) => ({ ...p, page: 1 }));

  const handleGenerate = () => {
    if (!classId) return;
    onGenerate(
      { params: { class_id: classId, ...gen } },
      {
        onSuccess: () => {
          invalidate();
          notification.success({ message: t("classroom.generate_success") });
          setGenOpen(false);
        },
        onError: (e: any) =>
          notification.error({
            message: e?.message || t("common.error_message"),
          }),
      },
    );
  };

  const handleDelete = (id?: number) => {
    if (!id) return;
    onDelete(
      { id },
      {
        onSuccess: () => {
          invalidate();
          notification.success({ message: t("common.update_success") });
        },
        onError: (e: any) =>
          notification.error({
            message: e?.message || t("common.error_message"),
          }),
      },
    );
  };

  const handleConfirmCancel = () => {
    if (!pendingCancel?.id) return;
    onCancel(
      { id: pendingCancel.id, params: { reason: reason.trim() } },
      {
        onSuccess: () => {
          invalidate();
          notification.success({ message: t("common.update_success") });
          setPendingCancel(null);
        },
        onError: (e: any) =>
          notification.error({
            message: e?.message || t("common.error_message"),
          }),
      },
    );
  };

  const itemsAction = (record: IClassSession): DropdownItem[] => [
    {
      key: "detail",
      label: t("button.detail"),
      onClick: () =>
        setModalData({ open: true, type: "detail", session: record }),
    },
    // Đã chốt điểm danh (attendance_locked) → KHÔNG cho Sửa (theo docs)
    ...(record.attendance_locked
      ? []
      : [
          {
            key: "edit",
            label: t("button.edit"),
            onClick: () =>
              setModalData({ open: true, type: "update", session: record }),
          },
        ]),
    {
      key: "cancel",
      label: <span className="text-yellow-600">{t("classroom.cancel_session")}</span>,
      onClick: () => {
        setReason("");
        setPendingCancel(record);
      },
    },
    {
      key: "delete",
      label: <span className="text-red-500">{t("button.delete")}</span>,
      onClick: () => handleDelete(record.id),
    },
  ];

  const HeaderTitle = ({ children }: { children: ReactNode }) => (
    <span style={{ color: "#111827" }}>{children}</span>
  );

  const numCell = (v: any) =>
    v == null ? <span className="text-gray-300">—</span> : Number(v);

  const columns = [
    {
      title: <HeaderTitle>{t("common.stt")}</HeaderTitle>,
      key: "stt",
      width: 55,
      align: "center" as const,
      render: (_: any, record: IClassSession, index: number) =>
        record.session_no ?? (currentPage - 1) * perPage + index + 1,
    },
    {
      // Buổi học = Tên + Mã + thời gian (ngày + giờ)
      title: <HeaderTitle>{t("classroom.session_col")}</HeaderTitle>,
      key: "session",
      width: 220,
      render: (_: any, r: IClassSession) => (
        <div className="flex flex-col">
          <span className="font-medium text-gray-800">{r.name ?? "—"}</span>
          {r.code && (
            <span className="text-[12px] text-gray-400">{r.code}</span>
          )}
          <span className="text-[12px] text-gray-500">
            {fmtDate(r.session_date)} · {time(r.start_time)}-{time(r.end_time)}
          </span>
        </div>
      ),
    },
    {
      title: <HeaderTitle>{t("classroom.tags")}</HeaderTitle>,
      key: "tags",
      width: 150,
      render: (_: any, r: IClassSession) => {
        const tags = Array.isArray(r.tags) ? r.tags : [];
        if (tags.length === 0)
          return <span className="text-gray-300">—</span>;
        return (
          <div className="flex flex-wrap gap-1">
            {tags.map((tg: any, i: number) => (
              <span
                key={tg?.id ?? i}
                className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium"
                style={{
                  color: tg?.color ?? "#1d4ed8",
                  backgroundColor: tg?.backgroundColor ?? "#dbeafe",
                }}
              >
                {tg?.name ?? tg?.label ?? tg}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      title: <HeaderTitle>{t("classroom.status")}</HeaderTitle>,
      key: "status",
      width: 120,
      align: "center" as const,
      render: (_: any, r: IClassSession) => {
        const item = globalStore.getMetaItem("class_session_status", r.status);
        return (
          <div className="inline-flex items-center gap-1">
            {r.status ? (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium"
                style={{
                  color: item?.color ?? "#374151",
                  backgroundColor: item?.backgroundColor ?? "#f3f4f6",
                }}
              >
                {item?.label ?? r.status}
              </span>
            ) : (
              <span className="text-gray-300">—</span>
            )}
            {r.attendance_locked && (
              <LockClosedOutlined
                className="w-3.5 h-3.5 text-gray-400 shrink-0"
                title={t("classroom.attendance_locked")}
              />
            )}
          </div>
        );
      },
    },
    {
      title: <HeaderTitle>{t("classroom.room")}</HeaderTitle>,
      key: "room",
      width: 120,
      render: (_: any, r: IClassSession) =>
        (r as any).room?.room_name ??
        (r.room_id != null ? roomMap.get(r.room_id) : null) ?? (
          <span className="text-gray-300">—</span>
        ),
    },
    {
      title: <HeaderTitle>{t("classroom.teacher")}</HeaderTitle>,
      key: "teacher",
      width: 150,
      render: (_: any, r: IClassSession) =>
        r.teacher?.full_name ?? <span className="text-gray-300">—</span>,
    },
    {
      title: <HeaderTitle>{t("classroom.attending")}</HeaderTitle>,
      key: "attending",
      width: 110,
      align: "center" as const,
      render: (_: any, r: any) =>
        numCell(
          r.attended_count ??
            r.present_count ??
            r.attending_count ??
            r.students_present ??
            r.attendance?.present,
        ),
    },
    {
      title: <HeaderTitle>{t("classroom.absent")}</HeaderTitle>,
      key: "absent",
      width: 90,
      align: "center" as const,
      render: (_: any, r: any) =>
        numCell(r.absent_count ?? r.absent ?? r.attendance?.absent),
    },
    {
      title: <HeaderTitle>{t("classroom.unmarked")}</HeaderTitle>,
      key: "unmarked",
      width: 110,
      align: "center" as const,
      render: (_: any, r: any) =>
        numCell(
          r.unmarked_count ??
            r.not_marked_count ??
            r.pending_attendance ??
            r.attendance?.unmarked,
        ),
    },
    {
      title: <HeaderTitle>{t("classroom.revenue")}</HeaderTitle>,
      key: "revenue",
      width: 120,
      align: "right" as const,
      render: (_: any, r: IClassSession) => money(r.revenue_amount),
    },
    {
      title: <HeaderTitle>{t("classroom.rating")}</HeaderTitle>,
      key: "rating",
      width: 90,
      align: "center" as const,
      render: (_: any, r: any) => {
        const rating = r.rating ?? r.average_rating ?? r.avg_rating;
        return rating == null ? (
          <span className="text-gray-300">—</span>
        ) : (
          <span className="text-yellow-500 font-medium">★ {rating}</span>
        );
      },
    },
    {
      title: <HeaderTitle>{t("button.action")}</HeaderTitle>,
      key: "action",
      width: 70,
      align: "center" as const,
      fixed: "right" as const,
      render: (_: any, record: IClassSession) => (
        <ActionDropdown dropdownItems={itemsAction(record)} trigger="click" />
      ),
    },
  ];

  // Compact Mode: ẩn nhóm cột thống kê chi tiết
  const STAT_KEYS = ["attending", "absent", "unmarked", "revenue", "rating"];
  const visibleColumns = compact
    ? columns.filter((c) => !STAT_KEYS.includes(c.key))
    : columns;

  const handleChangePage: PaginationProps["onChange"] = (page, pageSize) => {
    setParams((prev: any) => {
      const prevPerPage = Number(prev?.per_page || 20);
      const changed = pageSize !== prevPerPage;
      return { ...prev, page: changed ? 1 : page, per_page: pageSize };
    });
  };

  return (
    <div>
      {/* Toolbar: hàng action (view switch + compact bên trái, nút bên phải) + filter dưới */}
      <div className="flex flex-col gap-2 mb-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Switch Bảng / Lịch */}
            <div className="inline-flex rounded-md border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 text-[12px] font-medium ${
                  viewMode === "table"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {t("classroom.view_table")}
              </button>
              <button
                type="button"
                onClick={() => setViewMode("calendar")}
                className={`px-3 py-1.5 text-[12px] font-medium border-l border-gray-200 ${
                  viewMode === "calendar"
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {t("classroom.view_calendar")}
              </button>
            </div>
            {/* Toggle Thu gọn (chỉ ở dạng bảng) */}
            {viewMode === "table" && (
              <label className="inline-flex items-center gap-1.5 text-[12px] text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={compact}
                  onChange={(e) => setCompact(e.target.checked)}
                />
                {t("classroom.compact")}
              </label>
            )}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button
              onClick={() => {
                setGen({ from_date: "", to_date: "", override: false });
                setGenOpen(true);
              }}
              title={t("classroom.generate_sessions")}
              className="rounded-xsm! bg-white! border! border-blue-500! text-blue-600! hover:bg-blue-50! whitespace-nowrap px-2! xmd:px-3!"
            >
              <BoltOutlined className="w-4 h-4" />
              <span className="hidden xmd:inline ml-1.5">
                {t("classroom.generate_sessions")}
              </span>
            </Button>
            <Button
              onClick={() =>
                setModalData({ open: true, type: "create", session: null })
              }
              title={t("classroom.session_add")}
              className="rounded-xsm! bg-blue-500! text-white! border-none! px-2! xmd:px-3!"
            >
              <PlusOutlined className="w-4 h-4" />
              <span className="hidden xmd:inline ml-1.5">
                {t("classroom.session_add")}
              </span>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-xmd:scrollbar-none">
          <SearchBar
            className="flex-1 min-w-[160px]"
            value={search}
            placeholder={t("classroom.session_search")}
            onChange={(v) => {
              setSearch(v);
              resetPage();
            }}
          />
          <FilterSelect
            className="shrink-0 w-[136px]"
            value={status}
            placeholder={t("classroom.all_status")}
            options={statusOptions.map((o: any) => ({
              value: o.value,
              label: o.label,
            }))}
            onChange={(v) => {
              setStatus(v);
              resetPage();
            }}
          />
          <FilterSelect
            className="shrink-0 w-[136px]"
            value={teacher}
            placeholder={t("classroom.all_teachers")}
            options={teacherOptions}
            onChange={(v) => {
              setTeacher(v);
              resetPage();
            }}
          />
          <FilterSelect
            className="shrink-0 w-[136px]"
            value={room}
            placeholder={t("classroom.all_rooms")}
            options={roomOptions}
            onChange={(v) => {
              setRoom(v);
              resetPage();
            }}
          />
          <div className="shrink-0 w-[140px]">
            <MultiSelect
              options={tagOptions}
              value={tagIds}
              placeholder={t("classroom.all_tags")}
              onChange={(v) => {
                setTagIds(v);
                resetPage();
              }}
            />
          </div>
          {/* Khoảng ngày: desktop dùng RangePicker (popup 2 lịch OK); mobile dùng
              native <input type="date"> — picker là dialog của OS, KHÔNG tràn màn hình */}
          {isMobile ? (
            <div className="shrink-0 flex items-center gap-1 h-9 border border-gray-300 rounded-[3px] px-2">
              <input
                type="date"
                className="bg-transparent text-[13px] text-gray-700 outline-none w-[100px]"
                value={fromDate}
                onChange={(e) => {
                  const v = e.target.value;
                  setFromDate(v);
                  if (v && toDate && toDate < v) setToDate("");
                  resetPage();
                }}
              />
              <span className="text-gray-300 shrink-0">–</span>
              <input
                type="date"
                className="bg-transparent text-[13px] text-gray-700 outline-none w-[100px]"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => {
                  setToDate(e.target.value);
                  resetPage();
                }}
              />
            </div>
          ) : (
            <RangePicker
              className="shrink-0 w-[290px]"
              value={
                fromDate && toDate
                  ? [
                      moment(fromDate, "YYYY-MM-DD"),
                      moment(toDate, "YYYY-MM-DD"),
                    ]
                  : undefined
              }
              format="DD/MM/YYYY"
              placeholder={[t("common.from"), t("common.to")]}
              allowClear
              onChange={(dates: any) => {
                setFromDate(dates?.[0] ? moment(dates[0]).format("YYYY-MM-DD") : "");
                setToDate(dates?.[1] ? moment(dates[1]).format("YYYY-MM-DD") : "");
                resetPage();
              }}
            />
          )}
        </div>
      </div>

      {viewMode === "calendar" ? (
        <ClassSessionCalendar
          sessions={rows}
          onSelect={(s) =>
            setModalData({ open: true, type: "detail", session: s })
          }
        />
      ) : (
        <>
          <TableTera
            rowKey="id"
            columns={visibleColumns}
            data={rows}
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
        </>
      )}

      {/* Form create/update/detail */}
      {modalData.open && (
        <ClassSessionFormModal
          open={modalData.open}
          type={modalData.type}
          classId={classId}
          session={modalData.session}
          tagOptions={tagOptions}
          onClose={() =>
            setModalData({ open: false, type: "create", session: null })
          }
        />
      )}

      {/* Generate modal */}
      <Modal
        title={t("classroom.generate_sessions")}
        open={genOpen}
        onCancel={() => setGenOpen(false)}
        closeIcon={false}
        centered
        width="92%"
        className="max-w-[460px]!"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setGenOpen(false)}
              className="px-4 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50"
            >
              {t("button.cancel")}
            </button>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating || !gen.from_date || !gen.to_date}
              className="px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {generating ? t("common.processing") : t("classroom.generate_sessions")}
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] text-gray-500 mb-1">
                {t("common.from")}
              </label>
              <DatePicker
                className="w-full"
                value={gen.from_date ? moment(gen.from_date, "YYYY-MM-DD") : undefined}
                format="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
                allowClear
                onChange={(date: any) =>
                  setGen((p) => ({
                    ...p,
                    from_date: date ? moment(date).format("YYYY-MM-DD") : "",
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-[12px] text-gray-500 mb-1">
                {t("common.to")}
              </label>
              <DatePicker
                className="w-full"
                value={gen.to_date ? moment(gen.to_date, "YYYY-MM-DD") : undefined}
                format="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
                allowClear
                disabledDate={(d: any) =>
                  !!gen.from_date && d && d.isBefore(moment(gen.from_date, "YYYY-MM-DD"), "day")
                }
                onChange={(date: any) =>
                  setGen((p) => ({
                    ...p,
                    to_date: date ? moment(date).format("YYYY-MM-DD") : "",
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-[13px] text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={gen.override}
                onChange={(e) =>
                  setGen((p) => ({ ...p, override: e.target.checked }))
                }
              />
              {t("classroom.generate_override")}
            </label>
            {gen.override && (
              <p className="text-[12px] text-amber-600 mt-1 pl-6">
                {t("classroom.generate_override_hint")}
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* Cancel modal */}
      <Modal
        title={t("classroom.cancel_session")}
        open={!!pendingCancel}
        onCancel={() => setPendingCancel(null)}
        closeIcon={false}
        centered
        width="92%"
        className="max-w-[500px]!"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPendingCancel(null)}
              className="px-4 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50"
            >
              {t("button.cancel")}
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              disabled={!reason.trim() || canceling}
              className="px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {canceling ? t("common.processing") : t("button.save")}
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
            className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 resize-none"
          />
        </div>
      </Modal>
    </div>
  );
});

export default ClassSessionPanel;
