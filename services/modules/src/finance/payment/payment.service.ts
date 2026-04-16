
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { PaymentAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const usePaymentList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["payment", "list", payload.params],
    queryFn: () => PaymentAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const usePaymentDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["payment", "detail", payload.id],
    queryFn: () => PaymentAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const usePaymentCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => PaymentAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const usePaymentUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => PaymentAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const usePaymentDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => PaymentAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const usePaymentExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => PaymentAPI.export(payload),
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

export const PaymentService = {
  usePaymentList,
  usePaymentDetail,
  usePaymentCreate,
  usePaymentUpdate,
  usePaymentDelete,
  usePaymentExport
};
