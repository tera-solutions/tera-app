/**
 * [056] Gói đăng ký (Subscription) — TYPES = HỢP ĐỒNG DỮ LIỆU.
 * ⚠️ UI-only: CHƯA wire API. Người làm API nối vào giữ shape này. Nguồn hiện tại = `_mock.ts`.
 */

export type PlanTier = "free" | "basic" | "advanced" | "premium";

export type PaymentStatus = "success" | "free" | "failed";

/** Một gói đăng ký (thẻ giá). */
export interface Plan {
  id: PlanTier;
  name: string;
  /** Mô tả ngắn dưới tên gói. */
  tagline: string;
  /** Giá hiển thị (đã format), vd "0" / "99.000". */
  priceLabel: string;
  /** Đơn vị sau giá, vd "vĩnh viễn" / "tháng". */
  priceUnit: string;
  /** Dòng giá năm (nếu có), vd "Hoặc 990.000đ / năm (Tiết kiệm 17%)". */
  yearlyNote?: string;
  /** Tiêu đề nhóm quyền lợi, vd "Tất cả tính năng của Miễn phí, và:" ("" = không có). */
  benefitTitle: string;
  benefits: string[];
  /** Gói phổ biến (viền + badge). */
  popular?: boolean;
  /** Gói đang dùng (nút "Đang sử dụng", disabled). */
  current?: boolean;
}

/** Gói hiện tại của giáo viên (sidebar). */
export interface CurrentPlan {
  tier: PlanTier;
  name: string;
  /** Ngày bắt đầu, hiển thị "DD/MM/YYYY". */
  startDate: string;
  benefits: string[];
}

/** Một dòng lịch sử thanh toán. */
export interface PaymentRecord {
  id: string | number;
  /** Tên gói + kỳ hạn, vd "Gói Cơ bản - 12 tháng". */
  planName: string;
  /** Ngày thanh toán "DD/MM/YYYY". */
  date: string;
  /** Số tiền (VND). */
  amount: number;
  status: PaymentStatus;
}

/** Phương thức thanh toán đã lưu. */
export interface PaymentMethod {
  brand: string; // "VISA"
  last4: string; // "4242"
}
