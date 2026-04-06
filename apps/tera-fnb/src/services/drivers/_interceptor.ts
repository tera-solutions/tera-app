import { rootStore } from 'src/states/index';
import _ from 'lodash';

export const _requestHeader = (config: any) => {
  const newConfig = config;
  const authToken = rootStore.authStore.token;
  const deviceCode = rootStore.generalStore.device;
  // const locationId = rootStore.commonStore.location_id;
  // const stockId = rootStore.commonStore.stock_id;
  const businessId = rootStore.uiStore.business_info.id;
  // const module = rootStore.commonStore.module;

  const headers: any = {};

  try {
    if (deviceCode) {
      headers['device-code'] = deviceCode;
    }

    // if (locationId) {
    //   headers['location-id'] = locationId;
    // }

    // if (stockId) {
    //   headers['stock-id'] = stockId;
    // }

    if (businessId) {
      headers['business-id'] = businessId;
    }

    // if (businessId) {
    //   headers['module'] = module;
    // }

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
  const status = _.get(response, 'data.code');
  if (status === 200) {
    const message = _.get(response, 'data.message');
    let data = _.get(response, 'data');
    if (!_.isEmpty(message)) {
      data = { ...data, message: '' };
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
    _.get(err, 'data.msg') || _.get(err, 'response.data.error.message');
  const status = _.get(err, 'data.code') || _.get(err, 'response.status');
  status;
  if (status === 403) {
    console.error('Không có quyền hệ thống 403');
  }
  if (status === 401) {
    console.error('Không có quyền hệ thống 401');
  }
  const error = err || {};
  if (typeof message === 'string') {
    error.message = message;
  } else {
    error.message = 'Lỗi hệ thống! Vui lòng kiểm tra lại mạng internet của máy!';
  }
  throw error;
};
