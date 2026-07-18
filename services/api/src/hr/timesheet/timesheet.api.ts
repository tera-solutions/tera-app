import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { ListPayload } from "@tera/api/_interface";

/**
 * Khớp `TimesheetController` (`v1/hr/timesheet/*`) — luôn scoped theo giáo viên
 * đang đăng nhập (BE tự resolve từ token, không nhận `teacher_id` từ client).
 */
export const TimesheetAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/hr/timesheet/list`, { ...params, ...params?.filters })
      .then((r) => r.data),

  getSummary: async (params: { date_from?: string; date_to?: string; month?: string } = {}) =>
    await api
      .get(`${endpoint}/hr/timesheet/summary`, { ...params })
      .then((r) => r.data),
};
