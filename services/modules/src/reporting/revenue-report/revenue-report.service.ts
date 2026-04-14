
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { RevenueReportAPI } from "@tera/api/reporting/revenue-report/revenue-report.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useRevenueReportList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["revenue-report", "list", payload.params],
    queryFn: () => RevenueReportAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useRevenueReportDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["revenue-report", "detail", payload.id],
    queryFn: () => RevenueReportAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useRevenueReportCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => RevenueReportAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenue-report", "list"] });
    },
  });
};

export const useRevenueReportUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => RevenueReportAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenue-report", "list"] });
    },
  });
};

export const useRevenueReportDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => RevenueReportAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenue-report", "list"] });
    },
  });
};
