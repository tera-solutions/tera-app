import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { WalletTransactionAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useWalletTransactionList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["wallet-transaction", "list", payload.params],
    queryFn: () => WalletTransactionAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useWalletTransactionDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["wallet-transaction", "detail", payload.id],
    queryFn: () => WalletTransactionAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useWalletTransactionCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) =>
      WalletTransactionAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wallet-transaction", "list"],
      });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useWalletTransactionUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) =>
      WalletTransactionAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wallet-transaction", "list"],
      });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertWalletTransaction = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return WalletTransactionAPI.update(payload);
      return WalletTransactionAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useWalletTransactionDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) =>
      WalletTransactionAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wallet-transaction", "list"],
      });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useWalletTransactionExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) =>
      WalletTransactionAPI.export(payload),
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

export const WalletTransactionService = {
  useWalletTransactionList,
  useWalletTransactionDetail,
  useWalletTransactionCreate,
  useWalletTransactionUpdate,
  useUpsertWalletTransaction,
  useWalletTransactionDelete,
  useWalletTransactionExport,
};
