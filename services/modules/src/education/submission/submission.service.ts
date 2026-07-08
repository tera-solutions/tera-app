import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { SubmissionAPI, SubmissionListPayload } from "@tera/api";
import { DetailPayload, UpdatePayload } from "@tera/api/_interface";

// QUERY
export const useSubmittedList = (
  payload: SubmissionListPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["submission", "submitted", payload.assignmentId, payload.params],
    queryFn: () => SubmissionAPI.getSubmitted(payload),
    enabled: !!payload.assignmentId,
    keepPreviousData: true,
    ...options,
  });
};

export const useGradedList = (
  payload: SubmissionListPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["submission", "graded", payload.assignmentId, payload.params],
    queryFn: () => SubmissionAPI.getGraded(payload),
    enabled: !!payload.assignmentId,
    keepPreviousData: true,
    ...options,
  });
};

export const useSubmissionDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["submission", "detail", payload.id],
    queryFn: () => SubmissionAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useSubmissionGrade = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => SubmissionAPI.grade(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submission"] });
      queryClient.invalidateQueries({ queryKey: ["assignment", "summary"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useSubmissionUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => SubmissionAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submission"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useSubmissionPublish = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => SubmissionAPI.publish(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submission"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const SubmissionService = {
  useSubmittedList,
  useGradedList,
  useSubmissionDetail,
  useSubmissionGrade,
  useSubmissionUpdate,
  useSubmissionPublish,
};
