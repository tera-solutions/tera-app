import { useQueryAdapter } from "@tera/commons/hooks/queryAdapter";
import { TimetableAPI, TimetableCalendarParams } from "@tera/api";

// QUERY
export const useTimetableCalendar = (params: TimetableCalendarParams) => {
  return useQueryAdapter({
    queryKey: ["timetable", "calendar", params],
    queryFn: () => TimetableAPI.getCalendar(params),
  });
};

export const TimetableService = {
  useTimetableCalendar,
};
