import { notification } from "tera-dls";

import IconBox from "_common/components/IconBox";

import type { Plan } from "../_interface";
import BenefitSection from "./BenefitSection";
import { PLAN_ICON, PLAN_ICON_COLOR } from "./planVisual";

interface PackageCardProps {
  plan: Plan;
  /** Card đang được chọn (nhấn vào) → hiện viền xanh. */
  selected: boolean;
  onSelect: () => void;
}

/** Một thẻ gói đăng ký trong `PackageList`. */
const PackageCard = ({ plan, selected, onSelect }: PackageCardProps) => {
  const handleUpgrade = () => {
    // ⚠️ UI-only: chưa gọi API. Wire tại đây (SubscriptionService.useUpgrade(plan.id)).
    notification.warning({
      message: "Giao diện demo — chức năng nâng cấp gói sẽ được kết nối API.",
    });
  };

  // Xem chi tiết: không chọn gói (stopPropagation) — chỉ là thao tác xem thông tin.
  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    notification.warning({
      message: "Giao diện demo — chi tiết tính năng sẽ được cập nhật.",
    });
  };

  return (
    <div
      onClick={onSelect}
      className={`relative flex cursor-pointer flex-col rounded-2xl border bg-white p-5 transition-[border-color,box-shadow] ${
        // Viền xanh CHỈ khi card được chọn (nhấn vào); mặc định viền xám.
        selected
          ? "border-brand shadow-[0_10px_30px_rgba(37,99,235,0.18)]"
          : // Hover: ánh xanh (brand) + viền xanh nhạt để phản hồi, khác viền xanh đậm khi chọn.
            "border-slate-200 shadow-[0_6px_22px_rgba(15,23,42,0.10)] hover:border-brand/40 hover:shadow-[0_10px_28px_rgba(37,99,235,0.18)]"
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-white">
          Phổ biến nhất
        </span>
      )}

      {/* Icon + tên + mô tả */}
      <div className="flex flex-col items-center text-center">
        <IconBox
          icon={PLAN_ICON[plan.id]}
          sizeClassName="h-14 w-14"
          roundedClassName="rounded-2xl"
          colorClassName={PLAN_ICON_COLOR[plan.id]}
          iconSizeClassName="[&_svg]:h-7 [&_svg]:w-7"
        />
        <p className="mt-3 text-lg font-bold text-slate-800">{plan.name}</p>
        <p className="mt-1 text-xs text-slate-400">{plan.tagline}</p>
      </div>

      {/* Giá */}
      <div className="mt-4 text-center">
        <p className="text-slate-800">
          <span className="text-3xl font-extrabold">{plan.priceLabel}</span>
          <span className="align-top text-base font-bold">đ</span>{" "}
          <span className="text-sm font-normal text-slate-400">
            / {plan.priceUnit}
          </span>
        </p>
        {plan.yearlyNote && (
          <p className="mt-1 text-xs text-slate-400">{plan.yearlyNote}</p>
        )}
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={plan.current ? undefined : handleUpgrade}
        disabled={plan.current}
        className={`mt-4 w-full rounded-lg border py-2.5 text-sm font-semibold transition-colors ${
          plan.current
            ? "cursor-default border-slate-200 text-slate-400"
            : // Mọi nút nâng cấp: outline mặc định, chỉ filled xanh khi hover.
              "border-brand text-brand hover:bg-brand hover:text-white"
        }`}
      >
        {plan.current ? "Đang sử dụng" : "Nâng cấp ngay"}
      </button>

      {/* Quyền lợi */}
      <div className="mt-5 border-t border-slate-100 pt-5">
        <BenefitSection title={plan.benefitTitle || undefined} items={plan.benefits} />
      </div>

      {/* Xem chi tiết */}
      <button
        type="button"
        onClick={handleViewDetails}
        className="mt-5 flex items-center justify-center gap-1 text-xs font-medium text-brand transition-colors hover:underline"
      >
        Xem chi tiết tính năng
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
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
  );
};

export default PackageCard;
