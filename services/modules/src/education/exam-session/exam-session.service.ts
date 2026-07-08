import { useQueryAdapter, QueryHookOptions } from "@tera/commons/hooks/queryAdapter";
import { ExamSessionAPI } from "@tera/api";
import { DetailPayload, ListPayload } from "@tera/api/_interface";

// QUERY
export const useExamSessionList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["exam-session", "list", payload.params],
    queryFn: () => ExamSessionAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useExamSessionDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["exam-session", "detail", payload.id],
    queryFn: () => ExamSessionAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

export const ExamSessionService = {
  useExamSessionList,
  useExamSessionDetail,
};
