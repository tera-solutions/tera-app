import { ReactNode } from "react";
import classNames from "classnames";
import {
  ArrowDownCircleOutlined,
  ArrowUpCircleOutlined,
  CurrencyDollarOutlined,
  XCircleOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";
import WidgetState from "_common/components/WidgetState";

import type { WalletSummaryStats } from "../_interface";
import { formatVnd } from "../_utils";

interface WalletSummaryProps {
  stats: WalletSummaryStats;
  loading?: boolean;
}

const ChangeLine = ({ change }: { change: number | null }) => {
  if (change === null)
    return <p className="text-xs text-slate-400">— so với tháng trước</p>;
  const up = change >= 0;
  return (
    <p
      className={classNames(
        "text-xs font-medium",
        up ? "text-emerald-500" : "text-rose-500",
      )}
    >
      {up ? "↑" : "↓"} {Math.abs(change).toFixed(1)}%{" "}
      <span className="font-normal text-slate-400">so với tháng trước</span>
    </p>
  );
};

const Tile = ({
  icon,
  iconClassName,
  label,
  value,
  change,
}: {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value: ReactNode;
  change: number | null;
}) => (
  <div className="flex items-start gap-3">
    <IconBox
      icon={icon}
      sizeClassName="h-11 w-11"
      roundedClassName="rounded-full"
      colorClassName={iconClassName}
      iconSizeClassName="[&_svg]:h-5 [&_svg]:w-5"
    />
    <div className="min-w-0 leading-tight">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-0.5 truncate text-xl font-bold text-slate-800">{value}</p>
      <div className="mt-1">
        <ChangeLine change={change} />
      </div>
    </div>
  </div>
);

/** "Tổng quan ví" — 4 chỉ số tổng hợp từ lịch sử giao dịch. */
const WalletSummary = ({ stats, loading }: WalletSummaryProps) => (
  <Card className="xmd:p-5">
    <p className="mb-4 text-base font-semibold text-slate-800">Tổng quan ví</p>
    <WidgetState isLoading={loading}>
      {/* 4 tile trên 1 hàng chỉ từ 1536px: ở 1280px cột phải chỉ còn ~576px, chia 4 thì
          giá trị tiền bị truncate. */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 2xl:grid-cols-4 2xl:divide-x 2xl:divide-slate-100 2xl:[&>*+*]:pl-5">
        <Tile
          icon={<ArrowDownCircleOutlined />}
          iconClassName="bg-sky-50 text-sky-500"
          label="Tổng nạp tiền"
          value={formatVnd(stats.totalIn)}
          change={stats.totalInChange}
        />
        <Tile
          icon={<ArrowUpCircleOutlined />}
          iconClassName="bg-emerald-50 text-emerald-500"
          label="Tổng rút tiền"
          value={formatVnd(stats.totalOut)}
          change={stats.totalOutChange}
        />
        <Tile
          icon={<CurrencyDollarOutlined />}
          iconClassName="bg-violet-50 text-violet-500"
          label="Giao dịch thành công"
          value={stats.successCount}
          change={stats.successCountChange}
        />
        <Tile
          icon={<XCircleOutlined />}
          iconClassName="bg-amber-50 text-amber-500"
          label="Giao dịch thất bại"
          value={stats.failedCount}
          change={stats.failedCountChange}
        />
      </div>
    </WidgetState>
  </Card>
);

export default WalletSummary;
