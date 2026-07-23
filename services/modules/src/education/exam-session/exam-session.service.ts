import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter, QueryHookOptions } from "@tera/commons/hooks/queryAdapter";
import { ExamSessionAPI } from "@tera/api";
import { CreatePayload, DeletePayload, DetailPayload, ListPayload, UpdatePayload } from "@tera/api/_interface";

// QUERY
export const useExamSessionList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["exam-session", "list", payload.params],
    queryFn: () => ExamSessionAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useExamSessionDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["exam-session", "detail", payload.id],
    queryFn: () => ExamSessionAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useExamSessionCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => ExamSessionAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-session", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useExamSessionUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ExamSessionAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-session", "list"] });
      queryClient.invalidateQueries({ queryKey: ["exam-session", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useExamSessionDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => ExamSessionAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-session", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useExamSessionRegisterByClass = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: { id: number | string; params: { class_room_id: number } }) =>
      ExamSessionAPI.registerByClass(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-session", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useExamSessionRegisterByStudent = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: { id: number | string; params: { student_ids: number[] } }) =>
      ExamSessionAPI.registerByStudent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-session", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const ExamSessionService = {
  useExamSessionList,
  useExamSessionDetail,
  useExamSessionCreate,
  useExamSessionUpdate,
  useExamSessionDelete,
  useExamSessionRegisterByClass,
  useExamSessionRegisterByStudent,
};
