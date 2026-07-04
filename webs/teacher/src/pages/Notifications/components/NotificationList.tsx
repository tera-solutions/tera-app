import classNames from "classnames";

import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";
import IconBox from "_common/components/IconBox";

import type { NotificationItem } from "../_interface";
import { CATEGORY_META, formatRelativeTime } from "../_utils";

interface NotificationListProps {
  items: NotificationItem[];
  visibleCount: number;
  selectedId: number | null;
  onSelect: (item: NotificationItem) => void;
  onLoadMore: () => void;
}

const NotificationList = ({
  items,
  visibleCount,
  selectedId,
  onSelect,
  onLoadMore,
}: NotificationListProps) => {
  const visible = items.slice(0, visibleCount);

  return (
    <Card className="flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Tất cả thông báo</p>
        <span className="text-xs text-slate-400">Sắp xếp: Mới nhất</span>
      </div>

      {items.length === 0 ? (
        <EmptyState description="Không có thông báo" />
      ) : (
        <>
          <div className="flex flex-col divide-y divide-slate-100">
            {visible.map((item) => {
              const meta = CATEGORY_META[item.category];
              const Icon = meta.icon;
              const selected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelect(item)}
                  className={classNames(
                    "flex items-start gap-3 px-1 py-3 text-left transition-colors hover:bg-slate-50",
                    selected && "bg-sky-50/60",
                  )}
                >
                  <IconBox
                    icon={<Icon />}
                    sizeClassName="h-9 w-9"
                    roundedClassName="rounded-lg"
                    colorClassName={meta.badge}
                    iconSizeClassName="[&_svg]:h-4.5 [&_svg]:w-4.5"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={classNames(
                        "truncate text-sm text-slate-800",
                        !item.is_read && "font-semibold",
                      )}
                    >
                      {item.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                      {item.content.replace(/<[^>]+>/g, " ").trim()}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="text-[11px] text-slate-400">
                      {formatRelativeTime(item.created_at)}
                    </span>
                    {!item.is_read && (
                      <span className="h-2 w-2 rounded-full bg-brand" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {visibleCount < items.length && (
            <button
              type="button"
              onClick={onLoadMore}
              className="mt-3 self-center text-sm font-medium text-brand hover:underline"
            >
              Xem thêm
            </button>
          )}
        </>
      )}
    </Card>
  );
};

export default NotificationList;
