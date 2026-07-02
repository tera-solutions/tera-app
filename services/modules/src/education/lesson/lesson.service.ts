import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { LessonAPI } from "@tera/api";
import {
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useLessonList = (
  payload: ListPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["lesson", "list", payload.params],
    queryFn: () => LessonAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useLessonDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["lesson", "detail", payload.id],
    queryFn: () => LessonAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION — helper invalidate dùng chung
const useLessonMutation = (
  mutationFn: (payload: UpdatePayload) => Promise<any>,
) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", "list"] });
      queryClient.invalidateQueries({ queryKey: ["lesson", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

// Sinh bài học cho 1 lớp — payload.id = classId
export const useLessonGenerate = () =>
  useLessonMutation((payload) => LessonAPI.generate(payload));

export const useLessonUpdate = () =>
  useLessonMutation((payload) => LessonAPI.update(payload));

export const useLessonReschedule = () =>
  useLessonMutation((payload) => LessonAPI.reschedule(payload));

export const useLessonCancel = () =>
  useLessonMutation((payload) => LessonAPI.cancel(payload));

export const useLessonComplete = () =>
  useLessonMutation((payload: DetailPayload) => LessonAPI.complete(payload));

export const useLessonLock = () =>
  useLessonMutation((payload) => LessonAPI.lock(payload));

export const useLessonUnlock = () =>
  useLessonMutation((payload) => LessonAPI.unlock(payload));

export const LessonService = {
  useLessonList,
  useLessonDetail,
  useLessonGenerate,
  useLessonUpdate,
  useLessonReschedule,
  useLessonCancel,
  useLessonComplete,
  useLessonLock,
  useLessonUnlock,
};
