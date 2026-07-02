/* Import: library */
import { ReactNode, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { useStores } from "@tera/stores/useStores";
import {
  ClassRoomService,
  AttendanceService,
  ClassSessionService,
  EvaluationService,
} from "@tera/modules";

/* Import: pages */
import { IEnrollmentDetail } from "pages/education/enrollment/_interface";

const money = (v?: number) =>
  v != null ? `${Number(v).toLocaleString("vi-VN")} ₫` : "0 ₫";
const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString("vi-VN") : "—";

const InfoRow = ({ label, value }: { label: string; value?: ReactNode }) => (
  <div className="flex items-start gap-4 py-2.5">
    <span className="w-36 text-[13px] text-gray-500 shrink-0">{label}</span>
    <span className="text-[13px] text-gray-800 font-medium">{value ?? "—"}</span>
  </div>
);

const StatCard = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 flex flex-col gap-1">
    <span className="text-[12px] text-gray-500">{label}</span>
    <span className="text-xl font-bold text-blue-600">{value}</span>
  </div>
);

interface Props {
  /** Nguyên `data.data` của detail API. Fallback: nếu backend trả enrollment phẳng thì coi `detail` là enrollment. */
  detail?: IEnrollmentDetail;
}

const EnrollmentDetailContent = observer(({ detail }: Props) => {
  const { t } = useTranslation();
  const { globalStore } = useStores();
  const [activeTab, setActiveTab] = useState("study");

  const enrollment = detail?.enrollment ?? (detail as any);
  const progress = detail?.progress;
  const financial = detail?.financial;
  const paymentsProp = detail?.payments;

  if (!enrollment) return null;
  const e = enrollment as any;

  const statusItem = e.status
    ? globalStore.getMetaItem("enrollment_status", e.status)
    : undefined;

  const total = Number(progress?.total_lessons ?? e.total_lessons ?? 0);
  const completed = Number(progress?.completed_lessons ?? e.completed_lessons ?? 0);
  const completionRate =
    progress?.completion_rate != null
      ? Number(progress.completion_rate)
      : e.completion_rate != null
        ? Number(e.completion_rate)
        : total > 0
          ? Math.round((completed / total) * 100)
          : 0;

  const payments: any[] = paymentsProp ?? e.payments ?? e.payment_history ?? [];
  const transfers: any[] = detail?.transfers ?? e.transfers ?? [];
  const suspensions: any[] = detail?.suspensions ?? e.suspensions ?? [];

  // transfers chỉ có from_class_id/to_class_id → resolve tên lớp qua catalog
  const { data: classListData } = ClassRoomService.useClassRoomList({
    params: { page: 1, per_page: 100 },
  });
  const classMap = useMemo(() => {
    const m = new Map<number, string>();
    const items: any[] = (classListData as any)?.data?.items ?? [];
    items.forEach((c) =>
      m.set(Number(c.id), c.code ? `${c.code} - ${c.name}` : c.name),
    );
    return m;
  }, [classListData]);
  const classLabel = (id?: number | null) =>
    id != null ? (classMap.get(Number(id)) ?? `#${id}`) : "—";

  // Lịch sử học tập — không có trong detail ghi danh → gọi API riêng lọc theo student/class.
  // ⚠️ Param lọc (student_id/class_id/class_room_id) CHƯA verify backend.
  const studentId = e.student_id;
  const classId = e.class_id;
  const { data: attendanceData } = AttendanceService.useAttendanceList({
    params: { per_page: 100, student_id: studentId, class_id: classId },
  });
  // Buổi học (class-session) của lớp — route lồng edu/class-room/:classId/session/list.
  const { data: sessionData } = ClassSessionService.useClassSessionList(
    { params: { per_page: 100, class_id: classId, sort_by: "session_no", sort_dir: "asc" } },
    { enabled: !!classId },
  );
  // Đánh giá HV = evaluation_type "student" + target_id = học viên (target_id là NGƯỜI ĐƯỢC đánh giá,
  // KHÔNG phải student_id). Gửi param cho BE + lọc lại client-side cho chắc (BE có thể bỏ qua param).
  const { data: evaluationData } = EvaluationService.useEvaluationList({
    params: {
      per_page: 100,
      evaluation_type: "student",
      target_id: studentId,
      class_room_id: classId,
    },
  });
  const attendances: any[] = (attendanceData as any)?.data?.items ?? [];
  const sessions: any[] = (sessionData as any)?.data?.items ?? [];
  const evaluations: any[] = ((evaluationData as any)?.data?.items ?? []).filter(
    (ev: any) =>
      (ev.evaluation_type == null || ev.evaluation_type === "student") &&
      (ev.target_id == null || Number(ev.target_id) === Number(studentId)),
  );

  const tabs = [
    { key: "study", label: t("enrollment.tab_study") },
    { key: "progress", label: t("enrollment.tab_progress") },
    { key: "finance", label: t("enrollment.tab_finance") },
    { key: "payments", label: t("enrollment.tab_payments") },
    { key: "history", label: t("enrollment.tab_history") },
    { key: "transfers", label: t("enrollment.tab_transfers") },
    { key: "suspensions", label: t("enrollment.tab_suspensions") },
  ];

  const fmtTime = (v?: string | null) =>
    v && v.length >= 16 ? v.slice(11, 16) : "—";
  // "HH:mm:ss" -> "HH:mm"
  const fmtTime2 = (v?: string | null) => (v ? v.slice(0, 5) : "—");

  const teacherName =
    e.class?.teacher?.full_name ?? e.class?.teacher?.name ?? e.teacher?.full_name;

  return (
    <div>
      {/* Tab bar */}
      <div className="flex overflow-x-auto border-b border-gray-200 mb-4 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-[13px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Thông tin học tập */}
      {activeTab === "study" && (
        <div className="divide-y divide-gray-100">
          <InfoRow
            label={t("enrollment.student")}
            value={
              e.student?.code
                ? `${e.student.code} - ${e.student.name}`
                : e.student?.name
            }
          />
          <InfoRow label={t("enrollment.course")} value={e.course?.name} />
          <InfoRow
            label={t("enrollment.class")}
            value={e.class?.code ? `${e.class.code} - ${e.class.name}` : e.class?.name}
          />
          <InfoRow label={t("enrollment.teacher")} value={teacherName} />
          <InfoRow label={t("enrollment.enrolled_at")} value={fmtDate(e.enrolled_at)} />
          <InfoRow
            label={t("enrollment.status")}
            value={
              e.status ? (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium"
                  style={{
                    color: statusItem?.color ?? "#6b7280",
                    backgroundColor: statusItem?.backgroundColor ?? "#f3f4f6",
                  }}
                >
                  {statusItem?.label ?? e.status}
                </span>
              ) : undefined
            }
          />
        </div>
      )}

      {/* Tiến độ học tập */}
      {activeTab === "progress" && (
        <div className="grid grid-cols-2 xmd:grid-cols-4 gap-3">
          <StatCard label={t("enrollment.total_lessons")} value={total} />
          <StatCard label={t("enrollment.completed_lessons")} value={completed} />
          <StatCard
            label={t("enrollment.remaining_lessons")}
            value={
              progress?.remaining_lessons ??
              e.remaining_lessons ??
              Math.max(total - completed, 0)
            }
          />
          <StatCard
            label={t("enrollment.completion_rate")}
            value={`${completionRate}%`}
          />
        </div>
      )}

      {/* Thông tin tài chính */}
      {activeTab === "finance" && (
        <div className="grid grid-cols-2 xmd:grid-cols-3 gap-3">
          <StatCard
            label={t("enrollment.total_tuition")}
            value={money(financial?.tuition_amount ?? e.tuition_amount)}
          />
          <StatCard
            label={t("enrollment.collected")}
            value={money(financial?.paid_amount ?? e.paid_amount)}
          />
          <StatCard
            label={t("enrollment.debt_amount")}
            value={money(financial?.debt_amount ?? e.debt_amount)}
          />
          <StatCard
            label={t("enrollment.refund_amount")}
            value={money(financial?.refund_amount ?? e.refund_amount ?? e.refunded_amount)}
          />
          <StatCard
            label={t("enrollment.discount_amount")}
            value={money(financial?.discount_amount ?? e.discount_amount)}
          />
        </div>
      )}

      {/* Lịch sử thanh toán */}
      {activeTab === "payments" && (
        <div>
          {payments.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-gray-400">
              {t("enrollment.no_payment")}
            </p>
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="py-2 font-medium">{t("enrollment.payment_date")}</th>
                  <th className="py-2 font-medium">{t("enrollment.amount")}</th>
                  <th className="py-2 font-medium">{t("enrollment.payment_method")}</th>
                  <th className="py-2 font-medium">{t("enrollment.status")}</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <tr key={p.id ?? i} className="border-b border-gray-50">
                    <td className="py-2">
                      {fmtDate(p.paid_at ?? p.payment_date ?? p.created_at)}
                    </td>
                    <td className="py-2">{money(p.amount ?? p.paid_amount)}</td>
                    <td className="py-2">
                      {p.payment_method
                        ? globalStore.getMetaLabel("payment_method", p.payment_method)
                        : (p.method ?? "—")}
                    </td>
                    <td className="py-2">{p.status ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Lịch sử học tập */}
      {activeTab === "history" && (
        <div className="flex flex-col gap-5">
          <section>
            <h4 className="text-[13px] font-semibold text-gray-700 mb-1.5">
              {t("enrollment.history_attendance")}
            </h4>
            <HistoryTable
              items={attendances}
              emptyText={t("enrollment.no_attendance")}
              columns={[
                {
                  header: t("enrollment.lessons"),
                  render: (a) =>
                    a.session?.name ??
                    (a.session?.session_no != null
                      ? `${t("enrollment.lessons")} ${a.session.session_no}`
                      : "—"),
                },
                {
                  header: t("enrollment.payment_date"),
                  render: (a) => fmtDate(a.session?.session_date ?? a.created_at),
                },
                {
                  header: t("enrollment.status"),
                  render: (a) =>
                    a.status_label ??
                    (a.status
                      ? globalStore.getMetaLabel("attendance_status", a.status)
                      : "—"),
                },
                {
                  header: t("lesson.checkin_time"),
                  render: (a) => fmtTime(a.checkin_time),
                },
              ]}
            />
          </section>

          <section>
            <h4 className="text-[13px] font-semibold text-gray-700 mb-1.5">
              {t("enrollment.history_lesson")}
            </h4>
            <HistoryTable
              items={sessions}
              emptyText={t("enrollment.no_lesson")}
              columns={[
                {
                  header: t("lesson.lesson_no"),
                  render: (s) => s.session_no ?? "—",
                },
                {
                  header: t("lesson.lesson_title"),
                  render: (s) => s.name ?? s.code ?? `#${s.id}`,
                },
                {
                  header: t("lesson.lesson_date"),
                  render: (s) => fmtDate(s.session_date),
                },
                {
                  header: t("lesson.time"),
                  render: (s) =>
                    s.start_time
                      ? `${fmtTime2(s.start_time)}${s.end_time ? " - " + fmtTime2(s.end_time) : ""}`
                      : "—",
                },
                {
                  header: t("enrollment.status"),
                  render: (s) =>
                    s.status
                      ? (globalStore.getMetaLabel("class_session_status", s.status) ??
                        s.status)
                      : "—",
                },
              ]}
            />
          </section>

          <section>
            <h4 className="text-[13px] font-semibold text-gray-700 mb-1.5">
              {t("enrollment.history_evaluation")}
            </h4>
            <HistoryTable
              items={evaluations}
              emptyText={t("enrollment.no_evaluation")}
              columns={[
                {
                  header: t("lesson.eval_period"),
                  render: (ev) =>
                    ev.evaluation_period_label ??
                    ev.evaluation_type_label ??
                    ev.evaluation_code ??
                    "—",
                },
                {
                  header: t("lesson.eval_date"),
                  render: (ev) => fmtDate(ev.evaluated_at ?? ev.created_at),
                },
                {
                  header: t("lesson.eval_score"),
                  render: (ev) => (ev.score != null ? `${ev.score}` : "—"),
                },
                {
                  header: t("lesson.eval_comment"),
                  render: (ev) => ev.classification_label ?? ev.status_label ?? "—",
                },
              ]}
            />
          </section>
        </div>
      )}

      {/* Lịch sử chuyển lớp */}
      {activeTab === "transfers" && (
        <HistoryTable
          items={transfers}
          emptyText={t("enrollment.no_transfer")}
          columns={[
            {
              header: t("enrollment.transfer_date"),
              render: (tr) => fmtDate(tr.transfer_date ?? tr.transferred_at ?? tr.created_at),
            },
            {
              header: t("enrollment.from_class"),
              render: (tr) =>
                tr.from_class?.name ??
                tr.from_class_name ??
                classLabel(tr.from_class_id),
            },
            {
              header: t("enrollment.to_class"),
              render: (tr) =>
                tr.to_class?.name ??
                tr.to_class_name ??
                classLabel(tr.to_class_id),
            },
            {
              header: t("enrollment.reason"),
              render: (tr) => tr.reason ?? tr.note ?? "—",
            },
          ]}
        />
      )}

      {/* Lịch sử bảo lưu */}
      {activeTab === "suspensions" && (
        <HistoryTable
          items={suspensions}
          emptyText={t("enrollment.no_suspension")}
          columns={[
            {
              header: t("enrollment.start_date"),
              render: (s) => fmtDate(s.start_date ?? s.suspend_date ?? s.from_date ?? s.created_at),
            },
            {
              header: t("enrollment.end_date"),
              render: (s) => fmtDate(s.end_date ?? s.to_date),
            },
            {
              header: t("enrollment.reason"),
              render: (s) => s.reason ?? s.note ?? "—",
            },
          ]}
        />
      )}
    </div>
  );
});

const HistoryTable = ({
  items,
  emptyText,
  columns,
}: {
  items: any[];
  emptyText: string;
  columns: { header: string; render: (item: any) => ReactNode }[];
}) => {
  if (items.length === 0) {
    return <p className="py-6 text-center text-[13px] text-gray-400">{emptyText}</p>;
  }
  return (
    <table className="w-full text-[13px]">
      <thead>
        <tr className="text-left text-gray-500 border-b border-gray-100">
          {columns.map((c) => (
            <th key={c.header} className="py-2 font-medium">
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items.map((it, i) => (
          <tr key={it.id ?? i} className="border-b border-gray-50">
            {columns.map((c) => (
              <td key={c.header} className="py-2">
                {c.render(it)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EnrollmentDetailContent;
