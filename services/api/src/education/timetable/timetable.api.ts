import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

export interface TimetableCalendarParams {
  date_from: string;
  date_to: string;
  class_id?: number;
  teacher_id?: number;
  room_id?: number;
  branch_id?: number;
  status?: string;
}

export const TimetableAPI = {
  getCalendar: async (params: TimetableCalendarParams) =>
    await api
      .get(`${endpoint}/edu/timetable/calendar`, params)
      .then((result) => result.data),

  getStudentSchedule: async (
    id: string | number,
    params?: { date_from?: string; date_to?: string },
  ) =>
    await api
      .get(`${endpoint}/edu/timetable/student/${id}/schedule`, params)
      .then((result) => result.data),
};
