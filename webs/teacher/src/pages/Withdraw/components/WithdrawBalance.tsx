import { ReactNode } from "react";
import { BanknotesOutlined, ClockOutlined, WalletOutlined } from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

import { approxVnd, formatVnd } from "../../Wallet/_utils";
import type { WithdrawStats } from "../_interface";

interface WithdrawBalanceProps {
  balance: number;
  stats: WithdrawStats;
  loading?: boolean;
}

const Tile = ({
  icon,
  iconClassName,
  label,
  value,
  sub,
}: {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value: string;
  sub: string;
}) => (
  <div className="flex items-start gap-3">
    <IconBox
      icon={icon}
      sizeClassName="h-10 w-10"
      roundedClassName="rounded-xl"
      colorClassName={iconClassName}
      iconSizeClassName="[&_svg]:h-5 [&_svg]:w-5"
    />
    <div className="min-w-0 leading-tight">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 truncate text-lg font-bold text-slate-800">{value}</p>
      <p className="mt-0.5 text-[11px] text-slate-400">{sub}</p>
    </div>
  </div>
);

/** "Số dư khả dụng" + 2 tile thống kê + hộp lưu ý thời gian xử lý. */
const WithdrawBalance = ({ balance, stats, loading }: WithdrawBalanceProps) => (
  <Card className="xmd:p-5" animated={false}>
    <p className="mb-3 text-base font-semibold text-slate-800">Số dư khả dụng</p>

    <div className="flex items-center gap-3">
      <IconBox
        icon={<WalletOutlined />}
        sizeClassName="h-12 w-12"
        roundedClassName="rounded-2xl"
        colorClassName="bg-sky-50 text-brand"
        iconSizeClassName="[&_svg]:h-6 [&_svg]:w-6"
      />
      <div>
        {loading ? (
          <div className="h-8 w-40 animate-pulse rounded-lg bg-slate-100" />
        ) : (
          <p className="text-2xl font-bold tracking-tight text-brand xmd:text-3xl">
            {formatVnd(balance)}
          </p>
        )}
        <p className="mt-0.5 text-xs text-slate-400">
          {loading ? " " : approxVnd(balance)}
        </p>
      </div>
    </div>

    <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
      <Tile
        icon={<BanknotesOutlined />}
        iconClassName="bg-emerald-50 text-emerald-600"
        label="Tổng số tiền đã rút"
        value={formatVnd(stats.totalWithdrawn)}
        sub={`${stats.totalWithdrawnCount} giao dịch`}
      />
      <Tile
        icon={<ClockOutlined />}
        iconClassName="bg-amber-50 text-amber-600"
        label="Đang chờ xử lý"
        value={formatVnd(stats.pendingAmount)}
        sub={`${stats.pendingCount} giao dịch`}
      />
    </div>
  </Card>
);

export default WithdrawBalance;
