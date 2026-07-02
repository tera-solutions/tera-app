import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { MaterialAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useMaterialList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["material", "list", payload.params],
    queryFn: () => MaterialAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useMaterialDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["material", "detail", payload.id],
    queryFn: () => MaterialAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useMaterialCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => MaterialAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["material", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useMaterialUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => MaterialAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["material", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertMaterial = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return MaterialAPI.update(payload);
      return MaterialAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["material", "list"] });
      queryClient.invalidateQueries({ queryKey: ["material", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useMaterialDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => MaterialAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["material", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useMaterialExport = () => {
  const { t } = useTranslation();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => MaterialAPI.export(payload),
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

export const MaterialService = {
  useMaterialList,
  useMaterialDetail,
  useMaterialCreate,
  useMaterialUpdate,
  useUpsertMaterial,
  useMaterialDelete,
  useMaterialExport,
};
