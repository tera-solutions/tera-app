
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { BusinessAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useBusinessList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["business", "list", payload.params],
    queryFn: () => BusinessAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useBusinessDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["business", "detail", payload.id],
    queryFn: () => BusinessAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useBusinessCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => BusinessAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useBusinessUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => BusinessAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useBusinessDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => BusinessAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    }
  });
};

export const useBusinessExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => BusinessAPI.export(payload),
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

export const BusinessService = {
  useBusinessList,
  useBusinessDetail,
  useBusinessCreate,
  useBusinessUpdate,
  useBusinessDelete,
  useBusinessExport
};
