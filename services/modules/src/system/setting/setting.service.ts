import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
} from "@tera/commons/hooks/queryAdapter";
import { SettingAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useSettingList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["setting", "list", payload.params],
    queryFn: () => SettingAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useSettingDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["setting", "detail", payload.id],
    queryFn: () => SettingAPI.getDetail(payload),
    enabled: !!payload.id,
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

export const useUpsertSetting = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return SettingAPI.update(payload);
      return SettingAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
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

export const useSettingExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => SettingAPI.export(payload),
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

export const SettingService = {
  useSettingList,
  useSettingDetail,
  useSettingCreate,
  useSettingUpdate,
  useUpsertSetting,
  useSettingDelete,
  useSettingExport,
};
