import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, Modal, notification } from "tera-dls";

import { WalletService } from "@tera/modules/wallet";

import { PATHS } from "_common/components/Layout/Menu/menus";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";

import type { DateRange } from "../Wallet/_interface";
import { DEFAULT_TRANSACTION_STATUS } from "../Wallet/constants";
import { formatVnd, presetToRange } from "../Wallet/_utils";
import BalanceCard from "../Wallet/components/BalanceCard";
import useTeacherWallet from "../Wallet/useTeacherWallet";

import AmountSelector from "./components/AmountSelector";
import DepositHistory from "./components/DepositHistory";
import DepositPromotions from "./components/DepositPromotions";
import DepositSummary from "./components/DepositSummary";
import PaymentMethodPicker from "./components/PaymentMethodPicker";
import { DEPOSIT_ENABLED, DEPOSIT_METHODS } from "./constants";
import { buildDepositNote, isSubmittable, toDepositHistory } from "./_utils";

const toApiDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** [051] Nạp tiền — trang riêng `/wallet/deposit` (bảng lịch sử quá lớn cho một modal). */
const Deposit = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Bấm 1 card ở `DepositMethods` (màn Ví) thì hình thức đó được chọn sẵn.
  const preselected = (location.state as { method?: string } | null)?.method;
  const [methodKey, setMethodKey] = useState(
    DEPOSIT_METHODS.some((m) => m.key === preselected) ? preselected! : "",
  );
  const [amount, setAmount] = useState<number | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [range, setRange] = useState<DateRange>(() => presetToRange("month"));
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);

  const { wallet, isLoading: walletLoading } = useTeacherWallet();

  // "Lịch sử nạp tiền" không cần endpoint riêng — lọc đúng `transaction_type: "deposit"`.
  // ⚠️ `wallet_id` BẮT BUỘC: thiếu nó backend trả giao dịch của MỌI ví.
  const historyParams: Record<string, unknown> = {
    page,
    per_page: perPage,
    wallet_id: wallet.id,
    transaction_type: "deposit",
    date_from: toApiDate(range.from),
    date_to: toApiDate(range.to),
  };
  const historyQuery = WalletService.useWalletTransactions(
    { params: historyParams },
    { enabled: !!wallet.id },
  );
  const allRows = useMemo(() => toDepositHistory(historyQuery.data), [historyQuery.data]);
  const serverTotal = historyQuery.data?.data?.pagination?.total ?? allRows.length;

  /**
   * Lọc trạng thái phía CLIENT — backend bỏ qua param `status` và giao dịch không có field này
   * (xem `STATUS_FILTER_OPTIONS`). Mọi giao dịch đều mang trạng thái gán cứng `completed`, nên:
   *  - không lọc, hoặc lọc "Thành công" → giữ nguyên trang + tổng của server;
   *  - lọc trạng thái khác → rỗng, tổng 0 (thật sự không có giao dịch nào như vậy).
   * Nhờ tính chất hằng số đó, việc lọc trên trang hiện tại không làm sai tổng số.
   */
  const rows = useMemo(
    () => (statusFilter ? allRows.filter((r) => r.status === statusFilter) : allRows),
    [allRows, statusFilter],
  );
  const total =
    !statusFilter || statusFilter === DEFAULT_TRANSACTION_STATUS ? serverTotal : 0;

  const depositMutation = WalletService.useWalletDeposit();

  const handleConfirm = () => {
    if (!wallet.id || !isSubmittable(amount, methodKey)) return;
    const method = DEPOSIT_METHODS.find((m) => m.key === methodKey);

    depositMutation.mutate(
      {
        params: {
          wallet_id: wallet.id,
          amount,
          payment_method: method?.paymentMethod,
          note: buildDepositNote(methodKey),
        },
      },
      {
        onSuccess: () => {
          setConfirmOpen(false);
          setAmount(null);
          notification.success({ message: "Nạp tiền thành công" });
        },
        onError: (error: any) =>
          notification.error({
            message: error?.message ?? "Nạp tiền thất bại. Vui lòng thử lại.",
          }),
      },
    );
  };

  const selectedMethod = DEPOSIT_METHODS.find((m) => m.key === methodKey);

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
        <h1 className="text-xl font-bold text-slate-800">Nạp tiền</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Nạp tiền vào ví để sử dụng các dịch vụ trên Hana Edu một cách nhanh chóng và tiện lợi.
        </p>
      </div>

      {/*
        Trên mobile (1 cột) thứ tự đọc phải là: số dư → chọn số tiền → phương thức → ưu đãi →
        thông tin nạp tiền → lịch sử. "Thông tin nạp tiền" chứa nút xác nhận nên phải nằm SAU khi
        người dùng đã chọn xong số tiền lẫn phương thức, thay vì kẹp giữa như bố cục desktop.
        Đảo bằng `order-*`; từ `lg` trở lên `lg:order-none` trả lại thứ tự nguồn (= bố cục 3 cột).
      */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 [&>*]:min-w-0">
        {/* Đang ở trang Nạp tiền rồi nên bỏ nút "Nạp tiền", chỉ giữ "Rút tiền".
            `self-start`: chỉ còn 1 nút nhỏ nên để thẻ giãn hết chiều cao hàng sẽ chừa
            một mảng xanh trống — cao tự nhiên trông gọn hơn. */}
        <div className="order-1 self-start lg:order-none">
          <BalanceCard
            balance={wallet.balance}
            loading={walletLoading}
            showDeposit={false}
            actionsAlign="end"
          />
        </div>
        <div className="order-2 lg:order-none">
          <AmountSelector amount={amount} onChange={setAmount} />
        </div>
        <div className="order-5 lg:order-none">
          <DepositSummary
            amount={amount}
            methodKey={methodKey}
            submitting={depositMutation.isPending}
            onSubmit={() => setConfirmOpen(true)}
          />
        </div>

        <div className="order-3 lg:order-none lg:col-span-2">
          <PaymentMethodPicker value={methodKey} onChange={setMethodKey} />
        </div>
        <div className="order-4 lg:order-none">
          <DepositPromotions />
        </div>

        <div className="order-6 lg:order-none lg:col-span-3">
          <DepositHistory
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
          />
        </div>
      </div>

      {/* Chỉ mở được khi `DEPOSIT_ENABLED` bật — nút submit disable khi tắt. */}
      <Modal
        title="Xác nhận nạp tiền"
        open={confirmOpen && DEPOSIT_ENABLED}
        className="!w-[92%] overflow-hidden rounded-2xl! sm:!w-[440px]"
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{ className: "rounded-lg!" }}
        cancelButtonProps={{ className: "rounded-lg!" }}
        confirmLoading={depositMutation.isPending}
        onOk={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        destroyOnClose
      >
        <div className="divide-y divide-slate-100 text-sm">
          <div className="flex items-center justify-between gap-4 py-2.5">
            <span className="text-slate-400">Số tiền nạp</span>
            <span className="font-semibold text-brand">
              {amount === null ? "—" : formatVnd(amount)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 py-2.5">
            <span className="text-slate-400">Phương thức</span>
            <span className="font-medium text-slate-700">{selectedMethod?.name ?? "—"}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Deposit;
