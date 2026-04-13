
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { UserAPI } from "@tera/api/system/user/user.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useUserList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["user", "list", payload.params],
    queryFn: () => UserAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useUserDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["user", "detail", payload.id],
    queryFn: () => UserAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useUserCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => UserAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
    },
  });
};

export const useUserUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => UserAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
    },
  });
};

export const useUserDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => UserAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "list"] });
    },
  });
};
