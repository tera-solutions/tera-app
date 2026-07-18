import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { WalletAPI } from "@tera/api";
import {
  CreatePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

/**
 * Khớp 1-1 với route thật (Postman `Modules` → `Finance/Wallet`, 2026-07-09).
 * KHÔNG có create/update/delete/export — đừng thêm hook cho route không tồn tại.
 */

// QUERY
export const useWalletList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["wallet", "list", payload.params],
    queryFn: () => WalletAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useWalletDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["wallet", "detail", payload.id],
    queryFn: () => WalletAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

/** `fin/wallet/transactions` — lịch sử giao dịch ví. Mọi filter optional, truyền qua params:
 * wallet_id, transaction_type, reference_type, reference_id, date_from, date_to,
 * sort_by, sort_dir, per_page (chỉ nhận 20 | 50 | 100).
 * Bỏ trống `wallet_id` = ví của user đang đăng nhập. */
export const useWalletTransactions = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["wallet", "transactions", payload.params],
    queryFn: () => WalletAPI.getTransactions(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useWalletSummary = (
  payload: { params?: { wallet_id?: number | string } } = {},
  options?: QueryHookOptions
) => {
  return useQueryAdapter({
    queryKey: ["wallet", "summary", payload.params],
    queryFn: () => WalletAPI.getSummary(payload),
    ...options,
  });
};

// ===== Action ledger (mỗi action ghi 1 giao dịch bất biến) =====
// Mọi action đổi số dư → invalidate cả list + detail + transactions.
const invalidateWallet = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["wallet", "list"] });
  queryClient.invalidateQueries({ queryKey: ["wallet", "detail"] });
  queryClient.invalidateQueries({ queryKey: ["wallet", "transactions"] });
};

export const useWalletDeposit = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => WalletAPI.deposit(payload),
    onSuccess: () => invalidateWallet(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useWalletPayment = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => WalletAPI.payment(payload),
    onSuccess: () => invalidateWallet(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useWalletRefund = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => WalletAPI.refund(payload),
    onSuccess: () => invalidateWallet(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useWalletAdjustment = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => WalletAPI.adjustment(payload),
    onSuccess: () => invalidateWallet(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useWalletFromInvoice = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => WalletAPI.fromInvoice(payload),
    onSuccess: () => invalidateWallet(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useWalletFromPayment = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => WalletAPI.fromPayment(payload),
    onSuccess: () => invalidateWallet(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useWalletLock = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => WalletAPI.lock(payload),
    onSuccess: () => invalidateWallet(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useWalletUnlock = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => WalletAPI.unlock(payload),
    onSuccess: () => invalidateWallet(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const WalletService = {
  useWalletList,
  useWalletDetail,
  useWalletTransactions,
  useWalletSummary,
  useWalletDeposit,
  useWalletPayment,
  useWalletRefund,
  useWalletAdjustment,
  useWalletFromInvoice,
  useWalletFromPayment,
  useWalletLock,
  useWalletUnlock,
};
