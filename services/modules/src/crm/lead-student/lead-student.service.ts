import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { LeadStudentAPI } from "@tera/api";
import type {
  LeadStudentCreatePayload,
  LeadStudentDeletePayload,
  LeadStudentListPayload,
  LeadStudentUpdatePayload,
} from "@tera/api";

const KEY = "lead-student";

// QUERY
export const useLeadStudentList = (
  payload: LeadStudentListPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: [KEY, "list", payload.leadId, payload.params],
    queryFn: () => LeadStudentAPI.getList(payload),
    enabled: !!payload.leadId,
    keepPreviousData: true,
    ...options,
  });
};

// MUTATION
export const useLeadStudentAdd = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: LeadStudentCreatePayload) => LeadStudentAPI.add(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: ["lead", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLeadStudentUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: LeadStudentUpdatePayload) => LeadStudentAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: ["lead", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useLeadStudentDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: LeadStudentDeletePayload) => LeadStudentAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: ["lead", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const LeadStudentService = {
  useLeadStudentList,
  useLeadStudentAdd,
  useLeadStudentUpdate,
  useLeadStudentDelete,
};
