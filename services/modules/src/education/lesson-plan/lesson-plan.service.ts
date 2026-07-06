import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { LessonPlanAPI } from "@tera/api";
import {
  CreatePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useLessonPlanList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["lesson-plan", "list", payload.params],
    queryFn: () => LessonPlanAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useLessonPlanDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["lesson-plan", "detail", payload.id],
    queryFn: () => LessonPlanAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useLessonPlanCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => LessonPlanAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-plan", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLessonPlanUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => LessonPlanAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-plan", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertLessonPlan = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return LessonPlanAPI.update(payload);
      return LessonPlanAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-plan", "list"] });
      queryClient.invalidateQueries({ queryKey: ["lesson-plan", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLessonPlanPublish = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => LessonPlanAPI.publish(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-plan", "list"] });
      queryClient.invalidateQueries({ queryKey: ["lesson-plan", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLessonPlanArchive = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => LessonPlanAPI.archive(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-plan", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLessonPlanExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => LessonPlanAPI.export(payload),
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

export const LessonPlanService = {
  useLessonPlanList,
  useLessonPlanDetail,
  useLessonPlanCreate,
  useLessonPlanUpdate,
  useUpsertLessonPlan,
  useLessonPlanPublish,
  useLessonPlanArchive,
  useLessonPlanExport,
};
