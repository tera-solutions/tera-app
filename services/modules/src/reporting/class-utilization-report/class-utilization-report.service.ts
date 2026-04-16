
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { ClassUtilizationReportAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

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
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => ClassUtilizationReportAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-utilization-report", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useClassUtilizationReportUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ClassUtilizationReportAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-utilization-report", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useClassUtilizationReportDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => ClassUtilizationReportAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-utilization-report", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useClassUtilizationReportExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => ClassUtilizationReportAPI.export(payload),
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

export const ClassUtilizationReportService = {
  useClassUtilizationReportList,
  useClassUtilizationReportDetail,
  useClassUtilizationReportCreate,
  useClassUtilizationReportUpdate,
  useClassUtilizationReportDelete,
  useClassUtilizationReportExport
};
