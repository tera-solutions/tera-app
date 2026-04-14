
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { TeacherPerformanceReportAPI } from "@tera/api/reporting/teacher-performance-report/teacher-performance-report.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useTeacherPerformanceReportList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["teacher-performance-report", "list", payload.params],
    queryFn: () => TeacherPerformanceReportAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useTeacherPerformanceReportDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["teacher-performance-report", "detail", payload.id],
    queryFn: () => TeacherPerformanceReportAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useTeacherPerformanceReportCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => TeacherPerformanceReportAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-performance-report", "list"] });
    },
  });
};

export const useTeacherPerformanceReportUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => TeacherPerformanceReportAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-performance-report", "list"] });
    },
  });
};

export const useTeacherPerformanceReportDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => TeacherPerformanceReportAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-performance-report", "list"] });
    },
  });
};
