import {
  BuildingLibraryOutlined,
  CheckCircleOutlined,
  DocumentTextOutlined,
  WalletOutlined,
} from "tera-dls";

import Card from "_common/components/Card";

import type { PaymentTimelineItem, TimelineIcon } from "../_interface";

const ICONS: Record<TimelineIcon, React.ReactNode> = {
  created: <DocumentTextOutlined />,
  approved: <CheckCircleOutlined />,
  paid: <WalletOutlined />,
  transfer: <BuildingLibraryOutlined />,
};

interface PaymentTimelineProps {
  items: PaymentTimelineItem[];
}

const PaymentTimeline = ({ items }: PaymentTimelineProps) => (
  <Card className="xmd:p-5" animated={false}>
    <p className="mb-4 text-base font-semibold text-slate-800">Lịch sử thanh toán</p>
    <ol className="flex flex-col">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <li key={it.id} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && (
              <span className="absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-px bg-slate-200" />
            )}
            <span className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 [&_svg]:h-4 [&_svg]:w-4">
              {ICONS[it.icon]}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-medium text-slate-700">{it.title}</p>
              <p className="text-xs text-slate-400">{it.time}</p>
              {it.transactionCode && (
                <p className="mt-0.5 break-all text-xs text-slate-400">
                  Mã giao dịch: {it.transactionCode}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  </Card>
);

export default PaymentTimeline;
