import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { StudentLevelAPI } from "@tera/api";
import type {
  PlacementPayload,
  PromoteAdjustPayload,
  StudentLevelHistoryPayload,
} from "@tera/api";
import { DetailPayload } from "@tera/api/_interface";

// QUERY
export const useStudentLevelDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["student-level", "detail", payload.id],
    queryFn: () => StudentLevelAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

export const useStudentLevelHistory = (
  payload: StudentLevelHistoryPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["student-level", "history", payload.id],
    queryFn: () => StudentLevelAPI.getHistory(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useStudentLevelPlacement = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: PlacementPayload) => StudentLevelAPI.placement(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-level", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useStudentLevelPromote = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: PromoteAdjustPayload) => StudentLevelAPI.promote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-level", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useStudentLevelAdjust = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: PromoteAdjustPayload) => StudentLevelAPI.adjust(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-level", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const StudentLevelService = {
  useStudentLevelDetail,
  useStudentLevelHistory,
  useStudentLevelPlacement,
  useStudentLevelPromote,
  useStudentLevelAdjust,
};
