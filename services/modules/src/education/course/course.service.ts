
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { CourseAPI } from "@tera/api/education/course/course.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useCourseList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["course", "list", payload.params],
    queryFn: () => CourseAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useCourseDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["course", "detail", payload.id],
    queryFn: () => CourseAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useCourseCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => CourseAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", "list"] });
    },
  });
};

export const useCourseUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => CourseAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", "list"] });
    },
  });
};

export const useCourseDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => CourseAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", "list"] });
    },
  });
};
