/* Import: library */
import { ReactNode } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { ClassScheduleService } from "@tera/modules";

/* Import: pages */
import {
  IClassRoom,
  IClassRoomStatistics,
} from "pages/education/class-room/_interface";

const money = (v?: number | string) =>
  `${Number(v ?? 0).toLocaleString("vi-VN")} ₫`;

// weekday SỐ → i18n key (Thứ2=2..Thứ7=7, CN=1)
const WEEKDAY_KEY: Record<string, string> = {
  "1": "classroom.weekday_sun",
  "2": "classroom.weekday_mon",
  "3": "classroom.weekday_tue",
  "4": "classroom.weekday_wed",
  "5": "classroom.weekday_thu",
  "6": "classroom.weekday_fri",
  "7": "classroom.weekday_sat",
};

export const getClassRoomDetailTabs = (t: (key: string) => string) => [
  { key: "basic", label: t("classroom.tab_basic") },
  { key: "schedule", label: t("classroom.tab_schedule") },
  { key: "students", label: t("classroom.tab_students") },
  { key: "operational", label: t("classroom.tab_operational") },
  { key: "financial", label: t("classroom.tab_financial") },
];

const InfoRow = ({ label, value }: { label: string; value?: ReactNode }) => (
  <div className="flex items-start gap-4 py-2.5">
    <span className="w-36 text-[13px] text-gray-500 shrink-0">{label}</span>
    <span className="text-[13px] text-gray-800 font-medium">
      {value === undefined || value === null || value === "" ? "—" : value}
    </span>
  </div>
);

const StatCard = ({
  label,
  value,
  accent = "text-gray-800",
}: {
  label: string;
  value: string | number;
  accent?: string;
}) => (
  <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5">
    <p className="text-[12px] text-gray-500">{label}</p>
    <p className={`text-base font-bold mt-0.5 ${accent}`}>{value}</p>
  </div>
);

