import { useQueries } from "@tanstack/react-query";

import { useQueryLegacy } from "@tera/commons/hooks/tanstack";
import EduApi from "_common/api/edu";

import ScheduleApi, { type CalendarParams } from "./_api";

export const SCHEDULE_KEYS = {
  calendar: (params: CalendarParams) =>
    ["teacher", "timetable", "calendar", params] as const,
  detail: (id: number | string) =>
    ["teacher", "class-session", "detail", id] as const,
  counts: ["teacher", "edu", "counts"] as const,
};

export const useScheduleCalendar = (params: CalendarParams) =>
  useQueryLegacy({
    queryKey: SCHEDULE_KEYS.calendar(params),
    queryFn: () => ScheduleApi.getCalendar(params),
  });

export const useScheduleDetail = (id: number | string | null) =>
  useQueryLegacy({
    queryKey: SCHEDULE_KEYS.detail(id ?? "none"),
    queryFn: () => ScheduleApi.getDetail(id as number),
    enabled: id != null,
  });

/**
 * Class / student totals plus the homeroom class names for the summary widgets.
 * The class query pulls a small page so we can show the class-name tags while
 * still reading `pagination.total` for the count.
 */
export const useTeacherCounts = () => {
  const [classes, students] = useQueries({
    queries: [
      {
        queryKey: [...SCHEDULE_KEYS.counts, "classes"],
        queryFn: () => EduApi.classRoomList({ per_page: 20 }),
      },
      {
        queryKey: [...SCHEDULE_KEYS.counts, "students"],
        queryFn: () => EduApi.studentList({ per_page: 1 }),
      },
    ],
  });

  const classNames = (classes.data?.items ?? [])
    .map((item: any) => item?.name ?? item?.class_name ?? item?.title)
    .filter(Boolean) as string[];

  return {
    totalClasses: classes.data?.pagination?.total ?? 0,
    totalStudents: students.data?.pagination?.total ?? 0,
    classNames,
    isClassesLoading: classes.isLoading,
    isStudentsLoading: students.isLoading,
  };
};
