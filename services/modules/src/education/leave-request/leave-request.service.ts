import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useQueryAdapter, useMutationAdapter, QueryHookOptions } from "@tera/commons/hooks/queryAdapter";
import { LeaveRequestAPI } from "@tera/api";
import { CreatePayload, DetailPayload, ListPayload, UpdatePayload } from "@tera/api/_interface";

type ReasonPayload = { id: number | string; params: { rejection_reason: string } };
type ScheduleMakeupPayload = {
  makeupId: number | string;
  params: { makeup_lesson_id: number | string; status?: string };
};

export const useLeaveRequestList = (payload: ListPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["leave-request", "list", payload.params],
    queryFn: () => LeaveRequestAPI.getList(payload),
    keepPreviousData: true,
    ...options,
  });
};

export const useLeaveRequestDetail = (payload: DetailPayload, options?: QueryHookOptions) => {
  return useQueryAdapter({
    queryKey: ["leave-request", "detail", payload.id],
    queryFn: () => LeaveRequestAPI.getDetail(payload),
    enabled: !!payload.id,
    ...options,
  });
};

const invalidateLeaveRequests = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ["leave-request"] });
};

export const useLeaveRequestCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => LeaveRequestAPI.create(payload),
    onSuccess: () => invalidateLeaveRequests(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useLeaveRequestUpdate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: UpdatePayload) => LeaveRequestAPI.update(payload),
    onSuccess: () => invalidateLeaveRequests(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useLeaveRequestApprove = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => LeaveRequestAPI.approve(payload),
    onSuccess: () => invalidateLeaveRequests(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useLeaveRequestReject = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ReasonPayload) => LeaveRequestAPI.reject(payload),
    onSuccess: () => invalidateLeaveRequests(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useLeaveRequestCancel = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: DetailPayload) => LeaveRequestAPI.cancel(payload),
    onSuccess: () => invalidateLeaveRequests(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const useLeaveRequestScheduleMakeup = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: ScheduleMakeupPayload) => LeaveRequestAPI.scheduleMakeup(payload),
    onSuccess: () => invalidateLeaveRequests(queryClient),
    onError: (error) => console.error(t("common.error_message"), error),
  });
};

export const LeaveRequestService = {
  useLeaveRequestList,
  useLeaveRequestDetail,
  useLeaveRequestCreate,
  useLeaveRequestUpdate,
  useLeaveRequestApprove,
  useLeaveRequestReject,
  useLeaveRequestCancel,
  useLeaveRequestScheduleMakeup,
};
