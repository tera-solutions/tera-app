import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
} from "@tera/commons/hooks/queryAdapter";
import { EvaluationAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useEvaluationList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["evaluation", "list", payload.params],
    queryFn: () => EvaluationAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useEvaluationDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["evaluation", "detail", payload.id],
    queryFn: () => EvaluationAPI.getDetail(payload),
    enabled: !!payload.id,
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
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
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

export const useEvaluationExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => EvaluationAPI.export(payload),
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

export const EvaluationService = {
  useEvaluationList,
  useEvaluationDetail,
  useEvaluationCreate,
  useEvaluationUpdate,
  useUpsertEvaluation,
  useEvaluationDelete,
  useEvaluationExport,
};
