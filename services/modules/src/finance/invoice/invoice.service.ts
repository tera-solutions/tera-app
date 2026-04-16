
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { InvoiceAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useInvoiceList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["invoice", "list", payload.params],
    queryFn: () => InvoiceAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useInvoiceDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["invoice", "detail", payload.id],
    queryFn: () => InvoiceAPI.getDetail(payload),
    enabled: !!payload.id,
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
    }
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
    }
  });
};

export const useInvoiceDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => InvoiceAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useInvoiceExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => InvoiceAPI.export(payload),
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

export const InvoiceService = {
  useInvoiceList,
  useInvoiceDetail,
  useInvoiceCreate,
  useInvoiceUpdate,
  useInvoiceDelete,
  useInvoiceExport
};
