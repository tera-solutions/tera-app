import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { DetailPayload } from "@tera/api/_interface";

export interface StudentLevelHistoryPayload {
  /** The student_level record id (returned by `getDetail`), not the student id. */
  id: string | number;
}

export interface PlacementPayload {
  params: Record<string, any>;
}

export interface PromoteAdjustPayload {
  /** The student_level record id, not the student id. */
  id: string | number;
  params: Record<string, any>;
}

/**
 * Backend only exposes detail/history/placement/promote/adjust — matches
 * `App\Modules\Education\StudentLevel\Router\api.php`. There is no
 * list/create/update/delete/export route for this module.
 */
export const StudentLevelAPI = {
  getDetail: async ({ id }: DetailPayload) =>
    await api
      .get(`${endpoint}/edu/student-level/detail/${id}`)
      .then((result) => result.data),

  getHistory: async ({ id }: StudentLevelHistoryPayload) =>
    await api
      .get(`${endpoint}/edu/student-level/history/${id}`)
      .then((result) => result.data),

  placement: async ({ params }: PlacementPayload) =>
    await api
      .post(`${endpoint}/edu/student-level/placement`, params)
      .then((result) => result.data),

  promote: async ({ id, params }: PromoteAdjustPayload) =>
    await api
      .post(`${endpoint}/edu/student-level/promote/${id}`, params)
      .then((result) => result.data),

  adjust: async ({ id, params }: PromoteAdjustPayload) =>
    await api
      .post(`${endpoint}/edu/student-level/adjust/${id}`, params)
      .then((result) => result.data),
};
