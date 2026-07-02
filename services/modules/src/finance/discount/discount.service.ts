import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
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
export const useDiscountList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["discount", "list", payload.params],
    queryFn: () => DiscountAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useDiscountDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["discount", "detail", payload.id],
    queryFn: () => DiscountAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
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
    },
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
    },
  });
};

export const useUpsertDiscount = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return DiscountAPI.update(payload);
      return DiscountAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
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
    },
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
    },
  });
};

export const DiscountService = {
  useDiscountList,
  useDiscountDetail,
  useDiscountCreate,
  useDiscountUpdate,
  useUpsertDiscount,
  useDiscountDelete,
  useDiscountExport,
};
