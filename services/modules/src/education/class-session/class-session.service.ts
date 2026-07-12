import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { ClassSessionAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useClassSessionList = (
  payload: ListPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["class-session", "list", payload.params],
    queryFn: () => ClassSessionAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useClassSessionDetail = (
  payload: DetailPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["class-session", "detail", payload.id],
    queryFn: () => ClassSessionAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useClassSessionCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => ClassSessionAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-session", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useClassSessionGenerate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => ClassSessionAPI.generate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-session", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useClassSessionUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ClassSessionAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-session", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useClassSessionCancel = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ClassSessionAPI.cancel(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-session", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useClassSessionStart = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ClassSessionAPI.start(payload),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["class-session", "list"] });
      const id = res?.data?.id;
      if (id) {
        queryClient.invalidateQueries({
          queryKey: ["class-session", "detail", id],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["room", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useClassSessionEnd = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ClassSessionAPI.end(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-session", "list"] });
      queryClient.invalidateQueries({ queryKey: ["room", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useClassSessionDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => ClassSessionAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-session", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const ClassSessionService = {
  useClassSessionList,
  useClassSessionDetail,
  useClassSessionCreate,
  useClassSessionGenerate,
  useClassSessionUpdate,
  useClassSessionCancel,
  useClassSessionStart,
  useClassSessionEnd,
  useClassSessionDelete,
};
