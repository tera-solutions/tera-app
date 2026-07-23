import api from "@tera/api/drivers";

import { IHomeData } from "./_interface";
import { homeMock, unreadNotificationMock } from "./home.mock";

/**
 * Lớp adapter giữa UI và nguồn dữ liệu.
 *
 * ⚠️ Route `/api/student/*` trong spec 086–104 CHƯA tồn tại trên backend
 * (curl 2026-07-22: `GET /api/student/home` → 404 "route could not be found",
 * đối chứng `GET /v1/edu/student/list` → 401). Nên toàn bộ màn học viên đang
 * chạy bằng mock.
 *
 * Khi backend làm xong: đổi `USE_MOCK` thành false (hoặc set biến môi trường
 * `VITE_STUDENT_USE_MOCK=false`) — nhánh gọi API thật đã viết sẵn bên dưới,
 * UI không phải sửa gì vì shape dữ liệu giống hệt.
 */
const env = (import.meta as any)?.env ?? {};

export const USE_MOCK = env.VITE_STUDENT_USE_MOCK !== "false";

export const studentEndpoint = `${env.VITE_TERA_API ?? ""}/api/student`;

/** Giả lập độ trễ mạng để loading state hiển thị đúng như khi gọi API thật */
export const mocked = <T>(data: T, ms = 350): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const StudentHomeAPI = {
  getHome: async (): Promise<IHomeData> => {
    if (USE_MOCK) return mocked(homeMock);
    return await api.get(`${studentEndpoint}/home`).then((res) => res.data);
  },

  getUnreadNotificationCount: async (): Promise<{ count: number }> => {
    if (USE_MOCK) return mocked(unreadNotificationMock);
    return await api
      .get(`${studentEndpoint}/notifications/unread-count`)
      .then((res) => res.data);
  },
};
