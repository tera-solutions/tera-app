import { ReactNode } from "react";
import {
  BuildingLibraryOutlined,
  CreditCardOutlined,
  DevicePhoneMobileOutlined,
  GlobeAltOutlined,
  InformationCircleOutlined,
  notification,
} from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

const METHODS: {
  key: string;
  icon: ReactNode;
  iconClassName: string;
  name: string;
  desc: string;
}[] = [
  {
    key: "bank_transfer",
    icon: <BuildingLibraryOutlined />,
    iconClassName: "bg-sky-50 text-sky-600",
    name: "Chuyển khoản",
    desc: "Nạp tiền qua ngân hàng",
  },
  {
    key: "atm",
    icon: <CreditCardOutlined />,
    iconClassName: "bg-emerald-50 text-emerald-600",
    name: "Thẻ ATM nội địa",
    desc: "VISA, Napas, ATM",
  },
  {
    key: "e_wallet",
    icon: <DevicePhoneMobileOutlined />,
    iconClassName: "bg-violet-50 text-violet-600",
    name: "Ví điện tử",
    desc: "Momo, ZaloPay, VNPay",
  },
  {
    key: "international",
    icon: <GlobeAltOutlined />,
    iconClassName: "bg-amber-50 text-amber-600",
    name: "Thẻ quốc tế",
    desc: "Visa, Mastercard, JCB",
  },
];

/** "Nạp tiền vào ví" — lưới hình thức nạp. Flow nạp thật = task [051]. */
const DepositMethods = () => {
  const notReady = () =>
    notification.warning({ message: "Tính năng đang được phát triển" });

  return (
    <Card className="xmd:p-5">
      <p className="text-base font-semibold text-slate-800">Nạp tiền vào ví</p>
      <p className="mt-0.5 text-xs text-slate-400">
        Chọn hình thức nạp tiền phù hợp với bạn
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {METHODS.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={notReady}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 text-left transition-colors hover:border-brand/40 hover:bg-sky-50/40"
          >
            <IconBox
              icon={m.icon}
              sizeClassName="h-10 w-10"
              roundedClassName="rounded-xl"
              colorClassName={m.iconClassName}
              iconSizeClassName="[&_svg]:h-5 [&_svg]:w-5"
            />
            <span className="min-w-0 leading-tight">
              <span className="block text-sm font-semibold text-slate-700">{m.name}</span>
              <span className="mt-0.5 block truncate text-xs text-slate-400">{m.desc}</span>
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={notReady}
        className="mt-4 flex w-full items-center justify-center gap-1.5 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500 transition-colors hover:text-brand"
      >
        <InformationCircleOutlined className="h-4 w-4" />
        Hướng dẫn nạp tiền
      </button>
    </Card>
  );
};

export default DepositMethods;
