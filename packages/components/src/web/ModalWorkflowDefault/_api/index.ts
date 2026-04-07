import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const WorkflowEndpoint = `${endpoint}/operation/workflow`;

const WorkflowApi = {
  workflowDefault: async () =>
    await api
      .post(`${WorkflowEndpoint}/workflow-default`)
      .then((result) => result?.data),
  setWorkflowDefault: async ({ params }) =>
    await api
      .put(`${WorkflowEndpoint}/set-workflow-default`, params)
      .then((result) => result?.data),
};

export default WorkflowApi;
