import type {
  CurrentPlan,
  PaymentMethod,
  PaymentRecord,
  Plan,
} from "./_interface";

/**
 * ⚠️ DATA GIẢ để dựng UI — KHÔNG phải data thật. Khi wire API thì thay bằng service hook,
 * giữ nguyên shape ở `_interface.ts`.
 */

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Miễn phí",
    tagline: "Dành cho giáo viên mới bắt đầu",
    priceLabel: "0",
    priceUnit: "vĩnh viễn",
    benefitTitle: "",
    current: true,
    benefits: [
      "Tạo và quản lý tối đa 2 lớp học",
      "Tối đa 50 học viên",
      "Lịch dạy cơ bản",
      "Giao và chấm bài tập",
      "Điểm danh",
      "Báo cáo cơ bản",
      "Hỗ trợ qua email",
    ],
  },
  {
    id: "basic",
    name: "Cơ bản",
    tagline: "Phù hợp cho giáo viên cá nhân",
    priceLabel: "99.000",
    priceUnit: "tháng",
    yearlyNote: "Hoặc 990.000đ / năm (Tiết kiệm 17%)",
    popular: true,
    benefitTitle: "Tất cả tính năng của Miễn phí, và:",
    benefits: [
      "Tạo và quản lý tối đa 10 lớp học",
      "Tối đa 300 học viên",
      "Kho giáo án mẫu phong phú",
      "Báo cáo nâng cao",
      "Nhận xét và phản hồi học viên",
      "Hỗ trợ ưu tiên qua email và chat",
    ],
  },
  {
    id: "advanced",
    name: "Nâng cao",
    tagline: "Dành cho giáo viên chuyên nghiệp",
    priceLabel: "199.000",
    priceUnit: "tháng",
    yearlyNote: "Hoặc 1.990.000đ / năm (Tiết kiệm 17%)",
    benefitTitle: "Tất cả tính năng của Cơ bản, và:",
    benefits: [
      "Không giới hạn số lớp học",
      "Không giới hạn số học viên",
      "Ngân hàng đề thi & bài tập",
      "Phân tích học tập chuyên sâu",
      "Xuất báo cáo tùy chỉnh",
      "Hỗ trợ ưu tiên cao nhất",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Giải pháp toàn diện cho giáo viên",
    priceLabel: "299.000",
    priceUnit: "tháng",
    yearlyNote: "Hoặc 2.990.000đ / năm (Tiết kiệm 17%)",
    benefitTitle: "Tất cả tính năng của Nâng cao, và:",
    benefits: [
      "Tích hợp AI hỗ trợ giảng dạy",
      "Tạo nội dung tự động",
      "Livestream lớp học",
      "Lưu trữ đám mây không giới hạn",
      "Hỗ trợ 1:1 với chuyên gia",
      "Cập nhật tính năng mới sớm nhất",
    ],
  },
];

export const CURRENT_PLAN: CurrentPlan = {
  tier: "free",
  name: "Miễn phí",
  startDate: "15/05/2025",
  benefits: [
    "Tạo và quản lý tối đa 2 lớp học",
    "Tối đa 50 học viên",
    "Các tính năng cơ bản",
  ],
};

export const PAYMENT_HISTORY: PaymentRecord[] = [
  {
    id: 1,
    planName: "Gói Cơ bản - 12 tháng",
    date: "15/05/2024",
    amount: 990000,
    status: "success",
  },
  {
    id: 2,
    planName: "Gói Miễn phí",
    date: "15/05/2024",
    amount: 0,
    status: "free",
  },
  {
    id: 3,
    planName: "Gói Cơ bản - 1 tháng",
    date: "15/04/2024",
    amount: 99000,
    status: "success",
  },
  {
    id: 4,
    planName: "Gói Cơ bản - 1 tháng",
    date: "15/03/2024",
    amount: 99000,
    status: "success",
  },
];

export const PAYMENT_METHOD: PaymentMethod = { brand: "VISA", last4: "4242" };
