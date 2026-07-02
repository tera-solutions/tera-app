import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
} from "@tera/commons/hooks/queryAdapter";
import { EnrollmentAPI } from "@tera/api";
import {
  CreatePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useEnrollmentList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["enrollment", "list", payload.params],
    queryFn: () => EnrollmentAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useEnrollmentDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["enrollment", "detail", payload.id],
    queryFn: () => EnrollmentAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useEnrollmentCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => EnrollmentAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useEnrollmentUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => EnrollmentAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", "list"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertEnrollment = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return EnrollmentAPI.update(payload);
      return EnrollmentAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", "list"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useEnrollmentSuspend = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => EnrollmentAPI.suspend(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", "list"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useEnrollmentTransfer = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => EnrollmentAPI.transfer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", "list"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useEnrollmentRefund = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => EnrollmentAPI.refund(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", "list"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useEnrollmentCancel = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => EnrollmentAPI.cancel(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", "list"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const EnrollmentService = {
  useEnrollmentList,
  useEnrollmentDetail,
  useEnrollmentCreate,
  useEnrollmentUpdate,
  useUpsertEnrollment,
  useEnrollmentSuspend,
  useEnrollmentTransfer,
  useEnrollmentRefund,
  useEnrollmentCancel,
};
