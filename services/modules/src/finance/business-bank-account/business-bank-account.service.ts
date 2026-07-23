import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { BusinessBankAccountAPI } from "@tera/api";
import {
  CreatePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useBusinessBankAccountList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["business-bank-account", "list", payload.params],
    queryFn: () => BusinessBankAccountAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useBusinessBankAccountDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["business-bank-account", "detail", payload.id],
    queryFn: () => BusinessBankAccountAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
const useBusinessBankAccountMutation = <T,>(mutationFn: (payload: T) => Promise<any>) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-bank-account", "list"] });
      queryClient.invalidateQueries({ queryKey: ["business-bank-account", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useBusinessBankAccountCreate = () =>
  useBusinessBankAccountMutation((payload: CreatePayload) => BusinessBankAccountAPI.create(payload));

export const useBusinessBankAccountUpdate = () =>
  useBusinessBankAccountMutation((payload: UpdatePayload) => BusinessBankAccountAPI.update(payload));

export const useBusinessBankAccountSuspend = () =>
  useBusinessBankAccountMutation((payload: DetailPayload) => BusinessBankAccountAPI.suspend(payload));

export const useBusinessBankAccountRestore = () =>
  useBusinessBankAccountMutation((payload: DetailPayload) => BusinessBankAccountAPI.restore(payload));

export const BusinessBankAccountService = {
  useBusinessBankAccountList,
  useBusinessBankAccountDetail,
  useBusinessBankAccountCreate,
  useBusinessBankAccountUpdate,
  useBusinessBankAccountSuspend,
  useBusinessBankAccountRestore,
};
