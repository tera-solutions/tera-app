import { ShieldCheckOutlined } from "tera-dls";

import Card from "_common/components/Card";

/** "Lưu ý quan trọng" — thời gian xử lý yêu cầu rút tiền. Nền xanh nhạt để tách khỏi các card trắng. */
const WithdrawNotice = () => (
    /* `!` bắt buộc: `Card` ghép class bằng `classNames` (không twMerge) nên `bg-white`/`border-slate-100`
       của hằng `CARD` vẫn còn, và chúng thắng theo thứ tự trong stylesheet chứ không theo thứ tự class. */
  <Card className="border-sky-200! bg-sky-100/60! xmd:p-5" animated={false}>
    <div className="flex gap-3">
      <ShieldCheckOutlined className="h-5 w-5 shrink-0 text-brand" />
      <div className="leading-tight">
        {/* `uppercase` (CSS) chứ không viết hoa sẵn trong chuỗi — giữ nguyên văn bản để dịch/đọc. */}
        <p className="text-sm font-semibold uppercase text-slate-700">Lưu ý quan trọng</p>
        <p className="mt-1 text-xs text-slate-500">
          Tiền sẽ được chuyển về tài khoản ngân hàng của bạn trong vòng 1 - 24 giờ làm việc
          (không tính thứ 7, chủ nhật và ngày lễ).
        </p>
      </div>
    </div>
  </Card>
);

export default WithdrawNotice;
