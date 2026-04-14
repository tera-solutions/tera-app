
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { NotificationAPI } from "@tera/api/notification/notification/notification.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useNotificationList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["notification", "list", payload.params],
    queryFn: () => NotificationAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useNotificationDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["notification", "detail", payload.id],
    queryFn: () => NotificationAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useNotificationCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => NotificationAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification", "list"] });
    },
  });
};

export const useNotificationUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => NotificationAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification", "list"] });
    },
  });
};

export const useNotificationDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => NotificationAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification", "list"] });
    },
  });
};

export const NotificationService = {
  useNotificationList,
  useNotificationDetail,
  useNotificationCreate,
  useNotificationUpdate,
  useNotificationDelete,
};
