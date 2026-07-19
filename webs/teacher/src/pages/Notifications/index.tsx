import { useMemo, useState } from "react";
import { CheckOutlined, Button, Spin } from "tera-dls";
import { NotificationService } from "@tera/modules";

import { useUrlFilters } from "_common/hooks/useUrlFilters";

import type { NotificationCategory, NotificationItem, NotificationStatus } from "./_interface";
import { countByCategory, countByStatus, filterNotifications, toNotificationItem } from "./_utils";
import NotificationFilterPanel from "./components/NotificationFilterPanel";
import NotificationList from "./components/NotificationList";
import NotificationDetailPanel from "./components/NotificationDetailPanel";

const PAGE_SIZE = 20;
/** No server pagination on this screen — filter/counts need the full set, so
 * fetch a generously large page once and window it client-side (existing UI
 * pattern via `visibleCount`). A single teacher's notification feed is small. */
const FETCH_SIZE = 200;

const Notifications = () => {
  const [filters, setFilters] = useUrlFilters({
    category: { type: "string", default: "all" as NotificationCategory | "all" },
    status: { type: "string", default: "all" as NotificationStatus },
    date_from: { type: "string", default: "" },
    date_to: { type: "string", default: "" },
  }, { syncDefaultsOnMount: true });

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [optimisticReadIds, setOptimisticReadIds] = useState<Set<number>>(new Set());

  const listQuery = NotificationService.useNotificationList({ params: { per_page: FETCH_SIZE } });
  const { mutate: markRead } = NotificationService.useNotificationRead();
  const { mutate: deleteNotification } = NotificationService.useNotificationDelete();

  const items = useMemo<NotificationItem[]>(() => {
    const raw = listQuery.data?.data?.items ?? [];
    return raw.map(toNotificationItem).map((item) =>
      optimisticReadIds.has(item.id) ? { ...item, is_read: true } : item,
    );
  }, [listQuery.data, optimisticReadIds]);

  const filtered = useMemo(() => filterNotifications(items, filters), [items, filters]);
  const categoryCounts = useMemo(() => countByCategory(items), [items]);
  const statusCounts = useMemo(() => countByStatus(items), [items]);
  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  const handleSelect = (item: NotificationItem) => {
    setSelectedId(item.id);
    if (!item.is_read) {
      setOptimisticReadIds((prev) => new Set(prev).add(item.id));
      markRead({ id: item.id });
    }
  };

  const handleMarkAllRead = () => {
    const unreadIds = items.filter((item) => !item.is_read).map((item) => item.id);
    setOptimisticReadIds((prev) => new Set([...prev, ...unreadIds]));
    unreadIds.forEach((id) => markRead({ id }));
  };

  const handleDelete = (item: NotificationItem) => {
    deleteNotification({ id: item.id });
    if (selectedId === item.id) setSelectedId(null);
  };

  const handleResetFilters = () =>
    setFilters({ category: "all", status: "all", date_from: "", date_to: "" });

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Thông báo</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý các thông báo và cập nhật mới nhất
          </p>
        </div>
        <Button
          icon={<CheckOutlined />}
          onClick={handleMarkAllRead}
          disabled={statusCounts.unread === 0}
          className="whitespace-nowrap bg-brand hover:bg-brand/80"
        >
          Đánh dấu tất cả đã đọc
        </Button>
      </div>

      <Spin spinning={listQuery.isLoading}>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_2fr_2fr]">
          <NotificationFilterPanel
            filters={filters}
            onChange={(patch) => setFilters(patch)}
            categoryCounts={categoryCounts}
            statusCounts={statusCounts}
            onReset={handleResetFilters}
          />

          <NotificationList
            items={filtered}
            visibleCount={visibleCount}
            selectedId={selectedId}
            onSelect={handleSelect}
            onLoadMore={() => setVisibleCount((c) => c + PAGE_SIZE)}
          />

          <NotificationDetailPanel item={selected} onDelete={handleDelete} />
        </div>
      </Spin>
    </div>
  );
};

export default Notifications;
