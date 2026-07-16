import { notification } from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

import type { CurrentPlan } from "../_interface";
import BenefitSection from "./BenefitSection";
import { PLAN_ICON, PLAN_ICON_COLOR } from "./planVisual";

interface PackageDetailProps {
  plan: CurrentPlan;
}

/** Thẻ "Gói hiện tại của bạn" (sidebar). */
const PackageDetail = ({ plan }: PackageDetailProps) => {
  const handleUpgrade = () =>
    notification.warning({
      message: "Giao diện demo — chức năng nâng cấp gói sẽ được kết nối API.",
    });

  return (
    <Card animated={false} className="xmd:p-5">
      <p className="mb-3 text-base font-semibold text-slate-800">
        Gói hiện tại của bạn
      </p>

      <div className="flex items-center justify-between gap-2 rounded-xl bg-sky-50/60 p-3">
        <div className="flex items-center gap-3">
          <IconBox
            icon={PLAN_ICON[plan.tier]}
            sizeClassName="h-11 w-11"
            roundedClassName="rounded-xl"
            colorClassName={`bg-white ${PLAN_ICON_COLOR[plan.tier].split(" ")[1]}`}
            iconSizeClassName="[&_svg]:h-6 [&_svg]:w-6"
          />
          <div>
            <p className="text-sm font-bold text-slate-800">{plan.name}</p>
            <p className="text-[11px] text-slate-400">
              Ngày bắt đầu: {plan.startDate}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600">
          Đang sử dụng
        </span>
      </div>

      <div className="mt-4">
        <BenefitSection items={plan.benefits} />
      </div>

      <button
        type="button"
        onClick={handleUpgrade}
        className="mt-4 w-full rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand/85"
      >
        Nâng cấp gói ngay
      </button>
    </Card>
  );
};

export default PackageDetail;
