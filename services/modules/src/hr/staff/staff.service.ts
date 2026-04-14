
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { StaffAPI } from "@tera/api/hr/staff/staff.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useStaffList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["staff", "list", payload.params],
    queryFn: () => StaffAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useStaffDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["staff", "detail", payload.id],
    queryFn: () => StaffAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useStaffCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => StaffAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
    },
  });
};

export const useStaffUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => StaffAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
    },
  });
};

export const useStaffDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => StaffAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
    },
  });
};

export const StaffService = {
  useStaffList,
  useStaffDetail,
  useStaffCreate,
  useStaffUpdate,
  useStaffDelete,
};
