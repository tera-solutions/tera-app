import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
} from "@tera/commons/hooks/queryAdapter";
import { WalletAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useWalletList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["wallet", "list", payload.params],
    queryFn: () => WalletAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useWalletDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["wallet", "detail", payload.id],
    queryFn: () => WalletAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useWalletCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => WalletAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useWalletUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => WalletAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertWallet = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return WalletAPI.update(payload);
      return WalletAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useWalletDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => WalletAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useWalletExport = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => WalletAPI.export(payload),
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

export const WalletService = {
  useWalletList,
  useWalletDetail,
  useWalletCreate,
  useWalletUpdate,
  useUpsertWallet,
  useWalletDelete,
  useWalletExport,
};
