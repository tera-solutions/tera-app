import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { SubscriptionAPI } from "@tera/api";
import type { UpgradeSubscriptionPayload } from "@tera/api";
import { ListPayload } from "@tera/api/_interface";

export const useSubscriptionCurrent = (options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["subscription", "current"],
    queryFn: () => SubscriptionAPI.getCurrent(),
    ...options,
  });
};

export const useSubscriptionInvoiceList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["subscription", "invoice", "list", payload.params],
    queryFn: () => SubscriptionAPI.getInvoiceList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useSubscriptionUpgrade = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpgradeSubscriptionPayload) => SubscriptionAPI.upgrade(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription", "current"] });
      queryClient.invalidateQueries({ queryKey: ["subscription", "invoice", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const SubscriptionService = {
  useSubscriptionCurrent,
  useSubscriptionInvoiceList,
  useSubscriptionUpgrade,
};
