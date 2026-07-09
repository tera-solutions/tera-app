import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { AchievementAPI, TeacherReviewAPI } from "@tera/api";
import { CreatePayload, ListPayload } from "@tera/api/_interface";

// QUERY
export const useAchievementSummary = (options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["achievement", "summary"],
    queryFn: () => AchievementAPI.getSummary(),
    ...options,
  });
};

export const useAchievementProgress = (
  period: "week" | "month" | "year" = "month",
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["achievement", "progress", period],
    queryFn: () => AchievementAPI.getProgress(period),
    ...options,
  });
};

export const useTeacherReviewList = (payload: ListPayload = {}, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["teacher-review", "list", payload.params],
    queryFn: () => TeacherReviewAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

// MUTATION
export const useTeacherReviewCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => TeacherReviewAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-review", "list"] });
      queryClient.invalidateQueries({ queryKey: ["achievement"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const AchievementService = {
  useAchievementSummary,
  useAchievementProgress,
  useTeacherReviewList,
  useTeacherReviewCreate,
};
