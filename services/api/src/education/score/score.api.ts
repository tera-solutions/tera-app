import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

export interface ScoreComponent {
  key: string;
  label: string;
  weight: number;
}

export const ScoreAPI = {
  getConfig: async (classId: number | string) =>
    await api.get(`${endpoint}/edu/score/${classId}/config`).then((r) => r.data),

  saveConfig: async (classId: number | string, components: ScoreComponent[]) =>
    await api
      .put(`${endpoint}/edu/score/${classId}/config`, { components })
      .then((r) => r.data),

  getBoard: async (classId: number | string) =>
    await api.get(`${endpoint}/edu/score/${classId}/board`).then((r) => r.data),

  saveComponent: async (
    classId: number | string,
    payload: { student_id: number | string; type: string; score: number },
  ) =>
    await api
      .post(`${endpoint}/edu/score/${classId}/component`, payload)
      .then((r) => r.data),

  finalize: async (classId: number | string) =>
    await api.post(`${endpoint}/edu/score/${classId}/finalize`).then((r) => r.data),

  unlock: async (classId: number | string) =>
    await api.post(`${endpoint}/edu/score/${classId}/unlock`).then((r) => r.data),
};
