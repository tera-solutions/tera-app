import {
  HeartOutlined,
  LifebuoyOutlined,
  ShieldCheckOutlined,
} from "tera-dls";

const FOOTER_ITEMS = [
  {
    icon: <ShieldCheckOutlined />,
    title: "Bảo mật tuyệt đối",
    desc: "Thông tin của bạn luôn được bảo vệ",
  },
  {
    icon: <LifebuoyOutlined />,
    title: "Hỗ trợ giáo viên 24/7",
    desc: "Đội ngũ luôn sẵn sàng hỗ trợ bạn",
  },
  {
    icon: <HeartOutlined />,
    title: "Vì sự phát triển của học viên",
    desc: "Đồng hành cùng giáo viên mỗi ngày",
  },
];

const AuthFooter = () => (
  <footer className="relative z-10 hidden shrink-0 text-white xmd:block">
    <svg
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="authFooterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-brand)" />
          <stop offset="100%" stopColor="var(--color-brand-dark)" />
        </linearGradient>
      </defs>
      <path
        fill="url(#authFooterGrad)"
        d="M0,0 C480,64 960,64 1440,0 L1440,160 L0,160 Z"
      />
    </svg>

    <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-center gap-12 px-6 pb-5 pt-12 text-center sm:flex-row sm:gap-24 sm:pb-7 sm:pt-14">
      {FOOTER_ITEMS.map((item) => (
        <div key={item.title} className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 [&_svg]:h-5 [&_svg]:w-5">
            {item.icon}
          </span>
          <div className="text-left leading-tight">
            <p className="text-sm font-semibold">{item.title}</p>
            <p className="text-xs text-white/70">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </footer>
);

export default AuthFooter;
