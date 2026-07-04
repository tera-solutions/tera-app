import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { LevelAPI } from "@tera/api";
import {
  CreatePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useLevelList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["level", "list", payload.params],
    queryFn: () => LevelAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useLevelDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["level", "detail", payload.id],
    queryFn: () => LevelAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useLevelCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => LevelAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["level", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLevelUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => LevelAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["level", "list"] });
      queryClient.invalidateQueries({ queryKey: ["level", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertLevel = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return LevelAPI.update(payload);
      return LevelAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["level", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLevelSuspend = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => LevelAPI.suspend(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["level", "list"] });
      queryClient.invalidateQueries({ queryKey: ["level", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLevelRestore = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => LevelAPI.restore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["level", "list"] });
      queryClient.invalidateQueries({ queryKey: ["level", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const LevelService = {
  useLevelList,
  useLevelDetail,
  useLevelCreate,
  useLevelUpdate,
  useUpsertLevel,
  useLevelSuspend,
  useLevelRestore,
};
