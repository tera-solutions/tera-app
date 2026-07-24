import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { SubscriptionPackageAPI, DiscountRulesPayload } from "@tera/api";
import {
  CreatePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useSubscriptionPackageList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["subscription-package", "list", payload.params],
    queryFn: () => SubscriptionPackageAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useSubscriptionPackageDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["subscription-package", "detail", payload.id],
    queryFn: () => SubscriptionPackageAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

export const useSubscriptionPackageUsages = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["subscription-package", "usages", payload.id],
    queryFn: () => SubscriptionPackageAPI.getUsages(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
const useSubscriptionPackageMutation = <T,>(mutationFn: (payload: T) => Promise<any>) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-package", "list"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-package", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useSubscriptionPackageCreate = () =>
  useSubscriptionPackageMutation((payload: CreatePayload) => SubscriptionPackageAPI.create(payload));

export const useSubscriptionPackageUpdate = () =>
  useSubscriptionPackageMutation((payload: UpdatePayload) => SubscriptionPackageAPI.update(payload));

export const useSubscriptionPackageToggle = () =>
  useSubscriptionPackageMutation((payload: DetailPayload) => SubscriptionPackageAPI.toggle(payload));

export const useSubscriptionPackageDelete = () =>
  useSubscriptionPackageMutation((payload: DetailPayload) => SubscriptionPackageAPI.delete(payload));

export const useSubscriptionPackageSetDiscountRules = () =>
  useSubscriptionPackageMutation((payload: DiscountRulesPayload) => SubscriptionPackageAPI.setDiscountRules(payload));

export const SubscriptionPackageService = {
  useSubscriptionPackageList,
  useSubscriptionPackageDetail,
  useSubscriptionPackageUsages,
  useSubscriptionPackageCreate,
  useSubscriptionPackageUpdate,
  useSubscriptionPackageToggle,
  useSubscriptionPackageDelete,
  useSubscriptionPackageSetDiscountRules,
};
