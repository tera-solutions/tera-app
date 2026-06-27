import EduApi from "_common/api/edu";

import type { ScheduleDetail, ScheduleItem } from "../_interface";
import { normalizeSessionDetail, normalizeSessions } from "../normalize";

export interface CalendarParams {
  date_from: string;
  date_to: string;
  class_id?: number;
  teacher_id?: number;
}

const ScheduleApi = {
  getCalendar: async (params: CalendarParams): Promise<ScheduleItem[]> =>
    normalizeSessions(await EduApi.timetableCalendar(params)),
  getDetail: async (id: number | string): Promise<ScheduleDetail> =>
    normalizeSessionDetail(await EduApi.sessionDetail(id)),
};

export default ScheduleApi;
