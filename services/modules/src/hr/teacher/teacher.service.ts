import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
} from "@tera/commons/hooks/queryAdapter";
import { TeacherAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useTeacherList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["teacher", "list", payload.params],
    queryFn: () => TeacherAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useTeacherDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["teacher", "detail", payload.id],
    queryFn: () => TeacherAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useTeacherCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => TeacherAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useTeacherUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => TeacherAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertTeacher = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return TeacherAPI.update(payload);
      return TeacherAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useTeacherDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => TeacherAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useTeacherExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => TeacherAPI.export(payload),
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

export const TeacherService = {
  useTeacherList,
  useTeacherDetail,
  useTeacherCreate,
  useTeacherUpdate,
  useUpsertTeacher,
  useTeacherDelete,
  useTeacherExport,
};
