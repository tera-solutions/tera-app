import { useState } from "react";

import type { Plan, PlanTier } from "../_interface";
import PackageCard from "./PackageCard";

interface PackageListProps {
  plans: Plan[];
}

/** Tiêu đề + lưới các gói. Vỏ card trắng (desktop) do `index.tsx` bọc để canh chiều cao. */
const PackageList = ({ plans }: PackageListProps) => {
  // Gói đang được chọn (nhấn vào 1 card) → card đó hiện viền xanh. Mặc định chưa chọn gói nào.
  const [selected, setSelected] = useState<PlanTier | null>(null);

  return (
    <>
      <h2 className="mb-4 text-base font-semibold text-slate-800">
        Chọn gói phù hợp với nhu cầu của bạn
      </h2>
      {/* pt-3 chừa chỗ badge "Phổ biến nhất"; thẻ linh hoạt: 1 cột → 2 cột (sm) → 4 cột (2xl). */}
      <div className="grid grid-cols-1 gap-4 pt-3 sm:grid-cols-2 2xl:grid-cols-4">
        {plans.map((plan) => (
          <PackageCard
            key={plan.id}
            plan={plan}
            selected={selected === plan.id}
            onSelect={() => setSelected(plan.id)}
          />
        ))}
      </div>
    </>
  );
};

export default PackageList;
