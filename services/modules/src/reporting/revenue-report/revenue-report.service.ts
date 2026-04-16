
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { RevenueReportAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

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
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => RevenueReportAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenue-report", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useRevenueReportUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => RevenueReportAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenue-report", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useRevenueReportDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => RevenueReportAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["revenue-report", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useRevenueReportExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => RevenueReportAPI.export(payload),
    onSuccess: (res) => {
      if (res?.data?.link) {
        window.open(res?.data?.link, "_blank");
      }
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const RevenueReportService = {
  useRevenueReportList,
  useRevenueReportDetail,
  useRevenueReportCreate,
  useRevenueReportUpdate,
  useRevenueReportDelete,
  useRevenueReportExport
};
