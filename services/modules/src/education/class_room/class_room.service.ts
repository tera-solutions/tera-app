
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter } from "@tera/commons/hooks/queryAdapter";
import { ClassRoomAPI } from "@tera/api/education/class_room/class_room.api";
import { ListPayload, DetailPayload, CreatePayload, UpdatePayload, DeletePayload } from "@tera/api/_interface";

// QUERY
export const useClassRoomList = (payload: ListPayload) => {
  return useQueryAdapter({
    queryKey: ["class_room", "list", payload.params],
    queryFn: () => ClassRoomAPI.getList(payload),
    keepPreviousData: true,
  });
};

export const useClassRoomDetail = (payload: DetailPayload) => {
  return useQueryAdapter({
    queryKey: ["class_room", "detail", payload.id],
    queryFn: () => ClassRoomAPI.getDetail(payload),
    enabled: !!payload.id,
  });
};

// MUTATION
export const useClassRoomCreate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => ClassRoomAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class_room", "list"] });
    },
  });
};

export const useClassRoomUpdate = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => ClassRoomAPI.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class_room", "list"] });
    },
  });
};

export const useClassRoomDelete = () => {
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DeletePayload) => ClassRoomAPI.delete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class_room", "list"] });
    },
  });
};
