import classNames from "classnames";
import { BuildingLibraryOutlined, CheckCircleSolid, PlusCircleOutlined, notification } from "tera-dls";

import Badge from "_common/components/Badge";
import Card from "_common/components/Card";
import WidgetState from "_common/components/WidgetState";

import type { LinkedBankAccount } from "../../Wallet/_interface";
import { maskAccountNumber } from "../../Wallet/_utils";

interface BankAccountPickerProps {
  accounts: LinkedBankAccount[];
  /** Rỗng = chưa chọn. Dùng `accountNumber` làm id vì chưa có id thật từ BE. */
  value: string;
  onChange: (accountNumber: string) => void;
  loading?: boolean;
}

/**
 * "Thông tin tài khoản nhận tiền".
 *
 * ⚠️ Danh sách LUÔN RỖNG hiện tại: ví không có `bank_accounts` và `/api/auth/profile` không trả
 * `bank_account` (verify 2026-07-09). Khi BE có, chỉ cần đổ `accounts` vào — phần chọn đã sẵn.
 */
const BankAccountPicker = ({
  accounts,
  value,
  onChange,
  loading,
}: BankAccountPickerProps) => {
  const notReady = () =>
    notification.warning({ message: "Tính năng đang được phát triển" });

  return (
    <Card className="xmd:p-5" animated={false}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <p className="text-base font-semibold text-slate-800">
          Thông tin tài khoản nhận tiền
        </p>
        <button
          type="button"
          onClick={notReady}
          className="shrink-0 text-xs font-medium text-brand transition-opacity hover:opacity-75"
        >
          Quản lý tài khoản
        </button>
      </div>

      <WidgetState
        isLoading={loading}
        isEmpty={!loading && accounts.length === 0}
        emptyText="Chưa liên kết tài khoản ngân hàng"
      >
        <div className="flex flex-col gap-2">
          {accounts.map((acc) => {
            const active = value === acc.accountNumber;
            return (
              <button
                key={acc.accountNumber}
                type="button"
                onClick={() => onChange(acc.accountNumber)}
                aria-pressed={active}
                className={classNames(
                  "relative flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                  active
                    ? "border-brand bg-sky-50/50"
                    : "border-slate-200 hover:border-brand/40 hover:bg-sky-50/30",
                )}
              >
                {active && (
                  <CheckCircleSolid className="absolute right-2 top-2 h-5 w-5 text-brand" />
                )}
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <BuildingLibraryOutlined className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-slate-700">
                      {acc.bankName}
                    </span>
                    {acc.isDefault && (
                      <Badge className="bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-600">
                        Mặc định
                      </Badge>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs tracking-wider text-slate-400">
                    {maskAccountNumber(acc.accountNumber)}
                  </span>
                  <span className="mt-0.5 block truncate text-xs text-slate-500">
                    {acc.holderName}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </WidgetState>

      <button
        type="button"
        onClick={notReady}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:border-brand/60 hover:text-brand"
      >
        <PlusCircleOutlined className="h-4 w-4" />
        Thêm tài khoản ngân hàng
      </button>
    </Card>
  );
};

export default BankAccountPicker;
