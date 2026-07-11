import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { LessonPlanLessonAPI } from "@tera/api";
import { DetailPayload, UpdatePayload } from "@tera/api/_interface";
import { LessonPlanLessonParams } from "@tera/api/education/lesson-plan-lesson";

const invalidatePlan = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["lesson-plan", "detail"] });
  queryClient.invalidateQueries({ queryKey: ["lesson-plan", "list"] });
};

export const useLessonPlanLessonCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload<LessonPlanLessonParams>) =>
      LessonPlanLessonAPI.create(payload),
    onSuccess: () => invalidatePlan(queryClient),
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLessonPlanLessonUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload<LessonPlanLessonParams>) =>
      LessonPlanLessonAPI.update(payload),
    onSuccess: () => invalidatePlan(queryClient),
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLessonPlanLessonDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => LessonPlanLessonAPI.delete(payload),
    onSuccess: () => invalidatePlan(queryClient),
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLessonPlanLessonReorder = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload<{ lesson_ids: (number | string)[] }>) =>
      LessonPlanLessonAPI.reorder(payload),
    onSuccess: () => invalidatePlan(queryClient),
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const LessonPlanLessonService = {
  useLessonPlanLessonCreate,
  useLessonPlanLessonUpdate,
  useLessonPlanLessonDelete,
  useLessonPlanLessonReorder,
};
