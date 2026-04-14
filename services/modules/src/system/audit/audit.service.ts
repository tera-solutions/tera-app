
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { AuditAPI } from "@tera/api/system/audit/audit.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useAuditList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["audit", "list", payload.params],
    queryFn: () => AuditAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useAuditDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["audit", "detail", payload.id],
    queryFn: () => AuditAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useAuditCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => AuditAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit", "list"] });
    },
  });
};

export const useAuditUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => AuditAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit", "list"] });
    },
  });
};

export const useAuditDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => AuditAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit", "list"] });
    },
  });
};

export const AuditService = {
  useAuditList,
  useAuditDetail,
  useAuditCreate,
  useAuditUpdate,
  useAuditDelete,
};
