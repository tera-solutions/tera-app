import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
} from "@tera/commons/hooks/queryAdapter";
import { ParentStudentAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

const KEY = "parent-student";

// QUERY
export const useParentStudentList = (
  payload: ListPayload,
  options?: { enabled?: boolean },
) => {
  return useQueryAdapter({
    queryKey: [KEY, "list", payload.params],
    queryFn: () => ParentStudentAPI.getList(payload),
    keepPreviousData: true,
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
};

export const useParentStudentDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: [KEY, "detail", payload.id],
    queryFn: () => ParentStudentAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useParentStudentCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => ParentStudentAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: ["parent", "detail"] });
      queryClient.invalidateQueries({ queryKey: ["student", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useParentStudentUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ParentStudentAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: ["parent", "detail"] });
      queryClient.invalidateQueries({ queryKey: ["student", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useParentStudentDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => ParentStudentAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY, "list"] });
      queryClient.invalidateQueries({ queryKey: ["parent", "detail"] });
      queryClient.invalidateQueries({ queryKey: ["student", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const ParentStudentService = {
  useParentStudentList,
  useParentStudentDetail,
  useParentStudentCreate,
  useParentStudentUpdate,
  useParentStudentDelete,
};
