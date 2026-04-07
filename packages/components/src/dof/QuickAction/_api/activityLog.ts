import { portalEndpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const ActivityLogEndPoint = `${portalEndpoint}/activity-log`;

const ActivityLogApi = {
  getList: async ({ params }) =>
    await api
      .get(`${ActivityLogEndPoint}/list`, params)
      .then((result) => result?.data?.data),
};

export default ActivityLogApi;
