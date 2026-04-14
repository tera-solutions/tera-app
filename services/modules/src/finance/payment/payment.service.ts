
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { PaymentAPI } from "@tera/api/finance/payment/payment.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const usePaymentList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["payment", "list", payload.params],
    queryFn: () => PaymentAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const usePaymentDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["payment", "detail", payload.id],
    queryFn: () => PaymentAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const usePaymentCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => PaymentAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment", "list"] });
    },
  });
};

export const usePaymentUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => PaymentAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment", "list"] });
    },
  });
};

export const usePaymentDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => PaymentAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment", "list"] });
    },
  });
};

export const PaymentService = {
  usePaymentList,
  usePaymentDetail,
  usePaymentCreate,
  usePaymentUpdate,
  usePaymentDelete,
};
