import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter, QueryHookOptions } from "@tera/commons/hooks/queryAdapter";
import { BankAccountAPI, UpdateBankAccountPayload } from "@tera/api";

export const useMyBankAccount = (options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["bank-account", "me"],
    queryFn: () => BankAccountAPI.getMine(),
    ...options,
  });
};

export const useUpdateMyBankAccount = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdateBankAccountPayload) => BankAccountAPI.updateMine(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bank-account"] }),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const BankAccountService = {
  useMyBankAccount,
  useUpdateMyBankAccount,
};
