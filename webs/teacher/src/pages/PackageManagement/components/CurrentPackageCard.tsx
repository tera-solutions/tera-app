import { Button, CheckCircleOutlined, TrophyOutlined } from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";
import WidgetState from "_common/components/WidgetState";

import type { CurrentSubscription } from "../_interface";
import { daysRemaining, formatCurrency } from "../_utils";

interface CurrentPackageCardProps {
  subscription: CurrentSubscription | null;
  loading?: boolean;
  onUpgrade: () => void;
}

const CurrentPackageCard = ({ subscription, loading, onUpgrade }: CurrentPackageCardProps) => {
  const remaining = daysRemaining(subscription?.expiresAt ?? null);

  return (
    <Card className="bg-gradient-to-br from-sky-500 to-brand text-white" animated={false}>
      <WidgetState isLoading={loading}>
        {subscription ? (
          <>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-white/80">Gói hiện tại của bạn</p>
                <p className="mt-1 text-lg font-bold">{subscription.packageName}</p>
                <p className="mt-1 text-xs text-white/80">
                  Hiệu lực đến: {subscription.expiresAt ?? "—"}
                  {remaining != null && ` (còn ${remaining} ngày)`}
                </p>
                <p className="mt-0.5 text-xs text-white/80">
                  Chu kỳ thanh toán: 1 {subscription.billingCycle === "year" ? "năm" : "tháng"} /{" "}
                  {formatCurrency(subscription.price)}
                </p>
              </div>
              <IconBox
                icon={<TrophyOutlined />}
                sizeClassName="h-12 w-12"
                roundedClassName="rounded-2xl"
                colorClassName="bg-white/20"
                iconSizeClassName="[&_svg]:h-6 [&_svg]:w-6"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={onUpgrade} className="bg-white! text-brand hover:bg-white/90!">
                Nâng cấp gói
              </Button>
              <Button outlined className="border-white! text-white! hover:bg-white/10!">
                Quản lý gói
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm font-medium">Bạn chưa đăng ký gói dịch vụ nào</p>
            <Button onClick={onUpgrade} className="bg-white! text-brand hover:bg-white/90!">
              Chọn gói ngay
            </Button>
          </div>
        )}
      </WidgetState>

      {subscription && subscription.features.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 border-t border-white/20 pt-4 sm:grid-cols-2">
          {subscription.features.map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm">
              <CheckCircleOutlined className="h-4 w-4 shrink-0 text-white/90" />
              <span className="text-white/90">{feature}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default CurrentPackageCard;
