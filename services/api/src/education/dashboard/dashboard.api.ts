import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

export const DashboardAPI = {
  getSummary: async () =>
    await api
      .get(`${endpoint}/edu/dashboard/summary`)
      .then((result) => result.data),
};
