import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { AttendanceAPI } from "@tera/api";
import {
  CreatePayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useAttendanceList = (
  payload: ListPayload,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["attendance", "list", payload.params],
    queryFn: () => AttendanceAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

// MUTATION
export const useAttendanceCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => AttendanceAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useAttendanceUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => AttendanceAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertAttendance = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return AttendanceAPI.update(payload);
      return AttendanceAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "list"] });
      queryClient.invalidateQueries({ queryKey: ["attendance", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useAttendanceExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => AttendanceAPI.export(payload),
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

export const AttendanceService = {
  useAttendanceList,
  useAttendanceCreate,
  useAttendanceUpdate,
  useUpsertAttendance,
  useAttendanceExport,
};
