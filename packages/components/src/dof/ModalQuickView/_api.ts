import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

const QuickViewApi = {
  getDetailPurchaseRequest: async ({ id }) =>
    await api
      .get(`${endpoint}/purchase/purchase-request/order/${id}`)
      .then((res) => res?.data?.data),
  getDetailPurchase: async ({ id }) =>
    await api
      .get(`${endpoint}/purchase/order/detail/${id}`)
      .then((res) => res?.data?.data),
  getDetailSellOrder: async ({ id }) =>
    await api
      .get(`${endpoint}/sale/order/detail/${id}`)
      .then((res) => res?.data?.data),
  getDetailProduct: async ({ id }) =>
    await api
      .get(`${endpoint}/warehouse/product/detail/${id}`, {
        location_id: 1,
        stock_id: 6,
      })
      .then((res) => res?.data?.data),
  getDetailPriceQuote: async ({ id }) =>
    await api
      .get(`${endpoint}/sale/price-quote/detail/${id}`)
      .then((res) => res?.data?.data),
  getDetailCustomer: async ({ id }) =>
    await api
      .get(`${endpoint}/sale/customer/detail/${id}`)
      .then((res) => res?.data?.data),
  getDetailSupplier: async ({ id }) =>
    await api
      .get(`${endpoint}/purchase/supplier/detail/${id}`)
      .then((res) => res?.data?.data),
  getDetailContact: async ({ id }) =>
    await api
      .get(`${endpoint}/sale/customer/contact/detail/${id}`)
      .then((res) => res?.data?.data),
  getDetailCustomerBank: async ({ id }) =>
    await api
      .get(`${endpoint}/sale/customer/bank/detail/${id}`)
      .then((res) => res?.data?.data),
  getDetailCustomerDelivery: async ({ id }) =>
    await api
      .get(`${endpoint}/sale/customer/delivery-address/detail/${id}`)
      .then((res) => res?.data?.data),
  getDetailPurchaseReturn: async ({ id }) =>
    await api
      .get(`${endpoint}/purchase/purchase-return/order/${id}`)
      .then((res) => res?.data?.data),
  getDetailSaleOrderReturn: async ({ id }) =>
    await api
      .get(`${endpoint}/sale/sell-return/order/${id}`)
      .then((res) => res?.data?.data),
  getDetailAppointment: async (id: number) =>
    await api
      .get(`${endpoint}/customer-service/appointment/detail/${id}`)
      .then((res) => res?.data?.data),
  getDetailCall: async (id: number) =>
    await api
      .get(`${endpoint}/customer-service/call/detail/${id}`)
      .then((res) => res?.data?.data),
  getDetailTask: async (id: number) =>
    await api
      .get(`${endpoint}/customer-service/task/detail/${id}`)
      .then((res) => res?.data?.data),
  getDetailLead: async (id: number) =>
    await api
      .get(`${endpoint}/customer-service/lead/detail/${id}`)
      .then((res) => res?.data?.data),
  getDetailOpportunity: async (id: number) =>
    await api
      .get(`${endpoint}/marketing/opportunity/detail/${id}`)
      .then((res) => res?.data?.data),
  getDetailConsultingTicket: async (id: number) =>
    await api
      .get(`${endpoint}/customer-service/consulting-ticket/detail/${id}`)
      .then((res) => res?.data?.data),
};

export default QuickViewApi;
