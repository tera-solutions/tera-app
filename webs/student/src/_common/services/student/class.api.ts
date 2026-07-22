import api from "@tera/api/drivers";

import { IScheduleMonth, IStudentClass, IStudyStats } from "./_interface";
import { buildScheduleMock, classListMock, studyStatsMock } from "./class.mock";
import { USE_MOCK, mocked, studentEndpoint } from "./home.api";

/**
 * [087] Danh sách lớp học — mục 6 của
 * agents/claude/student/tasks/087_danh_sach_lop_hoc_screen.md.
 *
 * ⚠️ Backend chưa có `/api/student/*` (xem `home.api.ts`), nên vẫn chạy mock.
 * Nhánh gọi API thật viết sẵn bên dưới, bật bằng cách tắt `USE_MOCK`.
 */
export const StudentClassAPI = {
  getClasses: async (params?: {
    filter?: string;
    search?: string;
  }): Promise<IStudentClass[]> => {
    if (USE_MOCK) return mocked(classListMock);
    return await api
      .get(`${studentEndpoint}/classes`, params)
      .then((res) => res.data?.data ?? res.data);
  },

  getSchedule: async (year: number, month: number): Promise<IScheduleMonth> => {
    if (USE_MOCK) return mocked(buildScheduleMock(year, month), 150);
    const monthParam = `${year}-${String(month + 1).padStart(2, "0")}`;
    return await api
      .get(`${studentEndpoint}/schedule`, { month: monthParam })
      .then((res) => res.data);
  },

  getStudyStats: async (): Promise<IStudyStats> => {
    if (USE_MOCK) return mocked(studyStatsMock);
    return await api
      .get(`${studentEndpoint}/stats/summary`)
      .then((res) => res.data);
  },
};
