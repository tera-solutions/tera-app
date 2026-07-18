import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { QuestionAPI, QuestionCategoryAPI, QuestionTagAPI } from "@tera/api";
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

const invalidateQuestions = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["question"] });
};

export const useQuestionClone = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => QuestionAPI.clone(payload),
    onSuccess: () => invalidateQuestions(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useQuestionReview = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => QuestionAPI.review(payload),
    onSuccess: () => invalidateQuestions(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useQuestionApprove = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => QuestionAPI.approve(payload),
    onSuccess: () => invalidateQuestions(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useQuestionActivate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => QuestionAPI.activate(payload),
    onSuccess: () => invalidateQuestions(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useQuestionArchive = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => QuestionAPI.archive(payload),
    onSuccess: () => invalidateQuestions(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const QuestionService = {
  useQuestionList,
  useQuestionDetail,
  useQuestionCreate,
  useQuestionUpdate,
  useUpsertQuestion,
  useQuestionDelete,
  useQuestionClone,
  useQuestionReview,
  useQuestionApprove,
  useQuestionActivate,
  useQuestionArchive,
};

// ===== Categories =====

export const useQuestionCategoryList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["question-category", "list", payload.params],
    queryFn: () => QuestionCategoryAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

const invalidateCategories = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["question-category"] });
};

export const useQuestionCategoryCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => QuestionCategoryAPI.create(payload),
    onSuccess: () => invalidateCategories(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useQuestionCategoryUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => QuestionCategoryAPI.update(payload),
    onSuccess: () => invalidateCategories(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useQuestionCategoryDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => QuestionCategoryAPI.delete(payload),
    onSuccess: () => invalidateCategories(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const QuestionCategoryService = {
  useQuestionCategoryList,
  useQuestionCategoryCreate,
  useQuestionCategoryUpdate,
  useQuestionCategoryDelete,
};

// ===== Tags =====

export const useQuestionTagList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["question-tag", "list", payload.params],
    queryFn: () => QuestionTagAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

const invalidateTags = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["question-tag"] });
};

export const useQuestionTagCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => QuestionTagAPI.create(payload),
    onSuccess: () => invalidateTags(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useQuestionTagUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => QuestionTagAPI.update(payload),
    onSuccess: () => invalidateTags(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useQuestionTagDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => QuestionTagAPI.delete(payload),
    onSuccess: () => invalidateTags(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const QuestionTagService = {
  useQuestionTagList,
  useQuestionTagCreate,
  useQuestionTagUpdate,
  useQuestionTagDelete,
};
