
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { LeadAPI } from "@tera/api/crm/lead/lead.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useLeadList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["lead", "list", payload.params],
    queryFn: () => LeadAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useLeadDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["lead", "detail", payload.id],
    queryFn: () => LeadAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useLeadCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => LeadAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", "list"] });
    },
  });
};

export const useLeadUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => LeadAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", "list"] });
    },
  });
};

export const useLeadDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => LeadAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", "list"] });
    },
  });
};
