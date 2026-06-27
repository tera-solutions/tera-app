import { useNavigate } from "react-router-dom";
import { BellOutlined } from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";

import DashboardCard from "../components/DashboardCard";
import NotificationRow from "../components/NotificationRow";
import WidgetState from "../components/WidgetState";
import { useDashboardNotifications } from "../hooks";

const NotificationWidget = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useDashboardNotifications();
  const notifications = data?.data ?? [];
  const unreadCount = data?.unread_count ?? 0;

  return (
    <DashboardCard
      title="Thông báo mới"
      icon={<BellOutlined />}
      actionLabel="Xem tất cả"
      onAction={() => navigate(PATHS.notifications)}
    >
      <WidgetState
        isLoading={isLoading}
        isError={isError}
        isEmpty={notifications.length === 0}
        emptyText="Không có thông báo mới"
        onRetry={refetch}
      >
        {unreadCount > 0 && (
          <p className="mb-1 text-xs font-medium text-red-500">
            {unreadCount} thông báo chưa đọc
          </p>
        )}
        <div className="divide-y divide-slate-100">
          {notifications.map((item) => (
            <NotificationRow key={item.id} item={item} />
          ))}
        </div>
      </WidgetState>
    </DashboardCard>
  );
};

export default NotificationWidget;
