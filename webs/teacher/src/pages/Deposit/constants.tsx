import type { ReactNode } from "react";
import {
  BuildingLibraryOutlined,
  CreditCardOutlined,
  DevicePhoneMobileOutlined,
  GlobeAltOutlined,
} from "tera-dls";

/**
 * 🚩 Bật luồng nạp tiền thật. Đang `false` vì role Teacher bị BE chặn quyền `POST fin/wallet/deposit`
 * (403). UI + mutation đã wire sẵn — BE mở quyền thì đổi thành `true`.
 * ⚠️ Đừng bật khi chưa có cổng thanh toán: `deposit` ghi thẳng bút toán, người dùng tự cộng tiền
 * cho mình. Chi tiết: `agents/claude/teacher/sprint4-wallet-checklist.md` §[051].
 */
export const DEPOSIT_ENABLED = false;

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
  /** Giá trị gửi lên `payment_method` của `POST fin/wallet/deposit`. */
  paymentMethod: string;
  recommended?: boolean;
}

/**
 * ⚠️ `payment_method` của BE chỉ có `cash|transfer|card|wallet|other` → MoMo và ZaloPay cùng ghi
 * thành `wallet`, 2 loại thẻ cùng ghi thành `card`; sổ cái không phân biệt được nhà cung cấp.
 * BE cũng **không validate** field này (chuỗi rác vẫn ghi thành công).
 * Workaround: nhét tên nhà cung cấp vào `note` (`buildDepositNote`) rồi đọc ngược từ `description`
 * (`_utils.methodFromDescription`). **TODO(BE)**: xin field `payment_provider`.
 */
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

/**
 * ⚠️ Lọc phía CLIENT, không gửi lên BE: `fin/wallet/transactions` bỏ qua param `status`, và giao
 * dịch **không có field `status`** (sổ cái bất biến, `toTransaction` gán cứng `completed`).
 * Nên chọn "Đang xử lý"/"Thất bại" → rỗng. Đó là sự thật, không phải bug.
 * Khi BE có trạng thái giao dịch thật → chuyển sang gửi param lên server.
 */
export const STATUS_FILTER_OPTIONS = [
  { value: "completed", label: "Thành công" },
  { value: "pending", label: "Đang xử lý" },
  { value: "failed", label: "Thất bại" },
];

/** ⚠️ KHÔNG có API khuyến mãi nạp ví → nạp bao nhiêu nhận đúng bấy nhiêu. Card hiển thị xám +
 * "Sắp có", `DepositSummary` KHÔNG cộng % vào "Số tiền nhận được". */
export const DEPOSIT_PROMOTIONS = [
  { id: "p2", threshold: 1_000_000, percent: 2 },
  { id: "p5", threshold: 5_000_000, percent: 5 },
];

/** ⚠️ BE không có bảng phí và không trừ phí → "Miễn phí" là sự thật, không phải mock. */
export const TRANSACTION_FEE = 0;
