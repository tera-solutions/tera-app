import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { InvoiceAPI } from "@tera/api";
import {
  CreatePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

type ReasonPayload = { id: number | string; params: { reason: string; note?: string } };
type PaymentPayload = {
  id: number | string;
  params: { amount: number; method: string; transaction_id?: string; note?: string; paid_at?: string };
};

// QUERY
export const useInvoiceList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["invoice", "list", payload.params],
    queryFn: () => InvoiceAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useInvoiceDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["invoice", "detail", payload.id],
    queryFn: () => InvoiceAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useInvoiceCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => InvoiceAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useInvoiceUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => InvoiceAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertInvoice = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return InvoiceAPI.update(payload);
      return InvoiceAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

/** Không có `variables` trong `onSuccess` của adapter (chỉ `data`) — invalidate cả
 * namespace "invoice" (list + mọi detail đang cache) thay vì nhắm 1 id cụ thể. */
const invalidateAllInvoices = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["invoice"] });
};

export const useInvoiceApprove = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => InvoiceAPI.approve(payload),
    onSuccess: () => invalidateAllInvoices(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useInvoiceDeny = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ReasonPayload) => InvoiceAPI.deny(payload),
    onSuccess: () => invalidateAllInvoices(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useInvoiceCancel = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ReasonPayload) => InvoiceAPI.cancel(payload),
    onSuccess: () => invalidateAllInvoices(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useInvoiceRefund = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ReasonPayload) => InvoiceAPI.refund(payload),
    onSuccess: () => invalidateAllInvoices(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useInvoicePay = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: PaymentPayload) => InvoiceAPI.pay(payload),
    onSuccess: () => invalidateAllInvoices(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useInvoiceDownload = () => {
  const { t } = useTranslation();
  return useMutationAdapter({
    mutationFn: ({ id, code }: { id: number | string; code?: string }) =>
      InvoiceAPI.downloadPdf(id).then((blob) => ({ blob, code })),
    onSuccess: ({ blob, code }) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${code ?? "hoa-don"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    },
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const InvoiceService = {
  useInvoiceList,
  useInvoiceDetail,
  useInvoiceCreate,
  useInvoiceUpdate,
  useUpsertInvoice,
  useInvoiceApprove,
  useInvoiceDeny,
  useInvoiceCancel,
  useInvoiceRefund,
  useInvoicePay,
  useInvoiceDownload,
};
