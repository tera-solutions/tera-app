import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
} from "@tera/commons/hooks/queryAdapter";
import { ParentAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useParentList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["parent", "list", payload.params],
    queryFn: () => ParentAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useParentDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["parent", "detail", payload.id],
    queryFn: () => ParentAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useParentCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => ParentAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useParentUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ParentAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertParent = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return ParentAPI.update(payload);
      return ParentAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useParentDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => ParentAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useParentSuspend = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ParentAPI.suspend(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent", "list"] });
      queryClient.invalidateQueries({ queryKey: ["parent", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useParentRestore = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ParentAPI.restore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent", "list"] });
      queryClient.invalidateQueries({ queryKey: ["parent", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useParentExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => ParentAPI.export(payload),
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

export const ParentService = {
  useParentList,
  useParentDetail,
  useParentCreate,
  useParentUpdate,
  useUpsertParent,
  useParentDelete,
  useParentSuspend,
  useParentRestore,
  useParentExport,
};
