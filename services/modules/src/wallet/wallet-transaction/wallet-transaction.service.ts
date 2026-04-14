
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { WalletTransactionAPI } from "@tera/api/wallet/wallet-transaction/wallet-transaction.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useWalletTransactionList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["wallet-transaction", "list", payload.params],
    queryFn: () => WalletTransactionAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useWalletTransactionDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["wallet-transaction", "detail", payload.id],
    queryFn: () => WalletTransactionAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useWalletTransactionCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => WalletTransactionAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet-transaction", "list"] });
    },
  });
};

export const useWalletTransactionUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => WalletTransactionAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet-transaction", "list"] });
    },
  });
};

export const useWalletTransactionDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => WalletTransactionAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet-transaction", "list"] });
    },
  });
};
