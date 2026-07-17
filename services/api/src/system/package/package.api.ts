import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";
import { ListPayload } from "@tera/api/_interface";

export const PackageAPI = {
  getList: async ({ params }: ListPayload) =>
    await api
      .get(`${endpoint}/sys/package/list`, { ...params, ...params?.filters })
      .then((r) => r.data),
};
