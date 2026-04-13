
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { BusinessAPI } from "@tera/api/system/business/business.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useBusinessList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["business", "list", payload.params],
    queryFn: () => BusinessAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useBusinessDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["business", "detail", payload.id],
    queryFn: () => BusinessAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useBusinessCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => BusinessAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "list"] });
    },
  });
};

export const useBusinessUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => BusinessAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "list"] });
    },
  });
};

export const useBusinessDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => BusinessAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "list"] });
    },
  });
};
