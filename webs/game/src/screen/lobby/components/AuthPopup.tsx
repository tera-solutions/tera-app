import { useState } from "react";
import { X } from "lucide-react";

export default function AuthPopup() {
  const [tab, setTab] = useState<"login" | "register">(
    "login"
  );

  const [open, setOpen] = useState(true);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-cyan-400/20 bg-[#08111f] shadow-2xl shadow-cyan-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.18),transparent_60%)]" />

        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <X size={18} />
        </button>

        <div className="relative z-10 p-8">
          <div className="mb-8 text-center">
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.4em] text-cyan-400">
              Tera Game
            </div>

            <h1 className="text-4xl font-black text-white">
              {tab === "login"
                ? "WELCOME BACK"
                : "CREATE ACCOUNT"}
            </h1>
          </div>

          <div className="mb-8 grid grid-cols-2 rounded-2xl bg-white/5 p-1">
            <button
              onClick={() => setTab("login")}
              className={`rounded-2xl py-3 text-sm font-bold transition ${
                tab === "login"
                  ? "bg-cyan-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Đăng nhập
            </button>

            <button
              onClick={() => setTab("register")}
              className={`rounded-2xl py-3 text-sm font-bold transition ${
                tab === "register"
                  ? "bg-cyan-500 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Đăng ký
            </button>
          </div>

          <div className="space-y-4">
            {tab === "register" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Họ và tên
                </label>

                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-white outline-none transition focus:border-cyan-400"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Tài khoản
              </label>

              <input
                type="text"
                placeholder="Nhập tài khoản"
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Mật khẩu
              </label>

              <input
                type="password"
                placeholder="Nhập mật khẩu"
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            {tab === "register" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Mã giới thiệu
                </label>

                <input
                  type="text"
                  placeholder="Nhập mã giới thiệu"
                  className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-5 text-white outline-none transition focus:border-cyan-400"
                />
              </div>
            )}

            <button className="mt-3 h-14 w-full rounded-2xl bg-cyan-500 text-lg font-black text-black transition hover:bg-cyan-400">
              {tab === "login"
                ? "ĐĂNG NHẬP"
                : "ĐĂNG KÝ"}
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            {tab === "login"
              ? "Chưa có tài khoản?"
              : "Đã có tài khoản?"}

            <button
              onClick={() =>
                setTab(
                  tab === "login"
                    ? "register"
                    : "login"
                )
              }
              className="ml-2 font-bold text-cyan-400 hover:text-cyan-300"
            >
              {tab === "login"
                ? "Đăng ký ngay"
                : "Đăng nhập"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
