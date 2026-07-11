import { GiftOutlined } from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

import { DEPOSIT_PROMOTIONS } from "../constants";

/**
 * "Ưu đãi nạp tiền" — cố tình render **xám + nhãn "Sắp có"**.
 *
 * ⚠️ Backend không có API khuyến mãi nạp ví, cũng không cộng % nào khi ghi bút toán. Hiển thị
 * ưu đãi như thật sẽ là hứa hẹn sai về tiền. Khi có API → bỏ lớp xám + nối `DepositSummary`.
 */
const DepositPromotions = () => (
  <Card className="xmd:p-5">
    <div className="mb-4 flex items-center justify-between gap-2">
      <p className="text-base font-semibold text-slate-800">Ưu đãi nạp tiền</p>
      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500">
        Sắp có
      </span>
    </div>

    <div className="flex flex-col gap-2 opacity-60 grayscale">
      {DEPOSIT_PROMOTIONS.map((promo) => (
        <div
          key={promo.id}
          className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
          aria-disabled
        >
          <IconBox
            icon={<GiftOutlined />}
            sizeClassName="h-10 w-10"
            roundedClassName="rounded-xl"
            colorClassName="bg-white text-slate-400"
            iconSizeClassName="[&_svg]:h-5 [&_svg]:w-5"
          />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-sm font-semibold text-slate-600">
              Nạp từ {promo.threshold.toLocaleString("en-US")}đ
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              Nhận ngay {promo.percent}% giá trị nạp
            </p>
          </div>
          <span className="shrink-0 rounded-lg bg-white px-2 py-1 text-xs font-bold text-slate-400">
            +{promo.percent}%
          </span>
        </div>
      ))}
    </div>
  </Card>
);

export default DepositPromotions;
