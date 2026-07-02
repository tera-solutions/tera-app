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

export const TimetableService = {
  useTimetableCalendar,
};
