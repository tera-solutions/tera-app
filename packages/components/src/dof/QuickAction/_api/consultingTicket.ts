import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

const ConsultingTicketEndpoint = `${endpoint}/customer-service/consulting-ticket`;

const ConsultingTicketApi = {
  getList: async (params?) =>
    await api
      .get(`${ConsultingTicketEndpoint}/list`, params)
      .then((result) => result?.data?.data),
  getDetail: async (id: number, params?) =>
    await api
      .get(`${ConsultingTicketEndpoint}/detail/${id}`, params)
      .then((result) => result?.data?.data),
};

export default ConsultingTicketApi;
