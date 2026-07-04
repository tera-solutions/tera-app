import classNames from "classnames";
import moment from "moment";
import { RangePicker } from "tera-dls";

import Badge from "_common/components/Badge";
import FilterCard from "_common/components/FilterCard";
import FilterField from "_common/components/FilterField";

import type {
  NotificationCategory,
  NotificationFilters,
  NotificationStatus,
} from "../_interface";
import { CATEGORY_OPTIONS } from "../_utils";

interface NotificationFilterPanelProps {
  filters: NotificationFilters;
  onChange: (patch: Partial<NotificationFilters>) => void;
  categoryCounts: Record<NotificationCategory | "all", number>;
  statusCounts: Record<NotificationStatus, number>;
  onReset?: () => void;
}

const DATE_FORMAT = "YYYY-MM-DD";

const ListRow = ({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={classNames(
      "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
      active
        ? "bg-sky-50 font-medium text-brand"
        : "text-slate-600 hover:bg-slate-50",
    )}
  >
    <span className="truncate">{label}</span>
    <Badge
      className={classNames(
        "ml-2 px-2 py-0.5 text-xs font-semibold",
        active ? "bg-brand text-white" : "bg-slate-100 text-slate-500",
      )}
    >
      {count}
    </Badge>
  </button>
);

const NotificationFilterPanel = ({
  filters,
  onChange,
  categoryCounts,
  statusCounts,
  onReset,
}: NotificationFilterPanelProps) => {
  const rangeValue: [moment.Moment, moment.Moment] | undefined =
    filters.date_from && filters.date_to
      ? [moment(filters.date_from, DATE_FORMAT), moment(filters.date_to, DATE_FORMAT)]
      : undefined;

  return (
    <FilterCard onReset={onReset}>
      <FilterField label="Danh mục">
        <div className="flex flex-col gap-0.5">
          <ListRow
            label="Tất cả thông báo"
            count={categoryCounts.all}
            active={filters.category === "all"}
            onClick={() => onChange({ category: "all" })}
          />
          {CATEGORY_OPTIONS.map((opt) => (
            <ListRow
              key={opt.value}
              label={opt.label}
              count={categoryCounts[opt.value]}
              active={filters.category === opt.value}
              onClick={() => onChange({ category: opt.value })}
            />
          ))}
        </div>
      </FilterField>

      <FilterField label="Trạng thái">
        <div className="flex flex-col gap-0.5">
          <ListRow
            label="Tất cả"
            count={statusCounts.all}
            active={filters.status === "all"}
            onClick={() => onChange({ status: "all" })}
          />
          <ListRow
            label="Chưa đọc"
            count={statusCounts.unread}
            active={filters.status === "unread"}
            onClick={() => onChange({ status: "unread" })}
          />
          <ListRow
            label="Đã đọc"
            count={statusCounts.read}
            active={filters.status === "read"}
            onClick={() => onChange({ status: "read" })}
          />
        </div>
      </FilterField>

      <FilterField label="Thời gian">
        <RangePicker
          className="w-full"
          value={rangeValue as any}
          placeholder={["Từ ngày", "Đến ngày"]}
          allowClear={!!rangeValue}
          onChange={(value: any) =>
            onChange({
              date_from: value?.[0] ? value[0].format(DATE_FORMAT) : "",
              date_to: value?.[1] ? value[1].format(DATE_FORMAT) : "",
            })
          }
        />
      </FilterField>
    </FilterCard>
  );
};

export default NotificationFilterPanel;
