import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { ScoreAPI, ScoreComponent } from "@tera/api";

const boardKey = (classId: number | string) => ["score", "board", classId];

export const useScoreConfig = (classId: number | string, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["score", "config", classId],
    queryFn: () => ScoreAPI.getConfig(classId),
    enabled: !!classId,
    ...options,
  });
};

export const useScoreBoard = (classId: number | string, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: boardKey(classId),
    queryFn: () => ScoreAPI.getBoard(classId),
    enabled: !!classId,
    ...options,
  });
};

export const useSaveScoreConfig = (classId: number | string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (components: ScoreComponent[]) => ScoreAPI.saveConfig(classId, components),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["score", "config", classId] });
      queryClient.invalidateQueries({ queryKey: boardKey(classId) });
    },
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useSaveScoreComponent = (classId: number | string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: { student_id: number | string; type: string; score: number }) =>
      ScoreAPI.saveComponent(classId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKey(classId) });
    },
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useFinalizeScore = (classId: number | string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: () => ScoreAPI.finalize(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKey(classId) });
    },
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useUnlockScore = (classId: number | string) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: () => ScoreAPI.unlock(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKey(classId) });
    },
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const ScoreService = {
  useScoreConfig,
  useScoreBoard,
  useSaveScoreConfig,
  useSaveScoreComponent,
  useFinalizeScore,
  useUnlockScore,
};
