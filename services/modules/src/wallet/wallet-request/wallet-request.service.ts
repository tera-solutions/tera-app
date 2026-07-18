import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter, QueryHookOptions } from "@tera/commons/hooks/queryAdapter";
import { WalletRequestAPI, CreateWalletRequestPayload } from "@tera/api";
import { DetailPayload, ListPayload } from "@tera/api/_interface";

type ReasonPayload = { id: number | string; params: { reject_reason: string } };
type CompletePayload = { id: number | string; params?: { note?: string } };

export const useWalletRequestList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["wallet-request", "list", payload.params],
    queryFn: () => WalletRequestAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useWalletRequestDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["wallet-request", "detail", payload.id],
    queryFn: () => WalletRequestAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

const invalidateWalletRequests = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["wallet-request"] });
  // Hoàn tất một yêu cầu ghi thẳng vào sổ ví — làm mới luôn dữ liệu Ví cá nhân.
  queryClient.invalidateQueries({ queryKey: ["wallet"] });
};

export const useWalletRequestCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreateWalletRequestPayload) => WalletRequestAPI.create(payload),
    onSuccess: () => invalidateWalletRequests(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useWalletRequestCancel = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => WalletRequestAPI.cancel(payload),
    onSuccess: () => invalidateWalletRequests(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useWalletRequestApprove = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => WalletRequestAPI.approve(payload),
    onSuccess: () => invalidateWalletRequests(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useWalletRequestReject = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ReasonPayload) => WalletRequestAPI.reject(payload),
    onSuccess: () => invalidateWalletRequests(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useWalletRequestComplete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CompletePayload) => WalletRequestAPI.complete(payload),
    onSuccess: () => invalidateWalletRequests(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const WalletRequestService = {
  useWalletRequestList,
  useWalletRequestDetail,
  useWalletRequestCreate,
  useWalletRequestCancel,
  useWalletRequestApprove,
  useWalletRequestReject,
  useWalletRequestComplete,
};
