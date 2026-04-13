
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { ParentAPI } from "@tera/api/crm/parent/parent.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useParentList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["parent", "list", payload.params],
    queryFn: () => ParentAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useParentDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["parent", "detail", payload.id],
    queryFn: () => ParentAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useParentCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => ParentAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent", "list"] });
    },
  });
};

export const useParentUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ParentAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent", "list"] });
    },
  });
};

export const useParentDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => ParentAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent", "list"] });
    },
  });
};
