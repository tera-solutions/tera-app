import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { InvoiceConfigAPI, InvoiceConfigParams } from "@tera/api";

export const useInvoiceConfig = (options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["invoice-config"],
    queryFn: () => InvoiceConfigAPI.get(),
    ...options,
  });
};

export const useInvoiceConfigUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (params: InvoiceConfigParams) => InvoiceConfigAPI.update(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice-config"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const InvoiceConfigService = {
  useInvoiceConfig,
  useInvoiceConfigUpdate,
};
