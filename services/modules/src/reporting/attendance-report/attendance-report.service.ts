import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
} from "@tera/commons/hooks/queryAdapter";
import { AttendanceReportAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useAttendanceReportList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["attendance-report", "list", payload.params],
    queryFn: () => AttendanceReportAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useAttendanceReportDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["attendance-report", "detail", payload.id],
    queryFn: () => AttendanceReportAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useAttendanceReportCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => AttendanceReportAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance-report", "list"],
      });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useAttendanceReportUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => AttendanceReportAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance-report", "list"],
      });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertAttendanceReport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return AttendanceReportAPI.update(payload);
      return AttendanceReportAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useAttendanceReportDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => AttendanceReportAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance-report", "list"],
      });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useAttendanceReportExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => AttendanceReportAPI.export(payload),
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

export const AttendanceReportService = {
  useAttendanceReportList,
  useAttendanceReportDetail,
  useAttendanceReportCreate,
  useAttendanceReportUpdate,
  useUpsertAttendanceReport,
  useAttendanceReportDelete,
  useAttendanceReportExport,
};
