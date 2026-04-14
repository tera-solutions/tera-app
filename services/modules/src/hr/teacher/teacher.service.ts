
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { TeacherAPI } from "@tera/api/hr/teacher/teacher.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useTeacherList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["teacher", "list", payload.params],
    queryFn: () => TeacherAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useTeacherDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["teacher", "detail", payload.id],
    queryFn: () => TeacherAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useTeacherCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => TeacherAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "list"] });
    },
  });
};

export const useTeacherUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => TeacherAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "list"] });
    },
  });
};

export const useTeacherDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => TeacherAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher", "list"] });
    },
  });
};

export const TeacherService = {
  useTeacherList,
  useTeacherDetail,
  useTeacherCreate,
  useTeacherUpdate,
  useTeacherDelete,
};
