import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { CreatePayload, UpdatePayload } from "@tera/api/_interface";

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
  create: async ({ params }: CreatePayload) =>
    await api.post(`${endpoint}/edu/timetable/create`, params).then((r) => r.data),

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

  // Per-session operations — id is the class session's ID (timetable-management.md §XII).
  changeTeacher: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/timetable/session/${id}/change-teacher`, params)
      .then((r) => r.data),

  changeRoom: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/timetable/session/${id}/change-room`, params)
      .then((r) => r.data),

  reschedule: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/timetable/session/${id}/reschedule`, params)
      .then((r) => r.data),

  cancelSession: async ({ id, params }: UpdatePayload) =>
    await api
      .post(`${endpoint}/edu/timetable/session/${id}/cancel`, params)
      .then((r) => r.data),
};
