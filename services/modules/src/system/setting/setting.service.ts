
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { SettingAPI } from "@tera/api/system/setting/setting.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useSettingList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["setting", "list", payload.params],
    queryFn: () => SettingAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useSettingDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["setting", "detail", payload.id],
    queryFn: () => SettingAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useSettingCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => SettingAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setting", "list"] });
    },
  });
};

export const useSettingUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => SettingAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setting", "list"] });
    },
  });
};

export const useSettingDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => SettingAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["setting", "list"] });
    },
  });
};

export const SettingService = {
  useSettingList,
  useSettingDetail,
  useSettingCreate,
  useSettingUpdate,
  useSettingDelete,
};
