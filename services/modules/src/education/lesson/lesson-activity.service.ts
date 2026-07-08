import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import {
  LessonActivityAPI,
  UpdateLessonActivityPayload,
} from "@tera/api";

export const useLessonActivityUpdateStatus = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter<any, Error, UpdateLessonActivityPayload>({
    mutationFn: (payload) => LessonActivityAPI.updateStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const LessonActivityService = {
  useLessonActivityUpdateStatus,
};
