import { BuildingLibraryOutlined, PlusCircleOutlined } from "tera-dls";

import Badge from "_common/components/Badge";
import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";

import type { LinkedBankAccount } from "../_interface";
import { maskAccountNumber } from "../_utils";

interface LinkedBankAccountsProps {
  accounts: LinkedBankAccount[];
  loading?: boolean;
  /** Mở modal thiết lập/cập nhật tài khoản ngân hàng (`fin/bank-account/me`). */
  onManage: () => void;
}

/** "Tài khoản ngân hàng liên kết" — 1 tài khoản/giáo viên, số tài khoản luôn hiển thị dạng che. */
const LinkedBankAccounts = ({ accounts, loading, onManage }: LinkedBankAccountsProps) => {
  return (
    <Card className="xmd:p-5">
      <p className="mb-4 text-base font-semibold text-slate-800">
        Tài khoản ngân hàng liên kết
      </p>

      <WidgetState
        isLoading={loading}
        isEmpty={!loading && accounts.length === 0}
        emptyText="Chưa liên kết tài khoản ngân hàng"
      >
        <div className="flex flex-col gap-2">
          {accounts.map((acc) => (
            <button
              key={`${acc.bankName}-${acc.accountNumber}`}
              type="button"
              onClick={onManage}
              className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition-colors hover:border-brand/40 hover:bg-sky-50/30"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <BuildingLibraryOutlined className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-sm font-semibold text-slate-700">
                  {acc.bankName}
                </p>
                <p className="mt-0.5 text-xs tracking-wider text-slate-400">
                  {maskAccountNumber(acc.accountNumber)}
                </p>
              </div>
              {acc.isDefault && (
                <Badge className="bg-sky-50 px-2.5 py-0.5 text-[11px] text-sky-600">
                  Mặc định
                </Badge>
              )}
            </button>
          ))}
        </div>
      </WidgetState>

      <button
        type="button"
        onClick={onManage}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:border-brand/60 hover:text-brand"
      >
        <PlusCircleOutlined className="h-4 w-4" />
        {accounts.length > 0 ? "Cập nhật tài khoản ngân hàng" : "Thêm tài khoản ngân hàng"}
      </button>
    </Card>
  );
};

export default LinkedBankAccounts;
