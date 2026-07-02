import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { LeadAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useLeadList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["lead", "list", payload.params],
    queryFn: () => LeadAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useLeadDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["lead", "detail", payload.id],
    queryFn: () => LeadAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useLeadCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => LeadAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLeadUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => LeadAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertLead = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return LeadAPI.update(payload);
      return LeadAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLeadDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => LeadAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLeadExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => LeadAPI.export(payload),
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

export const LeadService = {
  useLeadList,
  useLeadDetail,
  useLeadCreate,
  useLeadUpdate,
  useUpsertLead,
  useLeadDelete,
  useLeadExport,
};
