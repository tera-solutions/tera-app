import type { DashboardHomeworkItem } from "../_interface";

const HomeworkRow = ({ item }: { item: DashboardHomeworkItem }) => (
  <div className="flex items-center justify-between py-2.5">
    <div className="min-w-0">
      <p className="truncate text-sm font-medium text-slate-800">
        {item.title}
      </p>
      <p className="truncate text-xs text-slate-400">{item.class_name}</p>
    </div>
    <span className="ml-2 flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 px-2 text-xs font-semibold text-orange-600">
      {item.pending_count}
    </span>
  </div>
);

export default HomeworkRow;
