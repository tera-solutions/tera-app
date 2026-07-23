import { authEndpoint, auth2Endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

export const AuthApi = {
  getDeviceCode: async () =>
    await api
      .post(`${auth2Endpoint}/device/init`)
      .then((result) => result.data?.data),
  checkAuth: async (params: any) =>
    await api
      .post(`${authEndpoint}/check-auth`, params)
      .then((result) => result.data),
  logout: async () => await api.post(`${authEndpoint}/logout`),
  getProfile: async () =>
    await api.get(`${auth2Endpoint}/profile`).then((result) => result.data),
  updateProfile: async (params: any) =>
    await api.put(`${auth2Endpoint}/profile`, params).then((result) => result.data),
  changePassword: async (params: { current_password: string; new_password: string }) =>
    await api
      .post(`${auth2Endpoint}/profile/change-password`, params)
      .then((result) => result.data),
  getMetadata: async () =>
    await api.get(`${authEndpoint}/metadata`).then((result) => result.data),
  getPermissions: async () =>
    await api
      .get(`${authEndpoint}/get-permissions`)
      .then((result) => result.data),
  getEpic: async (params: any) =>
    await api
      .get(`${authEndpoint}/get-epics`, params)
      .then((result) => result.data),
  disableWelcome: async () =>
    await api.post(`${authEndpoint}/auth/turn-off-welcome`),
  resetPassword: async (params: any) =>
    await api
      .post(`${authEndpoint}/auth/reset-direct-password`, params)
      .then((result) => result.data),
  activeAccount: async (params: any) =>
    await api
      .post(`${authEndpoint}/auth/send-mail-active-account`, params)
      .then((result) => result.data),
  forgotPassword: async (params: any) =>
    await api
      .post(`${authEndpoint}/auth/forgot-password`, params)
      .then((result) => result.data),
  login: async (params: any) =>
    await api
      .post(`${auth2Endpoint}/login`, params)
      .then((result) => result.data),
  refreshToken: async (refreshToken: string) =>
    await api
      .post(`${auth2Endpoint}/refresh-token`, { refresh_token: refreshToken })
      .then((result) => result.data),
  checkLogin: async (params: any) =>
    await api
      .post(`${authEndpoint}/check-login`, params)
      .then((result) => result.data),
  register: async (params: any) =>
    await api
      .post(`${authEndpoint}/register`, params)
      .then((result) => result.data),
  // Teacher-app self-service: creates a business + owner account in one call.
  registerSchool: async (params: any) =>
    await api
      .post(`${authEndpoint}/register-school`, params)
      .then((result) => result.data),
  // "Login with Google/Microsoft" — id_token from the provider's own JS SDK,
  // verified server-side. Same response shape as `login`.
  socialLogin: async (params: { provider: "google" | "microsoft"; id_token: string }) =>
    await api
      .post(`${authEndpoint}/social-login`, params)
      .then((result) => result.data),
  verifyOtp: async (params: any) =>
    await api
      .post(`${authEndpoint}/verify-otp`, params)
      .then((result) => result.data),
  verifyToken: async (params: any) =>
    await api
      .post(`${authEndpoint}/verify-token`, params)
      .then((result) => result.data),
  resendOtp: async (params: any) =>
    await api
      .post(`${authEndpoint}/resend-otp`, params)
      .then((result) => result.data),
  activation: async (params: any) =>
    await api
      .post(`${authEndpoint}/account-activation`, params)
      .then((result) => result.data),
  enableBusiness: async (params: any) =>
    await api
      .post(`${authEndpoint}/administrator/business/enable`, params)
      .then((result) => result.data),
};
