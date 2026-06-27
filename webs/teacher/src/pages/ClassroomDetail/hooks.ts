import { useQueryLegacy } from "@tera/commons/hooks/tanstack";

import type { ClassStudentParams } from "./_interface";
import ClassroomDetailApi, { type SessionRange } from "./_api";

export const CLASSROOM_DETAIL_KEYS = {
  detail: (id: number | string) =>
    ["teacher", "classroom", "detail", id] as const,
  sessions: (id: number | string, range: SessionRange) =>
    ["teacher", "classroom", "sessions", id, range] as const,
  attendance: (id: number | string) =>
    ["teacher", "classroom", "attendance", id] as const,
  students: (params: ClassStudentParams) =>
    ["teacher", "classroom", "students", params] as const,
};

export const useClassroomDetail = (id: number | string | null) =>
  useQueryLegacy({
    queryKey: CLASSROOM_DETAIL_KEYS.detail(id ?? "none"),
    queryFn: () => ClassroomDetailApi.getDetail(id as number),
    enabled: id != null,
  });

export const useClassSessions = (
  id: number | null,
  range: SessionRange,
  enabled = true,
) =>
  useQueryLegacy({
    queryKey: CLASSROOM_DETAIL_KEYS.sessions(id ?? "none", range),
    queryFn: () => ClassroomDetailApi.getSessions(id as number, range),
    enabled: id != null && enabled,
  });

export const useClassAttendance = (id: number | null, enabled = true) =>
  useQueryLegacy({
    queryKey: CLASSROOM_DETAIL_KEYS.attendance(id ?? "none"),
    queryFn: () => ClassroomDetailApi.getAttendance(id as number),
    enabled: id != null && enabled,
  });

export const useClassStudents = (
  classId: number | null,
  params: Omit<ClassStudentParams, "class_id">,
  enabled = true,
) =>
  useQueryLegacy({
    queryKey: CLASSROOM_DETAIL_KEYS.students({
      class_id: classId ?? 0,
      ...params,
    }),
    queryFn: () =>
      ClassroomDetailApi.getStudents({ class_id: classId as number, ...params }),
    enabled: classId != null && enabled,
  });
