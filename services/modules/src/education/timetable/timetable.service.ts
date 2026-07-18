import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  useQueryAdapter,
  useMutationAdapter,
  QueryHookOptions,
} from "@tera/commons/hooks/queryAdapter";
import { TimetableAPI, TimetableCalendarParams } from "@tera/api";
import { CreatePayload, UpdatePayload } from "@tera/api/_interface";

// QUERY
export const useTimetableCalendar = (
  params: TimetableCalendarParams,
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["timetable", "calendar", params],
    queryFn: () => TimetableAPI.getCalendar(params),
    ...options,
  });
};

export const useStudentSchedule = (
  id: string | number | undefined,
  params?: { date_from?: string; date_to?: string },
  options?: QueryHookOptions,
) => {
  return useQueryAdapter({
    queryKey: ["timetable", "student-schedule", id, params],
    queryFn: () => TimetableAPI.getStudentSchedule(id as string | number, params),
    enabled: !!id,
    ...options,
  });
};

// MUTATION
export const useTimetableCreate = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn: (payload: CreatePayload) => TimetableAPI.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable", "calendar"] });
    },
    onError: (error: any) => {
      console.error(t("common.error_message"), error);
    },
  });
};

/** Invalidates the calendar + every session detail query after a session-level change. */
const useTimetableSessionMutation = (
  mutationFn: (payload: UpdatePayload) => Promise<any>,
) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutationAdapter({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timetable", "calendar"] });
      queryClient.invalidateQueries({ queryKey: ["class-session", "detail"] });
    },
    onError: (error: any) => {
      console.error(t("common.error_message"), error);
    },
  });
};

export const useTimetableChangeTeacher = () =>
  useTimetableSessionMutation(TimetableAPI.changeTeacher);

export const useTimetableChangeRoom = () =>
  useTimetableSessionMutation(TimetableAPI.changeRoom);

export const useTimetableReschedule = () =>
  useTimetableSessionMutation(TimetableAPI.reschedule);

export const useTimetableCancelSession = () =>
  useTimetableSessionMutation(TimetableAPI.cancelSession);

export const TimetableService = {
  useTimetableCalendar,
  useStudentSchedule,
  useTimetableCreate,
  useTimetableChangeTeacher,
  useTimetableChangeRoom,
  useTimetableReschedule,
  useTimetableCancelSession,
};
