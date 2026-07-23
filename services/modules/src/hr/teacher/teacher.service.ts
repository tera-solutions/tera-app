import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { TeacherAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useTeacherList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["teacher", "list", payload.params],
    queryFn: () => TeacherAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useTeacherDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["teacher", "detail", payload.id],
    queryFn: () => TeacherAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
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

export const useTeacherSuspend = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => TeacherAPI.suspend(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "list"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useTeacherRestore = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => TeacherAPI.restore(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "list"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useTeacherResign = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => TeacherAPI.resign(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "list"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useTeacherCertificateList = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["teacher", "certificate", "list", payload.id],
    queryFn: () => TeacherAPI.getCertificateList(payload),
    enabled: !!payload.id,
    ...options,
  });
};

export const useTeacherCertificateCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => TeacherAPI.createCertificate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "certificate", "list"] });
    },
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useTeacherCertificateUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => TeacherAPI.updateCertificate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "certificate", "list"] });
    },
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useTeacherCertificateDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => TeacherAPI.deleteCertificate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "certificate", "list"] });
    },
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const TeacherService = {
  useTeacherList,
  useTeacherDetail,
  useTeacherCreate,
  useTeacherUpdate,
  useUpsertTeacher,
  useTeacherSuspend,
  useTeacherRestore,
  useTeacherResign,
  useTeacherCertificateList,
  useTeacherCertificateCreate,
  useTeacherCertificateUpdate,
  useTeacherCertificateDelete,
};
