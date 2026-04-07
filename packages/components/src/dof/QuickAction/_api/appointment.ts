import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const AppointmentEndpoint = `${endpoint}/customer-service/appointment`;

const AppointmentApi = {
  getList: async (params) =>
    await api
      .get(`${AppointmentEndpoint}/list`, params)
      .then((result) => result?.data?.data),
  getDetail: async (id) =>
    await api
      .get(`${AppointmentEndpoint}/detail/${id}`)
      .then((result) => result?.data?.data),
};

export default AppointmentApi;
