import EduApi from "_common/api/edu";

import type { Classroom, ClassroomSummary } from "../_interface";
import { normalizeClassrooms, normalizeSummary } from "../normalize";

export interface ClassroomListParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export interface ClassroomListResult {
  items: Classroom[];
  total: number;
}

const ClassroomApi = {
  getList: async (
    params: ClassroomListParams = {},
  ): Promise<ClassroomListResult> => {
    const result = await EduApi.classRoomList(
      params as Record<string, unknown>,
    );
    return {
      items: normalizeClassrooms(result?.items ?? result),
      total: result?.pagination?.total ?? result?.items?.length ?? 0,
    };
  },

  getSummary: async (): Promise<
    Omit<ClassroomSummary, "avg_completion_rate"> & {
      avg_completion_rate?: number;
    }
  > => normalizeSummary(await EduApi.classRoomSummary()),
};

export default ClassroomApi;
