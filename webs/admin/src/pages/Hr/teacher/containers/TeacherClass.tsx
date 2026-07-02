/* Import: library */
import { useMemo } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { ClassRoomService } from "@tera/modules";

const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString("vi-VN") : "—";

/**
 * Tab Lớp học trong chi tiết giáo viên — các lớp GV phụ trách (teacher_id = id GV).
 * Lọc lại client-side cho chắc (BE có thể bỏ qua param).
 */
const TeacherClass = observer(({ teacherId }: { teacherId?: number }) => {
  const { t } = useTranslation();
  const { globalStore } = useStores();

  const { data, isLoading } = ClassRoomService.useClassRoomList({
    params: { per_page: 100, teacher_id: teacherId },
  });

  const items: any[] = useMemo(() => {
    const list = (data as any)?.data?.items ?? [];
    return list.filter(
      (c: any) =>
        c.teacher_id == null || Number(c.teacher_id) === Number(teacherId),
    );
  }, [data, teacherId]);

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
        {t("common.no_data")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="bg-gray-50 text-left text-gray-500">
            <th className="px-3 py-2 font-medium">{t("classroom.name")}</th>
            <th className="px-3 py-2 font-medium">{t("classroom.course")}</th>
            <th className="px-3 py-2 font-medium">{t("classroom.room")}</th>
            <th className="px-3 py-2 font-medium">{t("classroom.learning_type")}</th>
            <th className="px-3 py-2 font-medium">{t("classroom.start_date")}</th>
            <th className="px-3 py-2 font-medium">{t("classroom.max_capacity")}</th>
            <th className="px-3 py-2 font-medium">{t("classroom.status")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((c) => {
            const statusItem = c.status
              ? globalStore.getMetaItem("class_status", c.status)
              : undefined;
            return (
              <tr key={c.id}>
                <td className="px-3 py-2">
                  <div className="font-medium text-gray-800">{c.name}</div>
                  {c.code && (
                    <div className="text-[11px] text-gray-400">{c.code}</div>
                  )}
                </td>
                <td className="px-3 py-2 text-gray-800">{c.course?.name ?? "—"}</td>
                <td className="px-3 py-2 text-gray-800">
                  {c.room?.room_name ?? c.room?.name ?? "—"}
                </td>
                <td className="px-3 py-2 text-gray-800">
                  {c.learning_type
                    ? globalStore.getMetaLabel("class_learning_type", c.learning_type)
                    : "—"}
                </td>
                <td className="px-3 py-2 text-gray-800">{fmtDate(c.start_date)}</td>
                <td className="px-3 py-2 text-gray-800">{c.max_capacity ?? "—"}</td>
                <td className="px-3 py-2">
                  {c.status ? (
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium"
                      style={{
                        color: statusItem?.color ?? "#6b7280",
                        backgroundColor: statusItem?.backgroundColor ?? "#f3f4f6",
                      }}
                    >
                      {statusItem?.label ?? c.status}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});

export default TeacherClass;
