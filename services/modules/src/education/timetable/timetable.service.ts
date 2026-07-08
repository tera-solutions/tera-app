import {
  useQueryAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { TimetableAPI, TimetableCalendarParams } from "@tera/api";

// QUERY
export const useTimetableCalendar = (
  params: TimetableCalendarParams,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["timetable", "calendar", params],
    queryFn: () => TimetableAPI.getCalendar(params),
    ...options,
  });
};

export const useStudentSchedule = (
  id: string | number | undefined,
  params?: { date_from?: string; date_to?: string },
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["timetable", "student-schedule", id, params],
    queryFn: () => TimetableAPI.getStudentSchedule(id as string | number, params),
    enabled: !!id,
    ...options,
  });
};

export const TimetableService = {
  useTimetableCalendar,
  useStudentSchedule,
};
