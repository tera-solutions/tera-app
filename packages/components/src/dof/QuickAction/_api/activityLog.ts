import { portalEndpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

const ActivityLogEndPoint = `${portalEndpoint}/activity-log`;

const ActivityLogApi = {
  getList: async ({ params }) =>
    await api
      .get(`${ActivityLogEndPoint}/list`, params)
      .then((result) => result?.data?.data),
};

export default ActivityLogApi;
