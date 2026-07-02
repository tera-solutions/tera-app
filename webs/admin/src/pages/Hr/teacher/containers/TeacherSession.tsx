/* Import: library */
import { useMemo } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { ClassRoomService, ClassSessionService } from "@tera/modules";

const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString("vi-VN") : "—";
const fmtTime = (v?: string | null) => (v ? v.slice(0, 5) : "—");

/**
 * Buổi học của 1 lớp (route lồng edu/class-room/:classId/session/list).
 * Render tên lớp + bảng buổi học của lớp đó.
 */
const ClassSessionGroup = observer(
  ({ classInfo }: { classInfo: any }) => {
    const { t } = useTranslation();
    const { globalStore } = useStores();

    const { data, isLoading } = ClassSessionService.useClassSessionList(
      {
        params: {
          class_id: classInfo.id,
          per_page: 100,
          sort_by: "session_no",
          sort_dir: "asc",
        },
      },
      { enabled: !!classInfo?.id },
    );

    const sessions: any[] = (data as any)?.data?.items ?? [];

    return (
      <div className="mb-4">
        <div className="bg-gray-100 px-3 py-1.5 rounded text-[13px] font-semibold text-gray-700">
          {classInfo.code ? `${classInfo.code} - ${classInfo.name}` : classInfo.name}
        </div>
        {isLoading ? (
          <p className="text-[13px] text-gray-400 italic py-2 px-3">
            {t("common.loading")}
          </p>
        ) : sessions.length === 0 ? (
          <p className="text-[13px] text-gray-400 italic py-2 px-3">
            {t("classroom.no_session")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="px-3 py-2 font-medium">{t("classroom.session_no")}</th>
                  <th className="px-3 py-2 font-medium">{t("classroom.session_name")}</th>
                  <th className="px-3 py-2 font-medium">{t("classroom.session_date")}</th>
                  <th className="px-3 py-2 font-medium">{t("classroom.session_time")}</th>
                  <th className="px-3 py-2 font-medium">{t("classroom.teacher")}</th>
                  <th className="px-3 py-2 font-medium">{t("classroom.status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sessions.map((s) => {
                  const statusItem = s.status
                    ? globalStore.getMetaItem("class_session_status", s.status)
                    : undefined;
                  const teacherName =
                    s.teacher?.full_name ??
                    s.substitute_teacher?.full_name ??
                    "—";
                  return (
                    <tr key={s.id}>
                      <td className="px-3 py-2 text-gray-800">{s.session_no ?? "—"}</td>
                      <td className="px-3 py-2">
                        <div className="text-gray-800">{s.name ?? s.code ?? `#${s.id}`}</div>
                        {s.code && (
                          <div className="text-[11px] text-gray-400">{s.code}</div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-gray-800">{fmtDate(s.session_date)}</td>
                      <td className="px-3 py-2 text-gray-800">
                        {s.start_time
                          ? `${fmtTime(s.start_time)}${s.end_time ? " - " + fmtTime(s.end_time) : ""}`
                          : "—"}
                      </td>
                      <td className="px-3 py-2 text-gray-800">{teacherName}</td>
                      <td className="px-3 py-2">
                        {s.status ? (
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium"
                            style={{
                              color: statusItem?.color ?? "#6b7280",
                              backgroundColor:
                                statusItem?.backgroundColor ?? "#f3f4f6",
                            }}
                          >
                            {statusItem?.label ?? s.status}
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
        )}
      </div>
    );
  },
);

/**
 * Tab Buổi học trong chi tiết giáo viên — KHÔNG có endpoint "buổi học theo GV".
 * Lấy các lớp GV phụ trách (teacher_id) rồi fetch buổi học TỪNG lớp (route lồng),
 * gom nhóm hiển thị theo lớp.
 */
const TeacherSession = observer(({ teacherId }: { teacherId?: number }) => {
  const { t } = useTranslation();

  const { data, isLoading } = ClassRoomService.useClassRoomList({
    params: { per_page: 100, teacher_id: teacherId },
  });

  const classes: any[] = useMemo(() => {
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

  if (classes.length === 0) {
    return (
      <p className="text-[13px] text-gray-400 italic py-2">
        {t("common.no_data")}
      </p>
    );
  }

  return (
    <div>
      {classes.map((c) => (
        <ClassSessionGroup key={c.id} classInfo={c} />
      ))}
    </div>
  );
});

export default TeacherSession;
