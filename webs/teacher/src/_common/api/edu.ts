import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

const EDU = `${endpoint}/edu`;

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface ListResult<T> {
  items: T[];
  pagination: Pagination;
}

/**
 * Raw clients for the documented `/v1/edu/*` endpoints (base = VITE_TERA_API + /v1).
 * List endpoints return `{ items, pagination }` inside the `{success,msg,data,code}`
 * envelope, so `result.data.data` is already unwrapped here.
 */
const EduApi = {
  timetableCalendar: async (params: {
    date_from: string;
    date_to: string;
    class_id?: number;
    teacher_id?: number;
    room_id?: number;
  }): Promise<any[]> =>
    await api
      .get(`${EDU}/timetable/calendar`, params)
      .then((r) => r?.data?.data ?? []),

  sessionDetail: async (id: number | string): Promise<any> =>
    await api
      .get(`${EDU}/class-session/detail/${id}`)
      .then((r) => r?.data?.data),

  classRoomDetail: async (id: number | string): Promise<any> =>
    await api
      .get(`${EDU}/class-room/detail/${id}`)
      .then((r) => r?.data?.data),

  attendanceList: async (
    params?: Record<string, unknown>,
  ): Promise<ListResult<any>> =>
    await api.get(`${EDU}/attendance/list`, params).then((r) => r?.data?.data),

  classRoomList: async (
    params?: Record<string, unknown>,
  ): Promise<ListResult<any>> =>
    await api.get(`${EDU}/class-room/list`, params).then((r) => r?.data?.data),

  classRoomSummary: async (
    params?: Record<string, unknown>,
  ): Promise<any> =>
    await api
      .get(`${EDU}/class-room/summary`, params)
      .then((r) => r?.data?.data),

  studentList: async (
    params?: Record<string, unknown>,
  ): Promise<ListResult<any>> =>
    await api.get(`${EDU}/student/list`, params).then((r) => r?.data?.data),

  assignmentList: async (
    params?: Record<string, unknown>,
  ): Promise<ListResult<any>> =>
    await api.get(`${EDU}/assignment/list`, params).then((r) => r?.data?.data),

  lessonPlanList: async (
    params?: Record<string, unknown>,
  ): Promise<ListResult<any>> =>
    await api.get(`${EDU}/lesson-plan/list`, params).then((r) => r?.data?.data),

  dashboardSummary: async (): Promise<any> =>
    await api.get(`${EDU}/dashboard/summary`).then((r) => r?.data?.data),
};

export default EduApi;
