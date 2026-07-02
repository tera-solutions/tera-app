import axios, { AxiosHeaderValue, HeadersDefaults } from "axios";
import _ from "lodash";
import qs from "query-string";
import {
  _requestError,
  _requestHeader,
  _requestResponse,
} from "./_interceptor";

const instance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});
instance.interceptors.request.use(_requestHeader, (error) =>
  Promise.reject(error),
);

instance.interceptors.response.use(
  (r) => r,
  (error) => {
    return Promise.reject(error);
  },
);

const toQueryString = (params: any) => {
  if (!params || typeof params !== "object") return "";
  const { filters, ...rest } = params;
  const merged =
    filters && typeof filters === "object" ? { ...rest, ...filters } : rest;
  return `?${qs.stringify(merged)}`;
};

const get = (endpoints?: any, params?: any, headers?: any) => {
  if (_.isEmpty(headers)) {
    return instance
      .get(`${endpoints}${params ? toQueryString(params) : ""}`)
      .then(_requestResponse)
      .catch(_requestError);
  }
  return instance
    .get(`${endpoints}${params ? toQueryString(params) : ""}`, {
      timeout: 30000,
      ...headers,
    })
    .then(_requestResponse)
    .catch(_requestError);
};

const getAll = async (endpoints?: any, params?: any, headers?: any) => {
  const { data: res } = await get(endpoints, params, {
    timeout: 30000,
    ...headers,
  });
  const { limit, page, total } = res.metadata;
  const totalPage = Math.round(total / limit);
  const listRequests = [];
  let allData = res.data;
  if (page < totalPage) {
    for (let i = 1; i < totalPage; i += 1) {
      listRequests.push(get(endpoints, { ...params, page: i }, headers));
    }
    const result = await Promise.all(listRequests);
    const pages = _.orderBy(
      result.map(({ data }) => data),
      "metadata.page",
    );

    pages.forEach((pageInfo) => {
      allData = [...allData, ...pageInfo.data];
    });
  }
  return { data: allData };
};

const post = (endpoints?: any, params?: any, headers?: any) => {
  if (_.isEmpty(headers)) {
    return instance
      .post(`${endpoints}`, params)
      .then(_requestResponse)
      .catch(_requestError);
  }
  return instance
    .post(`${endpoints}`, params, { timeout: 30000, ...headers })
    .then(_requestResponse)
    .catch(_requestError);
};

const put = (endpoints?: any, params?: any, headers?: any) => {
  if (_.isEmpty(headers)) {
    return instance
      .put(`${endpoints}`, params)
      .then(_requestResponse)
      .catch(_requestError);
  }
  return instance
    .put(`${endpoints}`, params, { timeout: 30000, ...headers })
    .then(_requestResponse)
    .catch(_requestError);
};

const patch = (endpoints?: any, params?: any) =>
  instance
    .patch(`${endpoints}`, params)
    .then(_requestResponse)
    .catch(_requestError);

const del = (endpoints?: any, params?: any) =>
  instance
    .delete(`${endpoints}`, { data: params })
    .then(_requestResponse)
    .catch(_requestError);

const changeHeaders = (headers: any) => {
  if (typeof headers === "undefined") {
    return;
  }
  const defaultHeaders = _.get(instance, "defaults.headers");
  const cleanHeaders = _.omitBy(
    {
      ...defaultHeaders,
      ...headers,
    },
    _.isEmpty,
  ) as HeadersDefaults & {
    [key: string]: AxiosHeaderValue;
  };
  instance.defaults.headers = cleanHeaders;
};

export default {
  get,
  post,
  patch,
  delete: del,
  changeHeaders,
  getAll,
  put,
};
