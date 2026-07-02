import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { BranchAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useBranchList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["branch", "list", payload.params],
    queryFn: () => BranchAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useBranchDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["branch", "detail", payload.id],
    queryFn: () => BranchAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

// MUTATION
export const useBranchCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => BranchAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useBranchUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => BranchAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch", "list"] });
      queryClient.invalidateQueries({ queryKey: ["branch", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertBranch = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return BranchAPI.update(payload);
      return BranchAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useBranchDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => BranchAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branch", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const BranchService = {
  useBranchList,
  useBranchDetail,
  useBranchCreate,
  useBranchUpdate,
  useUpsertBranch,
  useBranchDelete,
};
