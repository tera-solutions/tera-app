import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";

import type { DateRange } from "../Wallet/_interface";
import { presetToRange, toLinkedBankAccounts } from "../Wallet/_utils";
import useTeacherWallet from "../Wallet/useTeacherWallet";

import BankAccountPicker from "./components/BankAccountPicker";
import WithdrawBalance from "./components/WithdrawBalance";
import WithdrawForm from "./components/WithdrawForm";
import WithdrawHistory from "./components/WithdrawHistory";
import WithdrawNotice from "./components/WithdrawNotice";
import type { WithdrawHistoryRow, WithdrawStats } from "./_interface";

/**
 * ⚠️ Backend KHÔNG có khái niệm rút tiền (không route, `transaction_type` không có `withdraw`).
 * Trang này chỉ dựng UI + component; **không gọi API rút tiền nào**. Số dư dùng lại
 * `useTeacherWallet()` của [050]. Bảng lịch sử và 2 tile thống kê cố ý để rỗng — không bịa dữ liệu
 * tiền. Xem `constants.WITHDRAW_ENABLED`.
 */
const EMPTY_STATS: WithdrawStats = {
  totalWithdrawn: 0,
  totalWithdrawnCount: 0,
  pendingAmount: 0,
  pendingCount: 0,
};

/** [052] Rút tiền — trang riêng `/wallet/withdraw`. */
const Withdraw = () => {
  const navigate = useNavigate();

  const [amount, setAmount] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [bankAccountId, setBankAccountId] = useState("");

  const [range, setRange] = useState<DateRange>(() => presetToRange("month"));
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);

  const { wallet, profileQuery, walletQuery, isLoading: walletLoading } = useTeacherWallet();

  const bankAccounts = useMemo(
    () => toLinkedBankAccounts(walletQuery.data, profileQuery.data),
    [walletQuery.data, profileQuery.data],
  );

  // Chưa có endpoint → luôn rỗng. Khi BE có route thì thay bằng query, giữ nguyên props bảng.
  const rows: WithdrawHistoryRow[] = [];

  return (
    <div className="p-4 xmd:p-6">
      <button
        type="button"
        onClick={() => navigate(PATHS.wallet)}
        className="mb-3 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-brand"
      >
        <ArrowLeftOutlined className="h-4 w-4" />
        Quay lại Ví cá nhân
      </button>

      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800">Rút tiền</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Rút tiền từ số dư ví về tài khoản ngân hàng của bạn.
        </p>
      </div>

      {/* Mobile: số dư → tài khoản nhận → nhập thông tin → lịch sử (form nằm sau khi đã chọn TK). */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 [&>*]:min-w-0">
        {/* Lưu ý là card riêng, xếp ngay dưới thẻ số dư trong cùng cột 1. */}
        <div className="flex flex-col gap-4">
          <WithdrawBalance balance={wallet.balance} stats={EMPTY_STATS} loading={walletLoading} />
          <WithdrawNotice />
        </div>

        <BankAccountPicker
          accounts={bankAccounts}
          value={bankAccountId}
          onChange={setBankAccountId}
          loading={walletLoading}
        />

        <WithdrawForm
          amount={amount}
          onAmountChange={setAmount}
          note={note}
          onNoteChange={setNote}
          balance={wallet.balance}
          bankAccountId={bankAccountId}
          onSubmit={() => undefined}
        />

        <div className="lg:col-span-3">
          <WithdrawHistory
            rows={rows}
            total={rows.length}
            page={page}
            perPage={perPage}
            onPageChange={(p, size) => {
              setPage(size !== perPage ? 1 : p);
              setPerPage(size);
            }}
            range={range}
            onRangeChange={(r) => {
              setRange(r);
              setPage(1);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
