import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { AssignmentAPI } from "@tera/api";
import {
  CreatePayload,
  DeletePayload,
  DetailPayload,
  ExportPayload,
  ListPayload,
  UpdatePayload,
} from "@tera/api/_interface";

// QUERY
export const useAssignmentList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["assignment", "list", payload.params],
    queryFn: () => AssignmentAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useAssignmentDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["assignment", "detail", payload.id],
    queryFn: () => AssignmentAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

export const useAssignmentSummary = (payload: ListPayload = {}, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["assignment", "summary", payload.params],
    queryFn: () => AssignmentAPI.getSummary(payload),
    ...options,
  });
};

// MUTATION
export const useAssignmentCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => AssignmentAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useAssignmentUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => AssignmentAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment", "list"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useUpsertAssignment = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => {
      if (payload?.id) return AssignmentAPI.update(payload);
      return AssignmentAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment", "list"] });
      queryClient.invalidateQueries({ queryKey: ["assignment", "detail"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useAssignmentPublish = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => AssignmentAPI.publish(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment", "list"] });
      queryClient.invalidateQueries({ queryKey: ["assignment", "detail"] });
      queryClient.invalidateQueries({ queryKey: ["assignment", "summary"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useAssignmentDelete = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => AssignmentAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignment", "list"] });
      queryClient.invalidateQueries({ queryKey: ["assignment", "summary"] });
    },
    onError: (error) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useAssignmentExport = () => {
  const { t } = useTranslation();
  return useMutationAdapter({
    mutationFn: (payload: ExportPayload) => AssignmentAPI.export(payload),
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

export const AssignmentService = {
  useAssignmentList,
  useAssignmentDetail,
  useAssignmentSummary,
  useAssignmentCreate,
  useAssignmentUpdate,
  useUpsertAssignment,
  useAssignmentPublish,
  useAssignmentDelete,
  useAssignmentExport,
};
