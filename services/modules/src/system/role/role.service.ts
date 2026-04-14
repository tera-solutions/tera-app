
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { RoleAPI } from "@tera/api/system/role/role.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useRoleList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["role", "list", payload.params],
    queryFn: () => RoleAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useRoleDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["role", "detail", payload.id],
    queryFn: () => RoleAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useRoleCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => RoleAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role", "list"] });
    },
  });
};

export const useRoleUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => RoleAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role", "list"] });
    },
  });
};

export const useRoleDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => RoleAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["role", "list"] });
    },
  });
};

export const RoleService = {
  useRoleList,
  useRoleDetail,
  useRoleCreate,
  useRoleUpdate,
  useRoleDelete,
};
