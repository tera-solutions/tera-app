import type { ReactNode } from "react";
import {
  BuildingLibraryOutlined,
  CreditCardOutlined,
  DevicePhoneMobileOutlined,
  GlobeAltOutlined,
} from "tera-dls";

/**
 * ✅ Bật thật (2026-07-17): nạp tiền giờ đi qua `fin/wallet-request/create` — một YÊU CẦU
 * chờ admin xác nhận đã nhận tiền rồi mới ghi vào sổ ví (`WalletRequestService::complete`),
 * không còn ghi thẳng bút toán như `fin/wallet/deposit` (route đó Teacher vẫn không có quyền,
 * và đúng là không nên có — tự cộng tiền cho mình).
 */
export const DEPOSIT_ENABLED = true;

/** Hạn mức phía sản phẩm (BE chỉ ràng buộc `amount > 0`). */
export const MIN_AMOUNT = 10_000;
export const MAX_AMOUNT = 50_000_000;

export const AMOUNT_PRESETS = [
  100_000, 200_000, 500_000, 1_000_000, 2_000_000, 5_000_000,
];

export interface DepositMethodOption {
  key: string;
  name: string;
  desc: string;
  icon: ReactNode;
  iconClassName: string;
  /** `fin_wallet_requests` không có cột phương thức — chỉ dùng để build `note` (`buildDepositNote`). */
  paymentMethod: string;
  recommended?: boolean;
}

/** Chỉ dùng cho UI chọn hình thức + build `note` gửi kèm yêu cầu — BE không lưu field này. */
export const DEPOSIT_METHODS: DepositMethodOption[] = [
  {
    key: "momo",
    name: "Ví MoMo",
    desc: "Thanh toán nhanh qua ví MoMo",
    icon: <DevicePhoneMobileOutlined />,
    iconClassName: "bg-pink-50 text-pink-600",
    paymentMethod: "wallet",
    recommended: true,
  },
  {
    key: "zalopay",
    name: "ZaloPay",
    desc: "Thanh toán nhanh qua ZaloPay",
    icon: <DevicePhoneMobileOutlined />,
    iconClassName: "bg-sky-50 text-sky-600",
    paymentMethod: "wallet",
  },
  {
    key: "card_domestic",
    name: "Thẻ ngân hàng",
    desc: "Visa, MasterCard, JCB, ATM",
    icon: <CreditCardOutlined />,
    iconClassName: "bg-emerald-50 text-emerald-600",
    paymentMethod: "card",
  },
  {
    key: "bank_transfer",
    name: "Chuyển khoản",
    desc: "Chuyển khoản qua ngân hàng",
    icon: <BuildingLibraryOutlined />,
    iconClassName: "bg-indigo-50 text-indigo-600",
    paymentMethod: "transfer",
  },
  {
    key: "card_international",
    name: "Thẻ quốc tế",
    desc: "Visa, MasterCard, JCB",
    icon: <GlobeAltOutlined />,
    iconClassName: "bg-amber-50 text-amber-600",
    paymentMethod: "card",
  },
];

/** ⚠️ KHÔNG có API khuyến mãi nạp ví → nạp bao nhiêu nhận đúng bấy nhiêu. Card hiển thị xám +
 * "Sắp có", `DepositSummary` KHÔNG cộng % vào "Số tiền nhận được". */
export const DEPOSIT_PROMOTIONS = [
  { id: "p2", threshold: 1_000_000, percent: 2 },
  { id: "p5", threshold: 5_000_000, percent: 5 },
];

/** ⚠️ BE không có bảng phí và không trừ phí → "Miễn phí" là sự thật, không phải mock. */
export const TRANSACTION_FEE = 0;
