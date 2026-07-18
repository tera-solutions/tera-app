import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, notification } from "tera-dls";

import { WalletRequestService } from "@tera/modules/wallet";

import { PATHS } from "_common/components/Layout/Menu/menus";
import useConfirm from "_common/hooks/useConfirm";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";

import type { DateRange } from "../Wallet/_interface";
import { presetToRange } from "../Wallet/_utils";
import useTeacherWallet from "../Wallet/useTeacherWallet";
import useTeacherBankAccount from "../Wallet/useTeacherBankAccount";

import BankAccountPicker from "./components/BankAccountPicker";
import WithdrawBalance from "./components/WithdrawBalance";
import WithdrawForm from "./components/WithdrawForm";
import WithdrawHistory from "./components/WithdrawHistory";
import WithdrawNotice from "./components/WithdrawNotice";
import type { WithdrawHistoryRow } from "./_interface";
import { isSubmittable, summarizeWithdraw, toWithdrawHistory } from "./_utils";

const toApiDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** [052] Rút tiền — trang riêng `/wallet/withdraw`, đi qua `fin/wallet-request/*`. */
const Withdraw = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [amount, setAmount] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const [range, setRange] = useState<DateRange>(() => presetToRange("month"));
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);

  const { wallet, isLoading: walletLoading } = useTeacherWallet();
  const {
    bankAccount,
    bankAccounts,
    hasBankAccount,
    isLoading: bankAccountLoading,
  } = useTeacherBankAccount();

  const listParams: Record<string, unknown> = {
    page,
    per_page: perPage,
    wallet_id: wallet.id,
    request_type: "withdraw",
    status: statusFilter || undefined,
    date_from: toApiDate(range.from),
    date_to: toApiDate(range.to),
  };
  const historyQuery = WalletRequestService.useWalletRequestList(
    { params: listParams },
    { enabled: !!wallet.id },
  );
  const rows = useMemo(() => toWithdrawHistory(historyQuery.data), [historyQuery.data]);
  const total = historyQuery.data?.data?.pagination?.total ?? rows.length;

  // Thống kê 2 tile tính riêng từ 100 yêu cầu gần nhất — không phân trang, phản ánh toàn bộ lịch sử
  // gần đây thay vì chỉ trang hiện tại.
  const statsParams: Record<string, unknown> = {
    page: 1,
    per_page: 100,
    wallet_id: wallet.id,
    request_type: "withdraw",
  };
  const statsQuery = WalletRequestService.useWalletRequestList(
    { params: statsParams },
    { enabled: !!wallet.id },
  );
  const stats = useMemo(() => summarizeWithdraw(toWithdrawHistory(statsQuery.data)), [statsQuery.data]);

  const withdrawMutation = WalletRequestService.useWalletRequestCreate();
  const { mutate: cancelRequest } = WalletRequestService.useWalletRequestCancel();

  const handleSubmit = () => {
    if (amount === null || !isSubmittable(amount, wallet.balance, hasBankAccount)) return;

    withdrawMutation.mutate(
      {
        params: {
          request_type: "withdraw",
          amount,
          note: note || undefined,
        },
      },
      {
        onSuccess: () => {
          setAmount(null);
          setNote("");
          notification.success({ message: "Đã gửi yêu cầu rút tiền, chờ quản trị viên duyệt" });
        },
        onError: (error: any) =>
          notification.error({
            message: error?.data?.msg ?? "Gửi yêu cầu thất bại. Vui lòng thử lại.",
          }),
      },
    );
  };

  const handleCancel = (row: WithdrawHistoryRow) => {
    confirm.warning({
      title: "Hủy yêu cầu rút tiền",
      content: `Bạn có chắc muốn hủy yêu cầu "${row.code}"?`,
      onOk: () =>
        cancelRequest(
          { id: row.id },
          {
            onSuccess: () => notification.success({ message: "Đã hủy yêu cầu" }),
            onError: (error: any) =>
              notification.error({ message: error?.data?.msg ?? "Không thể hủy yêu cầu" }),
          },
        ),
    });
  };

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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 [&>*]:min-w-0">
        <div className="flex flex-col gap-4">
          <WithdrawBalance balance={wallet.balance} stats={stats} loading={walletLoading} />
          <WithdrawNotice />
        </div>

        <BankAccountPicker
          accounts={bankAccounts}
          account={bankAccount}
          loading={bankAccountLoading}
        />

        <WithdrawForm
          amount={amount}
          onAmountChange={setAmount}
          note={note}
          onNoteChange={setNote}
          hasBankAccount={hasBankAccount}
          balance={wallet.balance}
          submitting={withdrawMutation.isPending}
          onSubmit={handleSubmit}
        />

        <div className="lg:col-span-3">
          <WithdrawHistory
            rows={rows}
            total={total}
            page={page}
            perPage={perPage}
            isLoading={historyQuery.isLoading}
            isError={historyQuery.isError}
            onRetry={() => historyQuery.refetch()}
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
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
