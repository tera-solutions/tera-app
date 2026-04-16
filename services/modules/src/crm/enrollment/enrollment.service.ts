
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { EnrollmentAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
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
    }
  });
};

export const useEnrollmentUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => EnrollmentAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useEnrollmentDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => EnrollmentAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useEnrollmentExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => EnrollmentAPI.export(payload),
    onSuccess: (res) => {
      if (res?.data?.link) {
        window.open(res?.data?.link, "_blank");
      }
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const EnrollmentService = {
  useEnrollmentList,
  useEnrollmentDetail,
  useEnrollmentCreate,
  useEnrollmentUpdate,
  useEnrollmentDelete,
  useEnrollmentExport
};
