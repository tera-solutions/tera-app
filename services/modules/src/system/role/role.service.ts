
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { RoleAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useRoleList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["role", "list", payload.params],
    queryFn: () => RoleAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useRoleDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["role", "detail", payload.id],
    queryFn: () => RoleAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useRoleCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => RoleAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useRoleUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => RoleAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useRoleDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => RoleAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useRoleExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => RoleAPI.export(payload),
    onSuccess: (res) => {
      if (res?.data?.link) {
        window.open(res?.data?.link, "_blank");
      }
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const RoleService = {
  useRoleList,
  useRoleDetail,
  useRoleCreate,
  useRoleUpdate,
  useRoleDelete,
  useRoleExport
};
