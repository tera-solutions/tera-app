
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { UserAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useUserList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["user", "list", payload.params],
    queryFn: () => UserAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useUserDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["user", "detail", payload.id],
    queryFn: () => UserAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useUserCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => UserAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useUserUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => UserAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useUserDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => UserAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useUserExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => UserAPI.export(payload),
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

export const UserService = {
  useUserList,
  useUserDetail,
  useUserCreate,
  useUserUpdate,
  useUserDelete,
  useUserExport
};
