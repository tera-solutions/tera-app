import { endpoint } from "@tera/api/_endpoint";
import api from "@tera/api/drivers";

export interface UpdateBankAccountPayload {
  params: {
    bank_name: string;
    bank_account_number: string;
    bank_account_holder: string;
    bank_branch?: string;
  };
}

/**
 * Khớp `BankAccountController` (`v1/fin/bank-account/*`) — tài khoản ngân hàng
 * đã lưu trong hồ sơ giáo viên (1 tài khoản/giáo viên), dùng làm nơi nhận tiền
 * cho `fin/wallet-request/create` khi rút tiền.
 */
export const BankAccountAPI = {
  getMine: async () =>
    await api.get(`${endpoint}/fin/bank-account/me`).then((r) => r.data),

  updateMine: async ({ params }: UpdateBankAccountPayload) =>
    await api.put(`${endpoint}/fin/bank-account/me`, params).then((r) => r.data),
};
