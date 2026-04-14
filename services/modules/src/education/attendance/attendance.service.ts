
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { AttendanceAPI } from "@tera/api/education/attendance/attendance.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useAttendanceList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["attendance", "list", payload.params],
    queryFn: () => AttendanceAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useAttendanceDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["attendance", "detail", payload.id],
    queryFn: () => AttendanceAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useAttendanceCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => AttendanceAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "list"] });
    },
  });
};

export const useAttendanceUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => AttendanceAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "list"] });
    },
  });
};

export const useAttendanceDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => AttendanceAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "list"] });
    },
  });
};

export const AttendanceService = {
  useAttendanceList,
  useAttendanceDetail,
  useAttendanceCreate,
  useAttendanceUpdate,
  useAttendanceDelete,
};
