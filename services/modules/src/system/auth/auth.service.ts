
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { AuthAPI } from "@tera/api/system/auth/auth.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useAuthList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["auth", "list", payload.params],
    queryFn: () => AuthAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useAuthDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["auth", "detail", payload.id],
    queryFn: () => AuthAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useAuthCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => AuthAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "list"] });
    },
  });
};

export const useAuthUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => AuthAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "list"] });
    },
  });
};

export const useAuthDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => AuthAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "list"] });
    },
  });
};

export const AuthService = {
  useAuthList,
  useAuthDetail,
  useAuthCreate,
  useAuthUpdate,
  useAuthDelete,
};
