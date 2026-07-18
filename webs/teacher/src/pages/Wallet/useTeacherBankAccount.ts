import { useMemo } from "react";

import { BankAccountService } from "@tera/modules/wallet";

import type { LinkedBankAccount } from "./_interface";

/**
 * Tài khoản ngân hàng đã lưu trong hồ sơ giáo viên (`fin/bank-account/me`) —
 * 1 tài khoản/giáo viên, dùng chung cho màn Ví lẫn màn Rút tiền.
 *
 * ⚠️ `data` là `null` khi giáo viên chưa từng thiết lập (không phải lỗi).
 */
export const useTeacherBankAccount = () => {
  const bankAccountQuery = BankAccountService.useMyBankAccount();
  const raw = bankAccountQuery.data?.data ?? null;

  const bankAccounts: LinkedBankAccount[] = useMemo(() => {
    if (!raw?.bank_account_number) return [];
    return [
      {
        bankName: String(raw.bank_name ?? "—"),
        accountNumber: String(raw.bank_account_number),
        holderName: String(raw.bank_account_holder ?? ""),
        isDefault: true,
      },
    ];
  }, [raw]);

  return {
    bankAccount: raw,
    bankAccounts,
    hasBankAccount: bankAccounts.length > 0,
    bankAccountQuery,
    isLoading: bankAccountQuery.isLoading,
  };
};

export default useTeacherBankAccount;
