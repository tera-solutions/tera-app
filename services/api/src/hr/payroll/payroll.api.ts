import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { DetailPayload, ListPayload } from "@tera/api/_interface";

export interface GeneratePayrollParams {
  teacher_id: number;
  month: number;
  year: number;
}

/**
 * Khớp `PayrollController` (`v1/hr/payroll/*`) — `list`/`detail` luôn scoped theo
 * giáo viên đang đăng nhập. `generate` là self-service (chỉ tính lại lương của
 * chính mình từ giờ dạy thực tế) — backend khóa `teacher_id`/bỏ qua `bonus`,
 * `penalty` với tài khoản không phải admin.
 */
export const PayrollAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/hr/payroll/list`, { ...params, ...params?.filters })
      .then((r) => r.data),

  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/hr/payroll/detail/${id}`)
      .then((r) => r.data),

  generate: async (params: GeneratePayrollParams) =>
    await api
      .post(`${endpoint}/hr/payroll/generate`, params)
      .then((r) => r.data),
};
