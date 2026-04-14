
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { ClassUtilizationReportAPI } from "@tera/api/reporting/class-utilization-report/class-utilization-report.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useClassUtilizationReportList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["class-utilization-report", "list", payload.params],
    queryFn: () => ClassUtilizationReportAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useClassUtilizationReportDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["class-utilization-report", "detail", payload.id],
    queryFn: () => ClassUtilizationReportAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useClassUtilizationReportCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => ClassUtilizationReportAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-utilization-report", "list"] });
    },
  });
};

export const useClassUtilizationReportUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ClassUtilizationReportAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-utilization-report", "list"] });
    },
  });
};

export const useClassUtilizationReportDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => ClassUtilizationReportAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-utilization-report", "list"] });
    },
  });
};

export const ClassUtilizationReportService = {
  useClassUtilizationReportList,
  useClassUtilizationReportDetail,
  useClassUtilizationReportCreate,
  useClassUtilizationReportUpdate,
  useClassUtilizationReportDelete,
};
