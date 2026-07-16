import {
  useQueryAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { TeacherReportAPI, TeacherReportSummaryParams } from "@tera/api";

export const useTeacherReportSummary = (
  params: TeacherReportSummaryParams,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["teacher-report", "summary", params],
    queryFn: () => TeacherReportAPI.getSummary(params),
    ...options,
  });
};

export const TeacherReportService = {
  useTeacherReportSummary,
};
