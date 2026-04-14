
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { StudentLevelAPI } from "@tera/api/education/student-level/student-level.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useStudentLevelList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["student-level", "list", payload.params],
    queryFn: () => StudentLevelAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useStudentLevelDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["student-level", "detail", payload.id],
    queryFn: () => StudentLevelAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useStudentLevelCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => StudentLevelAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-level", "list"] });
    },
  });
};

export const useStudentLevelUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => StudentLevelAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-level", "list"] });
    },
  });
};

export const useStudentLevelDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => StudentLevelAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-level", "list"] });
    },
  });
};
