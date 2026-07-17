import { ShieldCheckOutlined } from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

import PackageList from "./components/PackageList";
import PackageDetail from "./components/PackageDetail";
import PaymentHistory from "./components/PaymentHistory";
import PaymentMethod from "./components/PaymentMethod";
import SecurityCommitment from "./components/SecurityCommitment";
import {
  CURRENT_PLAN,
  PAYMENT_HISTORY,
  PAYMENT_METHOD,
  PLANS,
} from "./_mock";

/**
 * [056] Gói đăng ký (Subscription) — GIAO DIỆN theo design `picture's page/goi dang ky.png`.
 * ⚠️ UI-only: data từ `_mock.ts`, CHƯA wire API. Người làm API nối service (list gói / gói hiện tại /
 * lịch sử thanh toán), giữ shape ở `_interface.ts`.
 */
const Subscription = () => {
  return (
    <div className="p-4 xmd:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Gói đăng ký</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Trang chủ <span className="mx-1">›</span> Gói đăng ký
          </p>
        </div>
        <Card animated={false} className="flex items-center gap-3 sm:w-auto">
          <IconBox
            icon={<ShieldCheckOutlined />}
            sizeClassName="h-9 w-9"
            colorClassName="bg-sky-50 text-brand"
          />
          <div>
            <p className="text-xs text-slate-400">Cần hỗ trợ?</p>
            <p className="text-sm font-semibold text-brand">Liên hệ với chúng tôi</p>
          </div>
        </Card>
      </div>

      {/* Banner nâng cấp */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3">
        <span className="text-xl">👑</span>
        <p className="text-sm text-slate-600">
          Nâng cấp gói để trải nghiệm đầy đủ các tính năng nâng cao và hỗ trợ tốt hơn
          cho công việc giảng dạy của bạn.
        </p>
      </div>

      {/*
        Danh sách gói + sidebar. `xl:items-start` → card packages cao TỰ NHIÊN ôm sát các thẻ
        (thẻ vẫn linh hoạt 1/2/4 cột như khi chưa bọc), sidebar cạnh bên; KHÔNG ép stretch bằng chiều cao.
        Desktop bọc packages trong card trắng; mobile/tablet card trắng trong suốt (thẻ nằm trực tiếp trên nền).
      */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start [&>*]:min-w-0">
        <section className="xl:rounded-2xl xl:border xl:border-slate-100 xl:bg-white xl:p-5 xl:shadow-[0_2px_12px_rgba(15,23,42,0.05)]">
          <PackageList plans={PLANS} />
        </section>

        <div className="flex flex-col gap-4">
          <PackageDetail plan={CURRENT_PLAN} />
          <PaymentHistory records={PAYMENT_HISTORY} />
          <PaymentMethod method={PAYMENT_METHOD} />
        </div>
      </div>

      {/* Cam kết bảo mật (accordion) */}
      <SecurityCommitment />
    </div>
  );
};

export default Subscription;
