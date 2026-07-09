import { ArrowRightOnRectangleOutlined, EnvelopeOutlined, LockClosedOutlined, ShieldCheckOutlined } from "tera-dls";

import Card from "_common/components/Card";
import { todo } from "_common/utils/todo";

interface AccountSidebarProps {
  onChangePassword: () => void;
  onLogout: () => void;
}

const AccountSidebar = ({ onChangePassword, onLogout }: AccountSidebarProps) => (
  <Card>
    <p className="mb-3 text-sm font-semibold text-slate-700">Quản lý tài khoản</p>
    <div className="flex flex-col divide-y divide-slate-100">
      <button
        type="button"
        onClick={onChangePassword}
        className="flex items-center gap-2.5 py-2.5 text-left text-sm text-slate-600 hover:text-brand [&_svg]:h-4 [&_svg]:w-4"
      >
        <LockClosedOutlined />
        Đổi mật khẩu
      </button>
      <button
        type="button"
        onClick={todo}
        className="flex items-center gap-2.5 py-2.5 text-left text-sm text-slate-600 hover:text-brand [&_svg]:h-4 [&_svg]:w-4"
      >
        <EnvelopeOutlined />
        Cập nhật email
      </button>
      <button
        type="button"
        onClick={todo}
        className="flex items-center gap-2.5 py-2.5 text-left text-sm text-slate-600 hover:text-brand [&_svg]:h-4 [&_svg]:w-4"
      >
        <ShieldCheckOutlined />
        Xác thực 2 lớp (2FA)
      </button>
      <button
        type="button"
        onClick={onLogout}
        className="flex items-center gap-2.5 py-2.5 text-left text-sm text-red-500 hover:text-red-600 [&_svg]:h-4 [&_svg]:w-4"
      >
        <ArrowRightOnRectangleOutlined />
        Đăng xuất
      </button>
    </div>
  </Card>
);

export default AccountSidebar;
