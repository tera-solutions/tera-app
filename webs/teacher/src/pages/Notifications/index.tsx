import { useMemo, useState } from "react";
import { CheckOutlined, Button } from "tera-dls";

import { useUrlFilters } from "_common/hooks/useUrlFilters";

import type { NotificationCategory, NotificationItem, NotificationStatus } from "./_interface";
import { MOCK_NOTIFICATIONS } from "./_mock";
import { countByCategory, countByStatus, filterNotifications } from "./_utils";
import NotificationFilterPanel from "./components/NotificationFilterPanel";
import NotificationList from "./components/NotificationList";
import NotificationDetailPanel from "./components/NotificationDetailPanel";

const PAGE_SIZE = 20;

const Notifications = () => {
  const [filters, setFilters] = useUrlFilters({
    category: { type: "string", default: "all" as NotificationCategory | "all" },
    status: { type: "string", default: "all" as NotificationStatus },
    date_from: { type: "string", default: "" },
    date_to: { type: "string", default: "" },
  });

  const [items, setItems] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_read: true } : i)),
      );
    }
  };

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, is_read: true })));
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

        <NotificationDetailPanel item={selected} />
      </div>
    </div>
  );
};

export default Notifications;
