import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { EvaluationCriteriaTemplateAPI } from "@tera/api";
import {
  CreatePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

export const useEvaluationCriteriaTemplateList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["evaluation-criteria-template", "list", payload.params],
    queryFn: () => EvaluationCriteriaTemplateAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useEvaluationCriteriaTemplateDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["evaluation-criteria-template", "detail", payload.id],
    queryFn: () => EvaluationCriteriaTemplateAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

const useEvaluationCriteriaTemplateMutation = <T,>(mutationFn: (payload: T) => Promise<any>) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation-criteria-template"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useEvaluationCriteriaTemplateCreate = () =>
  useEvaluationCriteriaTemplateMutation((payload: CreatePayload) => EvaluationCriteriaTemplateAPI.create(payload));

export const useEvaluationCriteriaTemplateUpdate = () =>
  useEvaluationCriteriaTemplateMutation((payload: UpdatePayload) => EvaluationCriteriaTemplateAPI.update(payload));

export const useEvaluationCriteriaTemplateSuspend = () =>
  useEvaluationCriteriaTemplateMutation((payload: DetailPayload) => EvaluationCriteriaTemplateAPI.suspend(payload));

export const useEvaluationCriteriaTemplateRestore = () =>
  useEvaluationCriteriaTemplateMutation((payload: DetailPayload) => EvaluationCriteriaTemplateAPI.restore(payload));

export const EvaluationCriteriaTemplateService = {
  useEvaluationCriteriaTemplateList,
  useEvaluationCriteriaTemplateDetail,
  useEvaluationCriteriaTemplateCreate,
  useEvaluationCriteriaTemplateUpdate,
  useEvaluationCriteriaTemplateSuspend,
  useEvaluationCriteriaTemplateRestore,
};
