import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, Modal, notification } from "tera-dls";

import { WalletRequestService } from "@tera/modules/wallet";

import { PATHS } from "_common/components/Layout/Menu/menus";
import useConfirm from "_common/hooks/useConfirm";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";

import type { DateRange } from "../Wallet/_interface";
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
import type { DepositHistoryRow } from "./_interface";

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

  const confirm = useConfirm();
  const { wallet, isLoading: walletLoading } = useTeacherWallet();

  const historyParams: Record<string, unknown> = {
    page,
    per_page: perPage,
    wallet_id: wallet.id,
    request_type: "deposit",
    status: statusFilter || undefined,
    date_from: toApiDate(range.from),
    date_to: toApiDate(range.to),
  };
  const historyQuery = WalletRequestService.useWalletRequestList(
    { params: historyParams },
    { enabled: !!wallet.id },
  );
  const rows = useMemo(() => toDepositHistory(historyQuery.data), [historyQuery.data]);
  const total = historyQuery.data?.data?.pagination?.total ?? rows.length;

  const depositMutation = WalletRequestService.useWalletRequestCreate();
  const { mutate: cancelRequest } = WalletRequestService.useWalletRequestCancel();

  const handleConfirm = () => {
    if (!isSubmittable(amount, methodKey) || amount === null) return;

    depositMutation.mutate(
      {
        params: {
          request_type: "deposit",
          amount,
          note: buildDepositNote(methodKey),
        },
      },
      {
        onSuccess: () => {
          setConfirmOpen(false);
          setAmount(null);
          notification.success({ message: "Đã gửi yêu cầu nạp tiền, chờ quản trị viên xác nhận" });
        },
        onError: (error: any) =>
          notification.error({
            message: error?.data?.msg ?? "Gửi yêu cầu thất bại. Vui lòng thử lại.",
          }),
      },
    );
  };

  const handleCancel = (row: DepositHistoryRow) => {
    confirm.warning({
      title: "Hủy yêu cầu nạp tiền",
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
            onWithdraw={() => navigate(PATHS.walletWithdraw)}
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
            onCancel={handleCancel}
          />
        </div>
      </div>

      {/* Chỉ mở được khi `DEPOSIT_ENABLED` bật — nút submit disable khi tắt. */}
      <Modal
        title="Xác nhận gửi yêu cầu nạp tiền"
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
