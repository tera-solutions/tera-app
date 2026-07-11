import classNames from "classnames";
import { CheckCircleSolid, HandThumbUpOutlined } from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

import { DEPOSIT_METHODS } from "../constants";

interface PaymentMethodPickerProps {
  value: string;
  onChange: (methodKey: string) => void;
}

/** "Chọn phương thức thanh toán" — 5 hình thức, chọn 1. */
const PaymentMethodPicker = ({ value, onChange }: PaymentMethodPickerProps) => (
  <Card className="xmd:p-5">
    <p className="mb-4 text-base font-semibold text-slate-800">
      Chọn phương thức thanh toán
    </p>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {DEPOSIT_METHODS.map((method) => {
        const active = value === method.key;
        return (
          <button
            key={method.key}
            type="button"
            onClick={() => onChange(method.key)}
            aria-pressed={active}
            className={classNames(
              "relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-colors",
              active
                ? "border-brand bg-sky-50/50"
                : "border-slate-200 hover:border-brand/40 hover:bg-sky-50/30",
            )}
          >
            {active && (
              <CheckCircleSolid className="absolute right-2 top-2 h-5 w-5 text-brand" />
            )}

            <IconBox
              icon={method.icon}
              sizeClassName="h-10 w-10"
              roundedClassName="rounded-xl"
              colorClassName={method.iconClassName}
              iconSizeClassName="[&_svg]:h-5 [&_svg]:w-5"
            />

            <span className="min-w-0 leading-tight">
              <span className="block text-sm font-semibold text-slate-700">
                {method.name}
              </span>
              <span className="mt-0.5 block text-xs text-slate-400">{method.desc}</span>
            </span>

            {method.recommended && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-brand">
                <HandThumbUpOutlined className="h-3.5 w-3.5" />
                Khuyến nghị
              </span>
            )}
          </button>
        );
      })}
    </div>
  </Card>
);

export default PaymentMethodPicker;
