import { BellOutlined } from "tera-dls";

import IconBox from "_common/components/IconBox";

import type { DashboardNotificationItem } from "../_interface";
import { formatNotificationTime } from "../_utils";

const NotificationRow = ({ item }: { item: DashboardNotificationItem }) => (
  <div className="flex items-start gap-3 py-2.5">
    <IconBox
      icon={<BellOutlined />}
      sizeClassName="h-8 w-8"
      roundedClassName="rounded-lg"
      iconSizeClassName="[&_svg]:h-4 [&_svg]:w-4"
      className="mt-1"
    />
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
