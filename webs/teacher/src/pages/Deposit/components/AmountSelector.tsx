import classNames from "classnames";
import { CheckCircleSolid, Input } from "tera-dls";

import Card from "_common/components/Card";

import { AMOUNT_PRESETS, MAX_AMOUNT, MIN_AMOUNT } from "../constants";
import { formatAmountInput, parseAmountInput, validateAmount } from "../_utils";

interface AmountSelectorProps {
  amount: number | null;
  onChange: (amount: number | null) => void;
}

/** "Chọn số tiền nạp" — 6 mức chọn nhanh + ô nhập tự do (có ngăn cách hàng nghìn). */
const AmountSelector = ({ amount, onChange }: AmountSelectorProps) => {
  const error = validateAmount(amount);

  return (
    <Card className="xmd:p-5">
      <p className="mb-4 text-base font-semibold text-slate-800">Chọn số tiền nạp</p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {AMOUNT_PRESETS.map((preset) => {
          const active = amount === preset;
          return (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={classNames(
                "relative rounded-xl border py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-brand bg-sky-50/60 text-brand"
                  : "border-slate-200 text-slate-600 hover:border-brand/40 hover:bg-sky-50/40",
              )}
            >
              {preset.toLocaleString("en-US")}đ
              {active && (
                <CheckCircleSolid className="absolute -right-1.5 -top-1.5 h-5 w-5 text-brand" />
              )}
            </button>
          );
        })}
      </div>

      <Input
        type="text"
        inputMode="numeric"
        value={formatAmountInput(amount)}
        onChange={(e) => onChange(parseAmountInput(e.target.value))}
        placeholder="Nhập số tiền khác"
        aria-label="Số tiền nạp"
        suffix={<span className="text-sm font-medium text-slate-400">đ</span>}
        className={classNames(
          "mt-3 rounded-xl",
          error && "border-rose-300!",
        )}
      />

      {error ? (
        <p className="mt-2 text-xs font-medium text-rose-500">{error}</p>
      ) : (
        <p className="mt-2 text-xs text-slate-400">
          Số tiền tối thiểu: {MIN_AMOUNT.toLocaleString("en-US")}đ - Tối đa:{" "}
          {MAX_AMOUNT.toLocaleString("en-US")}đ
        </p>
      )}
    </Card>
  );
};

export default AmountSelector;
