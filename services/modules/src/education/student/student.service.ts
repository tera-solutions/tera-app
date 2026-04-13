
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { StudentAPI } from "@tera/api/education/student/student.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useStudentList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["student", "list", payload.params],
    queryFn: () => StudentAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useStudentDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["student", "detail", payload.id],
    queryFn: () => StudentAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useStudentCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => StudentAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
  });
};

export const useStudentUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => StudentAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
  });
};

export const useStudentDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => StudentAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "list"] });
    },
  });
};
