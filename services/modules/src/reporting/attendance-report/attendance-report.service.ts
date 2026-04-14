
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { AttendanceReportAPI } from "@tera/api/reporting/attendance-report/attendance-report.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useAttendanceReportList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["attendance-report", "list", payload.params],
    queryFn: () => AttendanceReportAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useAttendanceReportDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["attendance-report", "detail", payload.id],
    queryFn: () => AttendanceReportAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useAttendanceReportCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => AttendanceReportAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-report", "list"] });
    },
  });
};

export const useAttendanceReportUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => AttendanceReportAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-report", "list"] });
    },
  });
};

export const useAttendanceReportDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => AttendanceReportAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-report", "list"] });
    },
  });
};

export const AttendanceReportService = {
  useAttendanceReportList,
  useAttendanceReportDetail,
  useAttendanceReportCreate,
  useAttendanceReportUpdate,
  useAttendanceReportDelete,
};
