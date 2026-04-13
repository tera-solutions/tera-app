
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { LessonAPI } from "@tera/api/education/lesson/lesson.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useLessonList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["lesson", "list", payload.params],
    queryFn: () => LessonAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useLessonDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["lesson", "detail", payload.id],
    queryFn: () => LessonAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useLessonCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => LessonAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", "list"] });
    },
  });
};

export const useLessonUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => LessonAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", "list"] });
    },
  });
};

export const useLessonDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => LessonAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", "list"] });
    },
  });
};
