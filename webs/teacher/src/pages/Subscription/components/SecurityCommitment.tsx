import { useState } from "react";
import { CheckOutlined, ShieldCheckOutlined } from "tera-dls";

import AnimatedHeight from "_common/components/AnimatedHeight";

/** Nội dung bảo mật hiển thị khi mở rộng (hardcode). */
const SECURITY_POINTS = [
  "Thông tin thẻ được mã hóa theo chuẩn SSL/TLS 256-bit.",
  "Tuân thủ tiêu chuẩn bảo mật thanh toán quốc tế PCI DSS.",
  "Hana Edu không lưu trữ số thẻ đầy đủ trên hệ thống.",
  "Mọi giao dịch được xử lý qua cổng thanh toán được cấp phép.",
  "Bạn có thể hủy gói bất kỳ lúc nào, không ràng buộc hợp đồng.",
];

/** Card "Cam kết bảo mật" — nhấn "Tìm hiểu thêm" để mở rộng hiển thị chi tiết (accordion). */
const SecurityCommitment = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 text-emerald-500">
            <ShieldCheckOutlined className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Cam kết bảo mật & an toàn
            </p>
            <p className="text-xs text-slate-400">
              Thông tin thanh toán của bạn được mã hóa và bảo vệ tuyệt đối. Bạn có
              thể hủy gói bất kỳ lúc nào.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex shrink-0 items-center gap-1 self-start text-xs font-medium text-brand transition-colors hover:underline sm:self-auto"
        >
          Tìm hiểu thêm về bảo mật
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path
              d="m6 9 6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Nội dung mở rộng — AnimatedHeight tự animate chiều cao khi đóng/mở.
          ⚠️ KHÔNG dùng margin (mt-*) trên child trực tiếp: margin collapse ra ngoài khiến
          `contentRect.height` đo thiếu → dòng cuối bị cắt. Dùng padding (pt-*) để đo đúng. */}
      <AnimatedHeight>
        {open && (
          <div className="pt-3">
            <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
              {SECURITY_POINTS.map((p, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <CheckOutlined className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </AnimatedHeight>
    </div>
  );
};

export default SecurityCommitment;
