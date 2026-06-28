import { UsersOutlined } from "tera-dls";

import { CARD } from "_common/constants/dashboard";
import WidgetState from "_common/components/WidgetState";

interface HomeroomCardProps {
  count: number;
  classNames: string[];
  loading?: boolean;
}

const HomeroomCard = ({ count, classNames, loading }: HomeroomCardProps) => {
  return (
    <div className={`${CARD} flex flex-col gap-3 p-4`}>
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-700 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-brand">
        <UsersOutlined />
        Lớp chủ nhiệm
      </p>
      <WidgetState isLoading={loading}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="leading-tight">
              <p className="text-3xl font-bold text-slate-800">{count}</p>
              <p className="text-xs text-slate-400">lớp</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-brand [&_svg]:h-7 [&_svg]:w-7">
              <UsersOutlined />
            </div>
          </div>
          {classNames.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {classNames.slice(0, 3).map((name) => (
                <span
                  key={name}
                  className="rounded-md bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600"
                >
                  {name}
                </span>
              ))}
            </div>
          )}
        </div>
      </WidgetState>
    </div>
  );
};

export default HomeroomCard;
