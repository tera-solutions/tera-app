import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { RoomAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useRoomList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["room", "list", payload.params],
    queryFn: () => RoomAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useRoomDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["room", "detail", payload.id],
    queryFn: () => RoomAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useRoomCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => RoomAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useRoomUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => RoomAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertRoom = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return RoomAPI.update(payload);
      return RoomAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", "list"] });
      queryClient.invalidateQueries({ queryKey: ["room", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useRoomDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => RoomAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useRoomExport = () => {
  const { t } = useTranslation();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => RoomAPI.export(payload),
    onSuccess: (res) => {
      if (res?.data?.link) {
        window.open(res?.data?.link, "_blank");
      }
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useRoomSuspend = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => RoomAPI.suspend(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", "list"] });
      queryClient.invalidateQueries({ queryKey: ["room", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useRoomRestore = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => RoomAPI.restore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", "list"] });
      queryClient.invalidateQueries({ queryKey: ["room", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const RoomService = {
  useRoomList,
  useRoomDetail,
  useRoomCreate,
  useRoomUpdate,
  useUpsertRoom,
  useRoomDelete,
  useRoomExport,
  useRoomSuspend,
  useRoomRestore,
};
