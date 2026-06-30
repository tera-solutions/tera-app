import { BellOutlined } from "tera-dls";

import type { DashboardNotificationItem } from "../_interface";
import { formatNotificationTime } from "../_utils";

const NotificationRow = ({ item }: { item: DashboardNotificationItem }) => (
  <div className="flex items-start gap-3 py-2.5">
    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-brand [&_svg]:h-4 [&_svg]:w-4">
      <BellOutlined />
    </span>
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-slate-800">
        {item.title}
      </p>
      <p className="text-xs text-slate-400">
        {formatNotificationTime(item.created_at)}
      </p>
    </div>
    {!item.is_read && (
      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-red-500" />
    )}
  </div>
);

export default NotificationRow;
