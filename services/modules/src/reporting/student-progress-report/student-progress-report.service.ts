import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { StudentProgressReportAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useStudentProgressReportList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["student-progress-report", "list", payload.params],
    queryFn: () => StudentProgressReportAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useStudentProgressReportDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["student-progress-report", "detail", payload.id],
    queryFn: () => StudentProgressReportAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useStudentProgressReportCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) =>
      StudentProgressReportAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["student-progress-report", "list"],
      });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useStudentProgressReportUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) =>
      StudentProgressReportAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["student-progress-report", "list"],
      });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertStudentProgressReport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return StudentProgressReportAPI.update(payload);
      return StudentProgressReportAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useStudentProgressReportDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) =>
      StudentProgressReportAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["student-progress-report", "list"],
      });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useStudentProgressReportExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) =>
      StudentProgressReportAPI.export(payload),
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

export const StudentProgressReportService = {
  useStudentProgressReportList,
  useStudentProgressReportDetail,
  useStudentProgressReportCreate,
  useStudentProgressReportUpdate,
  useUpsertStudentProgressReport,
  useStudentProgressReportDelete,
  useStudentProgressReportExport,
};
