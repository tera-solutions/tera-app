
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { DiscountAPI } from "@tera/api/finance/discount/discount.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useDiscountList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["discount", "list", payload.params],
    queryFn: () => DiscountAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useDiscountDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["discount", "detail", payload.id],
    queryFn: () => DiscountAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useDiscountCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => DiscountAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discount", "list"] });
    },
  });
};

export const useDiscountUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => DiscountAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discount", "list"] });
    },
  });
};

export const useDiscountDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => DiscountAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discount", "list"] });
    },
  });
};
