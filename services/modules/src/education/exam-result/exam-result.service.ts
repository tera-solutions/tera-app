import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { ExamResultAPI } from "@tera/api";
import { DetailPayload, UpdatePayload } from "@tera/api/_interface";

// MUTATION
export const useExamResultGrade = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ExamResultAPI.grade(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-session"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useExamResultPublish = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => ExamResultAPI.publish(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-session"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const ExamResultService = {
  useExamResultGrade,
  useExamResultPublish,
};
