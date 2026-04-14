
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { WalletAPI } from "@tera/api/wallet/wallet/wallet.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useWalletList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["wallet", "list", payload.params],
    queryFn: () => WalletAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useWalletDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["wallet", "detail", payload.id],
    queryFn: () => WalletAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useWalletCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => WalletAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet", "list"] });
    },
  });
};

export const useWalletUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => WalletAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet", "list"] });
    },
  });
};

export const useWalletDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => WalletAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet", "list"] });
    },
  });
};

export const WalletService = {
  useWalletList,
  useWalletDetail,
  useWalletCreate,
  useWalletUpdate,
  useWalletDelete,
};
