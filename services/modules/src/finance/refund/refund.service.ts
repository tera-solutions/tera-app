import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
} from "@tera/commons/hooks/queryAdapter";
import { RefundAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useRefundList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["refund", "list", payload.params],
    queryFn: () => RefundAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useRefundDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["refund", "detail", payload.id],
    queryFn: () => RefundAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useRefundCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => RefundAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refund", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useRefundUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => RefundAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refund", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertRefund = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return RefundAPI.update(payload);
      return RefundAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useRefundDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => RefundAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refund", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useRefundExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => RefundAPI.export(payload),
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

export const RefundService = {
  useRefundList,
  useRefundDetail,
  useRefundCreate,
  useRefundUpdate,
  useUpsertRefund,
  useRefundDelete,
  useRefundExport,
};
