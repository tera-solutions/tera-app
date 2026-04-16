
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { DebtAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useDebtList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["debt", "list", payload.params],
    queryFn: () => DebtAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useDebtDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["debt", "detail", payload.id],
    queryFn: () => DebtAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useDebtCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => DebtAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debt", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useDebtUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => DebtAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debt", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useDebtDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => DebtAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debt", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useDebtExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => DebtAPI.export(payload),
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

export const DebtService = {
  useDebtList,
  useDebtDetail,
  useDebtCreate,
  useDebtUpdate,
  useDebtDelete,
  useDebtExport
};
