
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { RefundAPI } from "@tera/api/finance/refund/refund.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useRefundList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["refund", "list", payload.params],
    queryFn: () => RefundAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useRefundDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["refund", "detail", payload.id],
    queryFn: () => RefundAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useRefundCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => RefundAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refund", "list"] });
    },
  });
};

export const useRefundUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => RefundAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refund", "list"] });
    },
  });
};

export const useRefundDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => RefundAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refund", "list"] });
    },
  });
};
