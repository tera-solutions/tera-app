import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { LessonPlanLessonActivityAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";
import {
  CreateLessonPlanLessonActivityParams,
  UpdateLessonPlanLessonActivityParams,
} from "@tera/api/education/lesson-plan-lesson-activity";

const KEY = "lesson-plan-lesson-activity";

const invalidate = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: [KEY, "list"] });
  queryClient.invalidateQueries({ queryKey: ["lesson-plan", "detail"] });
};

// QUERY
export const useLessonPlanLessonActivityList = (
  payload: ListPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: [KEY, "list", payload.params],
    queryFn: () => LessonPlanLessonActivityAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useLessonPlanLessonActivityDetail = (
  payload: DetailPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: [KEY, "detail", payload.id],
    queryFn: () => LessonPlanLessonActivityAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useLessonPlanLessonActivityCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload<CreateLessonPlanLessonActivityParams>) =>
      LessonPlanLessonActivityAPI.create(payload),
    onSuccess: () => invalidate(queryClient),
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLessonPlanLessonActivityUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload<UpdateLessonPlanLessonActivityParams>) =>
      LessonPlanLessonActivityAPI.update(payload),
    onSuccess: () => invalidate(queryClient),
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLessonPlanLessonActivityDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => LessonPlanLessonActivityAPI.delete(payload),
    onSuccess: () => invalidate(queryClient),
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const LessonPlanLessonActivityService = {
  useLessonPlanLessonActivityList,
  useLessonPlanLessonActivityDetail,
  useLessonPlanLessonActivityCreate,
  useLessonPlanLessonActivityUpdate,
  useLessonPlanLessonActivityDelete,
};
