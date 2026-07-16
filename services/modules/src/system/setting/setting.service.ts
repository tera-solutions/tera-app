import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { SettingAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useSettingList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["setting", "list", payload.params],
    queryFn: () => SettingAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useSettingDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["setting", "detail", payload.id],
    queryFn: () => SettingAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useSettingCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => SettingAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setting", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useSettingUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => SettingAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setting", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

/** Create-or-update by `key`, matching the backend's `/sys/setting/upsert` action. */
export const useUpsertSetting = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => SettingAPI.upsert(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setting", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useSettingDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => SettingAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setting", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const SettingService = {
  useSettingList,
  useSettingDetail,
  useSettingCreate,
  useSettingUpdate,
  useUpsertSetting,
  useSettingDelete,
};
