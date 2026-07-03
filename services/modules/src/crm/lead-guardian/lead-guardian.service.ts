import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { LeadGuardianAPI } from "@tera/api";
import type {
  LeadGuardianCreatePayload,
  LeadGuardianDeletePayload,
  LeadGuardianListPayload,
  LeadGuardianUpdatePayload,
} from "@tera/api";

const KEY = "lead-guardian";

// QUERY
export const useLeadGuardianList = (
  payload: LeadGuardianListPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: [KEY, "list", payload.leadId, payload.params],
    queryFn: () => LeadGuardianAPI.getList(payload),
    enabled: !!payload.leadId,
    keepPreviousData: true,
    ...options,
  });
};

// MUTATION
export const useLeadGuardianAdd = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: LeadGuardianCreatePayload) => LeadGuardianAPI.add(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: ["lead", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLeadGuardianUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: LeadGuardianUpdatePayload) => LeadGuardianAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: ["lead", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLeadGuardianDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: LeadGuardianDeletePayload) => LeadGuardianAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: ["lead", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const LeadGuardianService = {
  useLeadGuardianList,
  useLeadGuardianAdd,
  useLeadGuardianUpdate,
  useLeadGuardianDelete,
};
