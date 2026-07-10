import { useState } from "react";
import {
  ArrowUpTrayOutlined,
  EyeOutlined,
  EyeSlashOutlined,
  PlusCircleOutlined,
  WalletOutlined,
  notification,
} from "tera-dls";

import { approxVnd, formatVnd } from "../_utils";

interface BalanceCardProps {
  balance: number;
  loading?: boolean;
}

/** Thẻ số dư gradient xanh: ẩn/hiện số dư + 2 nút Nạp tiền / Rút tiền. */
const BalanceCard = ({ balance, loading }: BalanceCardProps) => {
  // Mặc định ẩn số dư — người dùng bấm con mắt mới hiện (không nhớ lựa chọn giữa các lần vào trang).
  const [hidden, setHidden] = useState(true);

  // Nạp tiền = task [051], Rút tiền = task [052] — chưa làm.
  const notReady = () =>
    notification.warning({ message: "Tính năng đang được phát triển" });

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-5 text-white shadow-[0_8px_24px_rgba(14,116,214,0.25)]">
      <WalletOutlined className="pointer-events-none absolute -right-3 top-2 h-32 w-32 text-white/10" />

      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-white/85">Số dư hiện tại</p>
        <button
          type="button"
          onClick={() => setHidden((v) => !v)}
          className="text-white/70 transition-colors hover:text-white"
          aria-label={hidden ? "Hiện số dư" : "Ẩn số dư"}
        >
          {hidden ? <EyeSlashOutlined className="h-4 w-4" /> : <EyeOutlined className="h-4 w-4" />}
        </button>
      </div>

      {loading ? (
        <div className="mt-3 h-9 w-44 animate-pulse rounded-lg bg-white/20" />
      ) : (
        <p className="mt-2 text-3xl font-bold tracking-tight xmd:text-4xl">
          {hidden ? "••••••••" : formatVnd(balance)}
        </p>
      )}
      <p className="mt-1 text-xs text-white/70">
        {loading || hidden ? " " : approxVnd(balance)}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={notReady}
          className="flex items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-semibold text-brand transition-opacity hover:opacity-90"
        >
          <PlusCircleOutlined className="h-4 w-4" />
          Nạp tiền
        </button>
        <button
          type="button"
          onClick={notReady}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/60 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          <ArrowUpTrayOutlined className="h-4 w-4" />
          Rút tiền
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;
