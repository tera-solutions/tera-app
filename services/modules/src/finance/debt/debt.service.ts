
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { DebtAPI } from "@tera/api/finance/debt/debt.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useDebtList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["debt", "list", payload.params],
    queryFn: () => DebtAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useDebtDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["debt", "detail", payload.id],
    queryFn: () => DebtAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useDebtCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => DebtAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debt", "list"] });
    },
  });
};

export const useDebtUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => DebtAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debt", "list"] });
    },
  });
};

export const useDebtDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => DebtAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debt", "list"] });
    },
  });
};
