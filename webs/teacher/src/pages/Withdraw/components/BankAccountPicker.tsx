import { useState } from "react";
import { BuildingLibraryOutlined, PlusCircleOutlined } from "tera-dls";

import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";

import type { LinkedBankAccount } from "../../Wallet/_interface";
import { maskAccountNumber } from "../../Wallet/_utils";
import BankAccountModal from "../../Wallet/components/BankAccountModal";

interface BankAccountPickerProps {
  /** 0 hoặc 1 phần tử — 1 tài khoản ngân hàng/giáo viên (`fin/bank-account/me`). */
  accounts: LinkedBankAccount[];
  account: {
    bank_name: string;
    bank_account_number: string;
    bank_account_holder: string;
    bank_branch?: string;
  } | null;
  loading?: boolean;
}

/**
 * "Thông tin tài khoản nhận tiền" — tài khoản ngân hàng đã lưu trong hồ sơ giáo viên,
 * BE tự lấy tài khoản này khi tạo yêu cầu rút tiền (không nhận nhập tay mỗi lần nữa).
 */
const BankAccountPicker = ({ accounts, account, loading }: BankAccountPickerProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const acc = accounts[0];

  return (
    <Card className="xmd:p-5" animated={false}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-base font-semibold text-slate-800">
          Thông tin tài khoản nhận tiền
        </p>
        {acc && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="shrink-0 text-xs font-medium text-brand transition-opacity hover:opacity-75"
          >
            Cập nhật
          </button>
        )}
      </div>

      <WidgetState
        isLoading={loading}
        isEmpty={!loading && !acc}
        emptyText="Chưa thiết lập tài khoản ngân hàng"
      >
        {acc && (
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <BuildingLibraryOutlined className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1 leading-tight">
              <span className="block truncate text-sm font-semibold text-slate-700">
                {acc.bankName}
              </span>
              <span className="mt-0.5 block text-xs tracking-wider text-slate-400">
                {maskAccountNumber(acc.accountNumber)}
              </span>
              <span className="mt-0.5 block truncate text-xs text-slate-500">
                {acc.holderName}
              </span>
            </span>
          </div>
        )}
      </WidgetState>

      {!acc && (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:border-brand/60 hover:text-brand"
        >
          <PlusCircleOutlined className="h-4 w-4" />
          Thêm tài khoản ngân hàng
        </button>
      )}

      <BankAccountModal open={modalOpen} account={account} onClose={() => setModalOpen(false)} />
    </Card>
  );
};

export default BankAccountPicker;
