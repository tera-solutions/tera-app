import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/states/drivers";

const ContactEndpoint = `${endpoint}/sale/customer/contact`;

const ContactApi = {
  getList: async (params) =>
    await api
      .get(`${ContactEndpoint}/list`, params)
      .then((result) => result?.data?.data),
};

export default ContactApi;