const ClassRoomDetailContent = observer(
  ({
    classRoom,
    statistics,
    activeTab,
  }: {
    classRoom?: IClassRoom;
    statistics?: IClassRoomStatistics;
    activeTab: string;
  }) => {
    const { t } = useTranslation();
    const { globalStore } = useStores();

    // Lịch học đọc từ endpoint riêng class-schedule (theo class_id)
    const { data: scheduleData } = ClassScheduleService.useClassScheduleList(
      { params: { class_id: classRoom?.id } },
      { enabled: !!classRoom?.id },
    );
    const remoteSchedules: any[] = scheduleData?.data ?? [];

    const students = statistics?.students ?? {};
    const op = statistics?.operational ?? {};
    const fin = statistics?.financial ?? {};

    // Thống kê học viên
    if (activeTab === "students") {
      return (
        <div className="grid grid-cols-2 xmd:grid-cols-3 gap-2">
          <StatCard
            label={t("classroom.stat_total_students")}
            value={students.total ?? 0}
          />
          <StatCard
            label={t("classroom.stat_active_students")}
            value={students.active ?? 0}
            accent="text-blue-600"
          />
          <StatCard
            label={t("classroom.stat_reserved_students")}
            value={students.reserved ?? 0}
            accent="text-amber-600"
          />
          <StatCard
            label={t("classroom.stat_completed_students")}
            value={students.completed ?? 0}
            accent="text-emerald-600"
          />
          <StatCard
            label={t("classroom.stat_dropped_students")}
            value={students.dropped ?? 0}
            accent="text-red-500"
          />
        </div>
      );
    }

    // Thống kê vận hành
    if (activeTab === "operational") {
      return (
        <div className="grid grid-cols-2 xmd:grid-cols-3 gap-2">
          <StatCard
            label={t("classroom.stat_total_sessions")}
            value={op.total_sessions ?? 0}
          />
          <StatCard
            label={t("classroom.stat_completed_sessions")}
            value={op.completed_sessions ?? 0}
            accent="text-emerald-600"
          />
          <StatCard
            label={t("classroom.stat_pending_sessions")}
            value={op.pending_sessions ?? 0}
            accent="text-amber-600"
          />
          <StatCard
            label={t("classroom.stat_completion_rate")}
            value={`${op.completion_rate ?? 0}%`}
          />
          <StatCard
            label={t("classroom.stat_avg_attendance")}
            value={`${op.avg_attendance_rate ?? 0}%`}
          />
        </div>
      );
    }

    // Thống kê tài chính
    if (activeTab === "financial") {
      return (
        <div className="grid grid-cols-2 xmd:grid-cols-3 gap-2">
          <StatCard
            label={t("classroom.stat_total_revenue")}
            value={money(fin.total_revenue)}
            accent="text-emerald-600"
          />
          <StatCard
            label={t("classroom.stat_recognized_revenue")}
            value={money(fin.recognized_revenue)}
            accent="text-emerald-600"
          />
          <StatCard
            label={t("classroom.stat_debt")}
            value={money(fin.debt)}
            accent="text-red-500"
          />
          <StatCard
            label={t("classroom.stat_refunds")}
            value={money(fin.refunds)}
            accent="text-amber-600"
          />
        </div>
      );
    }

    // Lịch học: lịch tuần + danh sách buổi học
    if (activeTab === "schedule") {
      const schedules: any[] = remoteSchedules;
      const sessions: any[] = Array.isArray((classRoom as any)?.sessions)
        ? (classRoom as any).sessions
        : [];
      return (
        <div className="flex flex-col gap-4">
          {/* Lịch tuần */}
          <div>
            <p className="text-[13px] font-semibold text-gray-700 mb-2">
              {t("classroom.weekly_schedule")}
            </p>
            {schedules.length === 0 ? (
              <p className="text-[13px] text-gray-400 italic">
                {t("classroom.no_schedule")}
              </p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {schedules.map((s, i) => {
                  const wk = WEEKDAY_KEY[String(s.weekday)];
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
                    >
                      <span className="text-[13px] font-medium text-gray-800 w-20 shrink-0">
                        {wk ? t(wk) : `#${s.weekday ?? "—"}`}
                      </span>
                      <span className="text-[13px] text-gray-600">
                        {(s.start_time ?? "—").slice(0, 5)} -{" "}
                        {(s.end_time ?? "—").slice(0, 5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Danh sách buổi học */}
          <div>
            <p className="text-[13px] font-semibold text-gray-700 mb-2">
              {t("classroom.session_list")}
            </p>
            {sessions.length === 0 ? (
              <p className="text-[13px] text-gray-400 italic">
                {t("classroom.no_session")}
              </p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {sessions.map((s, i) => (
                  <div
                    key={s.id ?? i}
                    className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
                  >
                    <span className="text-[13px] font-medium text-gray-800">
                      {s.name ?? s.title ?? `${t("classroom.session_list")} ${i + 1}`}
                    </span>
                    <span className="text-[13px] text-gray-500">
                      {s.date
                        ? new Date(s.date).toLocaleDateString("vi-VN")
                        : ""}
                      {s.start_time ? ` ${s.start_time}` : ""}
                      {s.end_time ? ` - ${s.end_time}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    // Thông tin cơ bản
    const statusItem = globalStore.getMetaItem(
      "class_status",
      classRoom?.status,
    );
    const learningItem = globalStore.getMetaItem(
      "class_learning_type",
      classRoom?.learning_type,
    );

    return (
      <div className="divide-y divide-gray-100">
        <InfoRow label={t("classroom.name")} value={classRoom?.name} />
        <InfoRow label={t("classroom.code")} value={classRoom?.code} />
        <InfoRow label={t("classroom.course")} value={classRoom?.course?.name} />
        <InfoRow
          label={t("classroom.lesson_plan")}
          value={
            (classRoom?.lesson_plan as any)?.plan_name ??
            classRoom?.lesson_plan?.name
          }
        />
        <InfoRow
          label={t("classroom.status")}
          value={
            classRoom?.status ? (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium"
                style={{
                  color: statusItem?.color,
                  backgroundColor: statusItem?.backgroundColor,
                }}
              >
                {statusItem?.label ?? classRoom.status}
              </span>
            ) : undefined
          }
        />
        <InfoRow
          label={t("classroom.learning_type")}
          value={learningItem?.label ?? classRoom?.learning_type}
        />
        <InfoRow
          label={t("classroom.teacher")}
          value={classRoom?.teacher?.full_name}
        />
        <InfoRow
          label={t("classroom.assignee")}
          value={classRoom?.assignee?.full_name}
        />
        <InfoRow
          label={t("classroom.room")}
          value={classRoom?.room?.room_name}
        />
      </div>
    );
  },
);

export default ClassRoomDetailContent;
