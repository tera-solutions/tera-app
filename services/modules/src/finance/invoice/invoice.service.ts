
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { InvoiceAPI } from "@tera/api/finance/invoice/invoice.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useInvoiceList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["invoice", "list", payload.params],
    queryFn: () => InvoiceAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useInvoiceDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["invoice", "detail", payload.id],
    queryFn: () => InvoiceAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useInvoiceCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => InvoiceAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", "list"] });
    },
  });
};

export const useInvoiceUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => InvoiceAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", "list"] });
    },
  });
};

export const useInvoiceDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => InvoiceAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", "list"] });
    },
  });
};

export const InvoiceService = {
  useInvoiceList,
  useInvoiceDetail,
  useInvoiceCreate,
  useInvoiceUpdate,
  useInvoiceDelete,
};
