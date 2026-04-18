import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
} from "@tera/commons/hooks/queryAdapter";
import { AuditAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useAuditList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["audit", "list", payload.params],
    queryFn: () => AuditAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useAuditDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["audit", "detail", payload.id],
    queryFn: () => AuditAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useAuditCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => AuditAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useAuditUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => AuditAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertAudit = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return AuditAPI.update(payload);
      return AuditAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useAuditDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => AuditAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useAuditExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => AuditAPI.export(payload),
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

export const AuditService = {
  useAuditList,
  useAuditDetail,
  useAuditCreate,
  useAuditUpdate,
  useUpsertAudit,
  useAuditDelete,
  useAuditExport,
};
