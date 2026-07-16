import { Button, CheckOutlined } from "tera-dls";

import Badge from "_common/components/Badge";
import Card from "_common/components/Card";

import type { PackageOption } from "../_interface";
import { formatCurrency } from "../_utils";

interface UpgradeOptionCardProps {
  pkg: PackageOption;
  isCurrent?: boolean;
  onUpgrade: (pkg: PackageOption) => void;
}

const UpgradeOptionCard = ({ pkg, isCurrent, onUpgrade }: UpgradeOptionCardProps) => (
  <Card className="flex flex-col gap-3">
    <div className="flex items-start justify-between gap-2">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-slate-800">{pkg.name}</p>
          {pkg.badge && (
            <Badge className="bg-brand/10 px-2 py-0.5 text-[11px] text-brand">{pkg.badge}</Badge>
          )}
        </div>
        {pkg.description && <p className="mt-0.5 text-xs text-slate-400">{pkg.description}</p>}
      </div>
    </div>

    <div className="flex flex-col gap-1.5">
      {pkg.features.slice(0, 5).map((feature) => (
        <div key={feature} className="flex items-center gap-2 text-sm text-slate-600">
          <CheckOutlined className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
          {feature}
        </div>
      ))}
    </div>

    <div className="mt-auto flex items-center justify-between pt-2">
      <p className="text-lg font-bold text-slate-800">
        {formatCurrency(pkg.price)}
        <span className="text-xs font-normal text-slate-400">
          /{pkg.billingCycle === "year" ? "năm" : "tháng"}
        </span>
      </p>
      <Button
        disabled={isCurrent}
        onClick={() => onUpgrade(pkg)}
        outlined={!isCurrent}
        className={isCurrent ? undefined : "text-brand border-brand hover:bg-brand"}
      >
        {isCurrent ? "Đang sử dụng" : "Nâng cấp"}
      </Button>
    </div>
  </Card>
);

export default UpgradeOptionCard;
