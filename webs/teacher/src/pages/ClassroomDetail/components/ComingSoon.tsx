import { ReactNode } from "react";
import { WrenchScrewdriverOutlined } from "tera-dls";

interface ComingSoonProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

const ComingSoon = ({
  title = "Tính năng đang được phát triển",
  description = "Nội dung này sẽ sớm khả dụng.",
  icon,
}: ComingSoonProps) => (
  <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 [&_svg]:h-6 [&_svg]:w-6">
      {icon ?? <WrenchScrewdriverOutlined />}
    </div>
    <p className="text-sm font-medium text-slate-600">{title}</p>
    <p className="max-w-xs text-xs text-slate-400">{description}</p>
  </div>
);

export default ComingSoon;
