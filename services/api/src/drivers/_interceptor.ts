import { rootStore } from "@tera/stores";
import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";

const isWeb =
  typeof window !== "undefined" && window.navigator?.product !== "ReactNative";

export const _requestHeader = async (config: any) => {
  const newConfig = config;
  let authToken = rootStore.globalStore.token;
  let deviceCode = rootStore.globalStore.device;
  let businessId = rootStore.globalStore.business_id;

  if (!isWeb) {
    try {
      const rawAuthStore = await AsyncStorage.getItem("AuthMobileStore");
      if (rawAuthStore) {
        const parsed = JSON.parse(rawAuthStore);
        authToken = authToken || parsed.token;
      }
      const rawGeneralStore = await AsyncStorage.getItem("GeneralStore");
      if (rawGeneralStore) {
        const parsedGeneral = JSON.parse(rawGeneralStore);
        deviceCode = deviceCode || parsedGeneral.device;
        businessId = businessId || parsedGeneral.business_id;
      }
    } catch (e) {
      console.error("Lỗi đọc AsyncStorage trong Interceptor", e);
    }
  }

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
    _.get(err, "data.msg") ||
    _.get(err, "response.data.error.message") ||
    _.get(err, "response.data.message") ||
    _.get(err, "response.data.msg");
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
