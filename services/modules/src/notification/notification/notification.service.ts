import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { NotificationAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useNotificationList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["notification", "list", payload.params],
    queryFn: () => NotificationAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useNotificationDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["notification", "detail", payload.id],
    queryFn: () => NotificationAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useNotificationCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => NotificationAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useNotificationUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => NotificationAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertNotification = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return NotificationAPI.update(payload);
      return NotificationAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useNotificationDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => NotificationAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useNotificationExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => NotificationAPI.export(payload),
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

export const NotificationService = {
  useNotificationList,
  useNotificationDetail,
  useNotificationCreate,
  useNotificationUpdate,
  useUpsertNotification,
  useNotificationDelete,
  useNotificationExport,
};
