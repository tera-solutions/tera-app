import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { EvaluationAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useEvaluationList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["evaluation", "list", payload.params],
    queryFn: () => EvaluationAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useEvaluationDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["evaluation", "detail", payload.id],
    queryFn: () => EvaluationAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

export const useEvaluationStudentSummary = (
  params?: Record<string, unknown>,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["evaluation", "student-summary", params],
    queryFn: () => EvaluationAPI.getStudentSummary(params),
    ...options,
  });
};

// MUTATION
export const useEvaluationCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => EvaluationAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation", "list"] });
      queryClient.invalidateQueries({ queryKey: ["evaluation", "student-summary"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useEvaluationUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => EvaluationAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation", "list"] });
      queryClient.invalidateQueries({ queryKey: ["evaluation", "detail"] });
      queryClient.invalidateQueries({ queryKey: ["evaluation", "student-summary"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertEvaluation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return EvaluationAPI.update(payload);
      return EvaluationAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation", "list"] });
      queryClient.invalidateQueries({ queryKey: ["evaluation", "detail"] });
      queryClient.invalidateQueries({ queryKey: ["evaluation", "student-summary"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useEvaluationDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => EvaluationAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

// Vòng đời đánh giá: submit → approve/reject → lock (không body, invalidate list + detail)
const useEvaluationAction = (
  action: (payload: DetailPayload) => Promise<any>,
) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => action(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evaluation", "list"] });
      queryClient.invalidateQueries({ queryKey: ["evaluation", "detail"] });
      queryClient.invalidateQueries({ queryKey: ["evaluation", "student-summary"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useEvaluationSubmit = () => useEvaluationAction(EvaluationAPI.submit);
export const useEvaluationApprove = () => useEvaluationAction(EvaluationAPI.approve);
export const useEvaluationReject = () => useEvaluationAction(EvaluationAPI.reject);
export const useEvaluationLock = () => useEvaluationAction(EvaluationAPI.lock);

export const EvaluationService = {
  useEvaluationList,
  useEvaluationDetail,
  useEvaluationStudentSummary,
  useEvaluationCreate,
  useEvaluationUpdate,
  useUpsertEvaluation,
  useEvaluationDelete,
  useEvaluationSubmit,
  useEvaluationApprove,
  useEvaluationReject,
  useEvaluationLock,
};
