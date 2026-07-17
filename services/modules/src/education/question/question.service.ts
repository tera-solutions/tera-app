import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { QuestionAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useQuestionList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["question", "list", payload.params],
    queryFn: () => QuestionAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useQuestionDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["question", "detail", payload.id],
    queryFn: () => QuestionAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useQuestionCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => QuestionAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useQuestionUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => QuestionAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertQuestion = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return QuestionAPI.update(payload);
      return QuestionAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", "list"] });
      queryClient.invalidateQueries({ queryKey: ["question", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useQuestionDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => QuestionAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const QuestionService = {
  useQuestionList,
  useQuestionDetail,
  useQuestionCreate,
  useQuestionUpdate,
  useUpsertQuestion,
  useQuestionDelete,
};
