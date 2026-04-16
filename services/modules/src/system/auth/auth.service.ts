
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { AuthAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useAuthList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["auth", "list", payload.params],
    queryFn: () => AuthAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useAuthDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["auth", "detail", payload.id],
    queryFn: () => AuthAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useAuthCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => AuthAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useAuthUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => AuthAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useAuthDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => AuthAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useAuthExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => AuthAPI.export(payload),
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

export const AuthService = {
  useAuthList,
  useAuthDetail,
  useAuthCreate,
  useAuthUpdate,
  useAuthDelete,
  useAuthExport
};
