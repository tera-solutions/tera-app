import classNames from "classnames";

import Card from "_common/components/Card";
import DonutStatsCard from "_common/components/DonutStatsCard";
import IconBox from "_common/components/IconBox";
import { CARD_LINK } from "_common/constants/dashboard";

import type { RecentLibraryItem } from "../_interface";
import { CATEGORY_TAGS, RESOURCE_TYPE_META } from "../constants";
import { STORAGE_SEGMENTS } from "../mock";

interface LibrarySidebarProps {
  recentItems: RecentLibraryItem[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onViewRecent: (id: string) => void;
}

const LibrarySidebar = ({
  recentItems,
  selectedCategory,
  onSelectCategory,
  onViewRecent,
}: LibrarySidebarProps) => {
  const totalGb = STORAGE_SEGMENTS.reduce((sum, s) => sum + s.gb, 0);
  const capacityGb = 50;
  const usedPercent = Math.round((totalGb / capacityGb) * 100);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-800">Học liệu mới cập nhật</p>
          <button type="button" className={CARD_LINK}>
            Xem tất cả
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {recentItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onViewRecent(item.id)}
              className="flex items-center gap-3 text-left"
            >
              <IconBox
                icon={RESOURCE_TYPE_META[item.type].icon}
                sizeClassName="h-9 w-9"
                roundedClassName="rounded-lg"
                colorClassName="bg-sky-50 text-brand"
                iconSizeClassName="[&_svg]:h-4.5 [&_svg]:w-4.5"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">{item.title}</p>
                <p className="truncate text-xs text-slate-400">
                  {item.updatedAt} · {item.ownerName}
                </p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-800">Danh mục</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onSelectCategory(selectedCategory === tag ? "" : tag)}
              className={classNames(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                selectedCategory === tag
                  ? "border-brand bg-sky-50 text-brand"
                  : "border-slate-200 text-slate-500 hover:border-brand hover:text-brand",
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </Card>

      <DonutStatsCard
        title="Dung lượng sử dụng"
        centerValue={`${usedPercent}%`}
        centerCaption="Đã sử dụng"
        legend={STORAGE_SEGMENTS.map((segment) => ({
          key: segment.key,
          label: segment.label,
          color: segment.color,
          value: segment.gb,
          displayValue: `${segment.gb} GB`,
        }))}
        footer={
          <p className="mt-3 border-t border-slate-100 pt-3 text-center text-xs text-slate-400">
            Tổng: {totalGb.toFixed(1)} GB / {capacityGb} GB
          </p>
        }
      />
    </div>
  );
};

export default LibrarySidebar;
