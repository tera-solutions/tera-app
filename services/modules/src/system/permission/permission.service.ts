import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
} from "@tera/commons/hooks/queryAdapter";
import { PermissionAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const usePermissionList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["permission", "list", payload.params],
    queryFn: () => PermissionAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const usePermissionDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["permission", "detail", payload.id],
    queryFn: () => PermissionAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const usePermissionCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => PermissionAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permission", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const usePermissionUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => PermissionAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permission", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertPermission = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return PermissionAPI.update(payload);
      return PermissionAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const usePermissionDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => PermissionAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permission", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const usePermissionExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => PermissionAPI.export(payload),
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

export const PermissionService = {
  usePermissionList,
  usePermissionDetail,
  usePermissionCreate,
  usePermissionUpdate,
  useUpsertPermission,
  usePermissionDelete,
  usePermissionExport,
};
