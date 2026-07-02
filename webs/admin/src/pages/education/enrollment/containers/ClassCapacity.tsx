/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: services */
import { ClassRoomService } from "@tera/modules";

interface ClassCapacityProps {
  classId?: number | string;
  className?: string;
}

/**
 * Hiển thị sĩ số của 1 lớp (Class Capacity) — suy từ class-room detail:
 * sĩ số tối đa (max_capacity) + số HV đang học (statistics.students) + còn trống + cảnh báo đầy.
 */
const ClassCapacity = ({ classId, className }: ClassCapacityProps) => {
  const { t } = useTranslation();

  const { data, isFetching } = ClassRoomService.useClassRoomDetail({
    id: classId,
  });

  if (!classId) return null;

  const classData =
    data?.data?.class ??
    data?.data?.class_room ??
    data?.data?.classRoom ??
    data?.data;
  const students = data?.data?.statistics?.students;

  const max = Number(classData?.max_capacity ?? 0);
  const current = Number(
    students?.active ?? students?.total ?? classData?.total_students ?? 0,
  );
  const remaining = max > 0 ? Math.max(max - current, 0) : undefined;
  const isFull = max > 0 && current >= max;
  const ratio = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  const barColor = isFull
    ? "bg-red-500"
    : ratio >= 80
      ? "bg-amber-500"
      : "bg-emerald-500";

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-gray-50 p-3 ${className ?? ""}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-medium text-gray-700">
          {t("enrollment.class_capacity")}
        </span>
        {isFull && (
          <span className="text-[11px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
            {t("enrollment.class_full")}
          </span>
        )}
      </div>

      {isFetching ? (
        <span className="text-[12px] text-gray-400">{t("common.loading")}</span>
      ) : (
        <>
          <div className="flex items-end gap-1 mb-1.5">
            <span className="text-2xl font-bold text-gray-800">{current}</span>
            <span className="text-[13px] text-gray-400 mb-0.5">
              / {max > 0 ? max : "—"}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
            <div
              className={`h-full ${barColor} transition-all`}
              style={{ width: `${ratio}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-[12px] text-gray-500">
            <span>
              {t("enrollment.current_students")}: {current}
            </span>
            <span>
              {t("enrollment.remaining_slots")}:{" "}
              {remaining != null ? remaining : "—"}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default ClassCapacity;
