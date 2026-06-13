import { rootStore } from "@tera/stores";
import _ from "lodash";

export const _requestHeader = (config: any) => {
  const newConfig = config;
  const authToken = rootStore.globalStore.token;
  const deviceCode = rootStore.globalStore.device;
  const businessId = rootStore.globalStore.business_id;

  const headers: any = {};

  try {
    if (deviceCode) {
      headers["device-code"] = deviceCode;
    }

    if (businessId) {
      headers["business-id"] = businessId;
    }

    if (authToken) {
      headers.authorization = `Bearer ${authToken}`;
    }

    newConfig.headers = headers;
  } catch (err) {
    // console.error(err);
  }

  try {
    newConfig.params = config.params || {};
  } catch (err) {
    console.error(err);
  }

  return newConfig;
};

export const _requestResponse = (response: any) => {
  const status = _.get(response, "data.code");

  if (status === 200) {
    const message = _.get(response, "data.msg");
    let data = _.get(response, "data");

    if (!_.isEmpty(message)) {
      data = { ...data, message: "" };
      return {
        ...response,
        data,
      };
    }

    return response;
  }

  throw response;
};

export const _requestError = (err: any) => {
  const message =
    _.get(err, "data.msg") || _.get(err, "response.data.error.message");
  const status = _.get(err, "data.code") || _.get(err, "response.status");
  if (status === 403) {
    // window.localStorage.clear();
    // window.location.href = "/403";
  }
  if (status === 401) {
    window.localStorage.clear();
    window.location.href = "/401";
  }
  const error = err || {};

  if (Array.isArray(message)) {
    error.message = message[0];
  } else if (typeof message === "string") {
    error.message = message;
  } else {
    error.message =
      "Lỗi hệ thống! Vui lòng kiểm tra lại mạng internet của máy!";
  }

  throw error;
};
