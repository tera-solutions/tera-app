import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

export interface TeacherReportSummaryParams {
  class_id?: number;
  date_from?: string;
  date_to?: string;
}

export const TeacherReportAPI = {
  getSummary: async (params: TeacherReportSummaryParams) =>
    await api
      .get(`${endpoint}/edu/teacher-report/summary`, params)
      .then((r) => r.data),
};
