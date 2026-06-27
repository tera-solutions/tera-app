import { useQueryLegacy } from "@tera/commons/hooks/tanstack";

import ClassroomApi, { type ClassroomListParams } from "./_api";

export const CLASSROOM_KEYS = {
  list: (params: ClassroomListParams) =>
    ["teacher", "classroom", "list", params] as const,
  summary: ["teacher", "classroom", "summary"] as const,
};

export const useClassroomList = (params: ClassroomListParams = {}) =>
  useQueryLegacy({
    queryKey: CLASSROOM_KEYS.list(params),
    queryFn: () => ClassroomApi.getList(params),
  });

export const useClassroomSummary = () =>
  useQueryLegacy({
    queryKey: CLASSROOM_KEYS.summary,
    queryFn: () => ClassroomApi.getSummary(),
  });
