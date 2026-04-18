import api from "@tera/api/drivers";

const TradingAPiEndpoint = `https://api.trading.ungdung79.com/api`;

const TradingAPi = {
  getList: async ({ params }: any) =>
    await api
      .get(`${TradingAPiEndpoint}/chart/list`, params)
      .then((res) => res.data?.data),
  getAreaList: async ({ params }: any) =>
    await api
      .get(`${TradingAPiEndpoint}/area/list`, params)
      .then((res) => res.data?.data),
  getDetail: async ({ id }: any) =>
    await api
      .get(`${TradingAPiEndpoint}/detail/${id}`)
      .then((res) => res.data?.data),
};

export default TradingAPi;
