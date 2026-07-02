import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { ClassScheduleAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useClassScheduleList = (
  payload: ListPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["class-schedule", "list", payload.params],
    queryFn: () => ClassScheduleAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useClassScheduleDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["class-schedule", "detail", payload.id],
    queryFn: () => ClassScheduleAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useClassScheduleCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => ClassScheduleAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-schedule", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useClassScheduleUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ClassScheduleAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-schedule", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useClassScheduleDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => ClassScheduleAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-schedule", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const ClassScheduleService = {
  useClassScheduleList,
  useClassScheduleDetail,
  useClassScheduleCreate,
  useClassScheduleUpdate,
  useClassScheduleDelete,
};
