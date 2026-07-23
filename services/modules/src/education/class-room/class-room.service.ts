import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { ClassRoomAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useClassRoomList = (
  payload: ListPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["class-room", "list", payload.params],
    queryFn: () => ClassRoomAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useClassRoomDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["class-room", "detail", payload.id],
    queryFn: () => ClassRoomAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

export const useClassRoomSummary = (
  params?: Record<string, unknown>,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["class-room", "summary", params],
    queryFn: () => ClassRoomAPI.getSummary(params),
    ...options,
  });
};

// MUTATION
export const useClassRoomCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => ClassRoomAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-room", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useClassRoomUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ClassRoomAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-room", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertClassRoom = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return ClassRoomAPI.update(payload);
      return ClassRoomAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-room", "list"] });
      queryClient.invalidateQueries({ queryKey: ["class-room", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useClassRoomDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => ClassRoomAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-room", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useClassRoomSuspend = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ClassRoomAPI.suspend(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-room", "list"] });
      queryClient.invalidateQueries({ queryKey: ["class-room", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useClassRoomRestore = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ClassRoomAPI.restore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-room", "list"] });
      queryClient.invalidateQueries({ queryKey: ["class-room", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const ClassRoomService = {
  useClassRoomList,
  useClassRoomDetail,
  useClassRoomSummary,
  useClassRoomCreate,
  useClassRoomUpdate,
  useUpsertClassRoom,
  useClassRoomDelete,
  useClassRoomSuspend,
  useClassRoomRestore,
};
