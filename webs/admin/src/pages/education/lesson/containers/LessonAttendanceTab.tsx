/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: services */
import { AttendanceService } from "@tera/modules";

const ATT_STATUS: Record<
  string,
  { label: string; color: string; backgroundColor: string }
> = {
  present: { label: "Có mặt", color: "#16a34a", backgroundColor: "#dcfce7" },
  late: { label: "Đi muộn", color: "#d97706", backgroundColor: "#fef3c7" },
  absent: { label: "Vắng mặt", color: "#dc2626", backgroundColor: "#fee2e2" },
  excused: {
    label: "Vắng có phép",
    color: "#dc2626",
    backgroundColor: "#fee2e2",
  },
};

const fmtTime = (v?: string) => (v ? String(v).slice(11, 16) : "");

/**
 * Tab Điểm danh trong chi tiết bài học — CHỈ dùng endpoint list.
 * Lọc theo `session_id` (= id bài học; backend attendance tham chiếu qua session_id).
 */
const LessonAttendanceTab = ({ lessonId }: { lessonId?: number }) => {
  const { t } = useTranslation();

  const { data, isLoading } = AttendanceService.useAttendanceList({
    params: { session_id: lessonId, per_page: 100 },
  });

  const items: any[] = data?.data?.items ?? [];

  if (isLoading) {
    return (
      <p className="text-[13px] text-gray-400 italic py-2">
        {t("common.loading")}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-[13px] text-gray-400 italic py-2">
        {t("lesson.no_attendance")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-100 rounded">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-gray-50 text-gray-600">
            <th className="text-left px-3 py-2 font-medium w-12">#</th>
            <th className="text-left px-3 py-2 font-medium">
              {t("lesson.student")}
            </th>
            <th className="text-left px-3 py-2 font-medium">
              {t("lesson.checkin_time")}
            </th>
            <th className="text-center px-3 py-2 font-medium">
              {t("lesson.status")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((it, idx) => {
            const cfg = ATT_STATUS[it.status];
            return (
              <tr key={it.id ?? idx}>
                <td className="px-3 py-2 text-gray-500">{idx + 1}</td>
                <td className="px-3 py-2 text-gray-800">
                  {it.student?.name ?? it.student?.full_name ?? "—"}
                  {it.student?.code ? (
                    <span className="text-gray-400"> ({it.student.code})</span>
                  ) : null}
                </td>
                <td className="px-3 py-2 text-gray-600">
                  {fmtTime(it.checkin_time) || "—"}
                </td>
                <td className="px-3 py-2 text-center">
                  <span
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium"
                    style={{
                      color: cfg?.color ?? "#6b7280",
                      backgroundColor: cfg?.backgroundColor ?? "#f3f4f6",
                    }}
                  >
                    {it.status_label ?? cfg?.label ?? it.status ?? "—"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LessonAttendanceTab;
