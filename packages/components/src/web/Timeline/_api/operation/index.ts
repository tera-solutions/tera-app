import { endpoint } from '@tera/api/_endpoint';
import api from '@tera/states/drivers';

const OperationEndpoint = `${endpoint}/operation`;
const OperationApi = {
  getStatus: async (params: any) =>
    await api
      .get(`${OperationEndpoint}/workflow/list-status`, params)
      .then((response) => response?.data?.data),
  getWorkflowBegin: async (params: any) =>
    await api
      .get(`${OperationEndpoint}/workflow/get-first-cf-wf`, params)
      .then((response) => response?.data?.data),
  getWorkflow: async (params: any) =>
    await api
      .get(`${OperationEndpoint}/workflow/get-detail-cf-wf`, params)
      .then((response) => response?.data?.data),
  getWorkflowOrder: async ({ params }) =>
    await api
      .get(`${OperationEndpoint}/workflow/get-in-workflow`, params)
      .then((result) => result?.data?.data),
  export: async (params) =>
    await api
      .post(`${OperationEndpoint}/import-export/export-system`, params)
      .then((result) => result?.data),
  getLogs: async (params: any) =>
    await api
      .get(`${OperationEndpoint}/workflow/get-logs`, params)
      .then((response) => response?.data?.data),
};

export default OperationApi;
