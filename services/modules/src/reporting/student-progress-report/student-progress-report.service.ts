
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { StudentProgressReportAPI } from "@tera/api/reporting/student-progress-report/student-progress-report.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useStudentProgressReportList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["student-progress-report", "list", payload.params],
    queryFn: () => StudentProgressReportAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useStudentProgressReportDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["student-progress-report", "detail", payload.id],
    queryFn: () => StudentProgressReportAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useStudentProgressReportCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => StudentProgressReportAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-progress-report", "list"] });
    },
  });
};

export const useStudentProgressReportUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => StudentProgressReportAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-progress-report", "list"] });
    },
  });
};

export const useStudentProgressReportDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => StudentProgressReportAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-progress-report", "list"] });
    },
  });
};

export const StudentProgressReportService = {
  useStudentProgressReportList,
  useStudentProgressReportDetail,
  useStudentProgressReportCreate,
  useStudentProgressReportUpdate,
  useStudentProgressReportDelete,
};
