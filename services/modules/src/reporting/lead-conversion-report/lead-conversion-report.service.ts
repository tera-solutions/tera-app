import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
} from "@tera/commons/hooks/queryAdapter";
import { LeadConversionReportAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

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
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) =>
      LeadConversionReportAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lead-conversion-report", "list"],
      });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLeadConversionReportUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) =>
      LeadConversionReportAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lead-conversion-report", "list"],
      });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertLeadConversionReport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return LeadConversionReportAPI.update(payload);
      return LeadConversionReportAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLeadConversionReportDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) =>
      LeadConversionReportAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lead-conversion-report", "list"],
      });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLeadConversionReportExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) =>
      LeadConversionReportAPI.export(payload),
    onSuccess: (res) => {
      if (res?.data?.link) {
        window.open(res?.data?.link, "_blank");
      }
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const LeadConversionReportService = {
  useLeadConversionReportList,
  useLeadConversionReportDetail,
  useLeadConversionReportCreate,
  useLeadConversionReportUpdate,
  useUpsertLeadConversionReport,
  useLeadConversionReportDelete,
  useLeadConversionReportExport,
};
