import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { ClassSessionFeedbackAPI } from "@tera/api";
import { CreatePayload, ListPayload } from "@tera/api/_interface";

// QUERY
export const useClassSessionFeedbackList = (
  payload: ListPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["class-session-feedback", "list", payload.params],
    queryFn: () => ClassSessionFeedbackAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

// MUTATION
export const useUpsertClassSessionFeedback = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => ClassSessionFeedbackAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-session-feedback", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const ClassSessionFeedbackService = {
  useClassSessionFeedbackList,
  useUpsertClassSessionFeedback,
};
