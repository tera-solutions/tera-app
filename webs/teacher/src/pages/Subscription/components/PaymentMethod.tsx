import { notification } from "tera-dls";

import Card from "_common/components/Card";

import type { PaymentMethod as PaymentMethodType } from "../_interface";

interface PaymentMethodProps {
  method: PaymentMethodType;
}

/** Thẻ "Phương thức thanh toán" (sidebar). */
const PaymentMethod = ({ method }: PaymentMethodProps) => (
  <Card animated={false} className="xmd:p-5">
    <p className="mb-3 text-base font-semibold text-slate-800">
      Phương thức thanh toán
    </p>

    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-12 items-center justify-center rounded-md bg-slate-100 text-[11px] font-bold text-slate-500">
          {method.brand}
        </span>
        <span className="text-sm font-medium text-slate-700">
          •••• {method.last4}
        </span>
      </div>
      <button
        type="button"
        onClick={() =>
          notification.warning({
            message: "Giao diện demo — chức năng đổi thẻ sẽ được kết nối API.",
          })
        }
        className="text-xs font-medium text-brand transition-colors hover:underline"
      >
        Thay đổi
      </button>
    </div>
  </Card>
);

export default PaymentMethod;
