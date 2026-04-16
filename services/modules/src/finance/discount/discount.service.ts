
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { DiscountAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useDiscountList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["discount", "list", payload.params],
    queryFn: () => DiscountAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useDiscountDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["discount", "detail", payload.id],
    queryFn: () => DiscountAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useDiscountCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => DiscountAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discount", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useDiscountUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => DiscountAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discount", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useDiscountDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => DiscountAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discount", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useDiscountExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => DiscountAPI.export(payload),
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

export const DiscountService = {
  useDiscountList,
  useDiscountDetail,
  useDiscountCreate,
  useDiscountUpdate,
  useDiscountDelete,
  useDiscountExport
};
