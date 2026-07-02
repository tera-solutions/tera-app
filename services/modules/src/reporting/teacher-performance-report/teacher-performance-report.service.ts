import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { TeacherPerformanceReportAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useTeacherPerformanceReportList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["teacher-performance-report", "list", payload.params],
    queryFn: () => TeacherPerformanceReportAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useTeacherPerformanceReportDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["teacher-performance-report", "detail", payload.id],
    queryFn: () => TeacherPerformanceReportAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useTeacherPerformanceReportCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) =>
      TeacherPerformanceReportAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-performance-report", "list"],
      });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useTeacherPerformanceReportUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) =>
      TeacherPerformanceReportAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-performance-report", "list"],
      });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertTeacherPerformanceReport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return TeacherPerformanceReportAPI.update(payload);
      return TeacherPerformanceReportAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useTeacherPerformanceReportDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) =>
      TeacherPerformanceReportAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teacher-performance-report", "list"],
      });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useTeacherPerformanceReportExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) =>
      TeacherPerformanceReportAPI.export(payload),
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

export const TeacherPerformanceReportService = {
  useTeacherPerformanceReportList,
  useTeacherPerformanceReportDetail,
  useTeacherPerformanceReportCreate,
  useTeacherPerformanceReportUpdate,
  useUpsertTeacherPerformanceReport,
  useTeacherPerformanceReportDelete,
  useTeacherPerformanceReportExport,
};
