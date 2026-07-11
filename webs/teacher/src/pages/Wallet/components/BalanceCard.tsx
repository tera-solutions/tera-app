import { useState } from "react";
import classNames from "classnames";
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
  /** Trang Nạp tiền tắt nút này — đang ở đó rồi thì bấm "Nạp tiền" là thừa. */
  showDeposit?: boolean;
  showWithdraw?: boolean;
  onDeposit?: () => void;
  onWithdraw?: () => void;
  /** `stretch` (mặc định, màn Ví): nút chia đều hết bề ngang thẻ.
   * `end` (trang Nạp tiền): **từ `lg` trở lên** nút co theo nội dung + dạt phải;
   * dưới `lg` vẫn full-width (nút ngắn nằm giữa thẻ rộng trông hụt hơn là full-width). */
  actionsAlign?: "stretch" | "end";
}

/** Thẻ số dư gradient xanh: ẩn/hiện số dư + nút Nạp tiền / Rút tiền. */
const BalanceCard = ({
  balance,
  loading,
  showDeposit = true,
  showWithdraw = true,
  onDeposit,
  onWithdraw,
  actionsAlign = "stretch",
}: BalanceCardProps) => {
  // Mặc định ẩn số dư — người dùng bấm con mắt mới hiện (không nhớ lựa chọn giữa các lần vào trang).
  const [hidden, setHidden] = useState(true);

  const notReady = () =>
    notification.warning({ message: "Tính năng đang được phát triển" });

  return (
    // `h-full` + `flex-col`: thẻ giãn theo chiều cao hàng grid, nút được `mt-auto` ghim xuống đáy
    // thay vì lơ lửng ngay dưới số dư.
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-brand to-brand-dark p-5 text-white shadow-[0_8px_24px_rgba(14,116,214,0.25)]">
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

      {(showDeposit || showWithdraw) && (
        <div
          className={classNames(
            "mt-auto pt-5",
            actionsAlign === "end"
              ? "grid grid-cols-1 lg:flex lg:justify-end"
              : classNames("grid gap-3", showDeposit && showWithdraw ? "grid-cols-2" : "grid-cols-1"),
          )}
        >
          {showDeposit && (
            <button
              type="button"
              onClick={onDeposit ?? notReady}
              className={classNames(
                "flex items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-brand transition-opacity hover:opacity-90",
                actionsAlign === "end" ? "py-2.5 lg:px-4 lg:py-2" : "py-2.5",
              )}
            >
              <PlusCircleOutlined className="h-4 w-4" />
              Nạp tiền
            </button>
          )}
          {showWithdraw && (
            <button
              type="button"
              onClick={onWithdraw ?? notReady}
              className={classNames(
                "flex items-center justify-center gap-2 rounded-xl border border-white/60 font-semibold text-white transition-colors hover:bg-white/10",
                actionsAlign === "end"
                  ? "py-2.5 text-sm lg:px-4 lg:py-2 lg:text-xs"
                  : "py-2.5 text-sm",
              )}
            >
              <ArrowUpTrayOutlined className="h-4 w-4" />
              Rút tiền
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BalanceCard;
