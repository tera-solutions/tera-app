import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
} from "@tera/commons/hooks/queryAdapter";
import { ExamAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useExamList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["exam", "list", payload.params],
    queryFn: () => ExamAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useExamDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["exam", "detail", payload.id],
    queryFn: () => ExamAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useExamCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => ExamAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useExamUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ExamAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertExam = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return ExamAPI.update(payload);
      return ExamAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam", "list"] });
      queryClient.invalidateQueries({ queryKey: ["exam", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useExamDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => ExamAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useExamExport = () => {
  const { t } = useTranslation();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => ExamAPI.export(payload),
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

export const ExamService = {
  useExamList,
  useExamDetail,
  useExamCreate,
  useExamUpdate,
  useUpsertExam,
  useExamDelete,
  useExamExport,
};
