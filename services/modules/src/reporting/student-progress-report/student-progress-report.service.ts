
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
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
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => StudentProgressReportAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-progress-report", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useStudentProgressReportUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => StudentProgressReportAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-progress-report", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useStudentProgressReportDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => StudentProgressReportAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-progress-report", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useStudentProgressReportExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => StudentProgressReportAPI.export(payload),
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

export const StudentProgressReportService = {
  useStudentProgressReportList,
  useStudentProgressReportDetail,
  useStudentProgressReportCreate,
  useStudentProgressReportUpdate,
  useStudentProgressReportDelete,
  useStudentProgressReportExport
};
