
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { PermissionAPI } from "@tera/api/system/permission/permission.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const usePermissionList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["permission", "list", payload.params],
    queryFn: () => PermissionAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const usePermissionDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["permission", "detail", payload.id],
    queryFn: () => PermissionAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const usePermissionCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => PermissionAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permission", "list"] });
    },
  });
};

export const usePermissionUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => PermissionAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permission", "list"] });
    },
  });
};

export const usePermissionDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => PermissionAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permission", "list"] });
    },
  });
};
