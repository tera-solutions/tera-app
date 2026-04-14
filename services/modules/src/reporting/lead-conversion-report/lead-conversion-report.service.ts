
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { LeadConversionReportAPI } from "@tera/api/reporting/lead-conversion-report/lead-conversion-report.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useLeadConversionReportList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["lead-conversion-report", "list", payload.params],
    queryFn: () => LeadConversionReportAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useLeadConversionReportDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["lead-conversion-report", "detail", payload.id],
    queryFn: () => LeadConversionReportAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useLeadConversionReportCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => LeadConversionReportAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-conversion-report", "list"] });
    },
  });
};

export const useLeadConversionReportUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => LeadConversionReportAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-conversion-report", "list"] });
    },
  });
};

export const useLeadConversionReportDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => LeadConversionReportAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-conversion-report", "list"] });
    },
  });
};

export const LeadConversionReportService = {
  useLeadConversionReportList,
  useLeadConversionReportDetail,
  useLeadConversionReportCreate,
  useLeadConversionReportUpdate,
  useLeadConversionReportDelete,
};
