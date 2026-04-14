
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { EnrollmentAPI } from "@tera/api/crm/enrollment/enrollment.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useEnrollmentList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["enrollment", "list", payload.params],
    queryFn: () => EnrollmentAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useEnrollmentDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["enrollment", "detail", payload.id],
    queryFn: () => EnrollmentAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useEnrollmentCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => EnrollmentAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", "list"] });
    },
  });
};

export const useEnrollmentUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => EnrollmentAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", "list"] });
    },
  });
};

export const useEnrollmentDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => EnrollmentAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", "list"] });
    },
  });
};

export const EnrollmentService = {
  useEnrollmentList,
  useEnrollmentDetail,
  useEnrollmentCreate,
  useEnrollmentUpdate,
  useEnrollmentDelete,
};
