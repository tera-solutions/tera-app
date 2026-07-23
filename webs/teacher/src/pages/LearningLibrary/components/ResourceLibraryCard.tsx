import { useState } from "react";
import { Button } from "tera-dls";
import classNames from "classnames";

import Card from "_common/components/Card";
import EmptyState from "_common/components/EmptyState";
import SearchInput from "_common/components/SearchInput";

import type { LibraryResource } from "../_interface";
import { LIBRARY_PAGE_SIZE, LIBRARY_TYPE_TABS } from "../constants";
import ResourceCard from "./ResourceCard";

interface ResourceLibraryCardProps {
  resources: LibraryResource[];
  activeType: string;
  onTypeChange: (key: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onView: (resource: LibraryResource) => void;
  onDownload: (resource: LibraryResource) => void;
}

const ResourceLibraryCard = ({
  resources,
  activeType,
  onTypeChange,
  search,
  onSearchChange,
  onView,
  onDownload,
}: ResourceLibraryCardProps) => {
  const [visibleCount, setVisibleCount] = useState(LIBRARY_PAGE_SIZE);
  const visibleResources = resources.slice(0, visibleCount);

  const handleTypeChange = (key: string) => {
    setVisibleCount(LIBRARY_PAGE_SIZE);
    onTypeChange(key);
  };

  return (
    <Card>
      <p className="mb-3 text-base font-semibold text-slate-800">Thư viện học liệu</p>

      <div className="mb-3 flex flex-wrap gap-2">
        {LIBRARY_TYPE_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTypeChange(tab.key)}
            className={classNames(
              "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
              activeType === tab.key
                ? "bg-brand text-white"
                : "bg-slate-50 text-slate-500 hover:bg-slate-100",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <SearchInput
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Tìm kiếm trong thư viện..."
        wrapperClassName="mb-3"
      />

      {visibleResources.length === 0 ? (
        <EmptyState description="Không có học liệu phù hợp" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onView={onView}
                onDownload={onDownload}
              />
            ))}
          </div>

          {visibleCount < resources.length && (
            <Button
              outlined
              className="mt-4 w-full border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
              onClick={() => setVisibleCount((count) => count + LIBRARY_PAGE_SIZE)}
            >
              Xem thêm học liệu
            </Button>
          )}
        </>
      )}
    </Card>
  );
};

export default ResourceLibraryCard;
