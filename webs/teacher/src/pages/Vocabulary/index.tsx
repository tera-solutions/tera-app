import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpTrayOutlined, Button, ChevronRightOutlined, PlusOutlined, notification } from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { AiGenerateService } from "@tera/modules/education";

import { toVocabularyListResult, toVocabularySearchItems, toVocabularySummary } from "./_utils";
import VocabularyStats from "./components/VocabularyStats";
import VocabularyFilterBar from "./components/VocabularyFilterBar";
import VocabularyTable from "./components/VocabularyTable";

const Vocabulary = () => {
  const [filters, setFilters] = useUrlFilters({
    search: { type: "string", default: "" },
    level: { type: "string", default: "" },
    topic: { type: "string", default: "" },
    status: { type: "string", default: "" },
    page: { type: "number", default: 1 },
    per_page: { type: "number", default: DEFAULT_PAGE_SIZE },
  });

  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );

  const isSearching = !!filters.search;

  // `ai-generate/vocabulary` (browse) supports server-side pagination + level/topic filters.
  const listQuery = AiGenerateService.useAiVocabularyList(
    {
      params: {
        page: filters.page,
        per_page: filters.per_page,
        filters: { level: filters.level || undefined, topic: filters.topic || undefined },
      },
    },
    { enabled: !isSearching },
  );
  // `ai-generate/vocabulary/search` (by word) has no pagination meta and no level/topic filter —
  // fetch a generous batch and narrow down client-side instead.
  const searchQuery = AiGenerateService.useAiVocabularySearch({
    params: { q: filters.search, limit: 50 },
  });

  const listResult = useMemo(() => toVocabularyListResult(listQuery.data?.data), [listQuery.data]);
  const searchItems = useMemo(() => toVocabularySearchItems(searchQuery.data?.data), [searchQuery.data]);

  const items = useMemo(() => {
    const base = isSearching
      ? searchItems.filter(
          (i) => (!filters.level || i.level === filters.level) && (!filters.topic || i.topic === filters.topic),
        )
      : listResult.items;
    return filters.status ? base.filter((i) => i.statusGroup === filters.status) : base;
  }, [isSearching, searchItems, listResult.items, filters.level, filters.topic, filters.status]);

  // Stats always reflect the browse endpoint (server total), not the transient search result.
  const summary = useMemo(() => toVocabularySummary(listResult.total, listResult.items), [listResult]);

  // Level/topic have no dedicated lookup endpoint — options are the distinct values seen on the
  // currently loaded browse page, plus whichever value is already selected (so it doesn't vanish).
  const levelOptions = useMemo(() => {
    const set = new Set(listResult.items.map((i) => i.level).filter(Boolean));
    if (filters.level) set.add(filters.level);
    return [{ value: "", label: "Tất cả cấp độ" }, ...Array.from(set).sort().map((v) => ({ value: v, label: v }))];
  }, [listResult.items, filters.level]);

  const topicOptions = useMemo(() => {
    const set = new Set(listResult.items.map((i) => i.topic).filter(Boolean));
    if (filters.topic) set.add(filters.topic);
    return [{ value: "", label: "Tất cả chủ đề" }, ...Array.from(set).sort().map((v) => ({ value: v, label: v }))];
  }, [listResult.items, filters.topic]);

  const handleResetFilters = () => {
    setSearchDraft("");
    setFilters({ search: "", level: "", topic: "", status: "", page: 1, per_page: DEFAULT_PAGE_SIZE });
  };

  const handlePageChange = (nextPage: number, nextSize: number) => {
    if (isSearching) return;
    if (nextSize !== filters.per_page) setFilters({ per_page: nextSize, page: 1 });
    else setFilters({ page: nextPage });
  };

  const handleComingSoon = () => notification.warning({ message: "Tính năng đang được phát triển" });

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-3 flex items-center gap-1.5 text-sm text-slate-500">
        <Link to={PATHS.learningLibrary} className="hover:text-brand">
          Học liệu
        </Link>
        <ChevronRightOutlined className="h-3.5 w-3.5 text-slate-300" />
        <span className="text-slate-700">Danh sách từ vựng</span>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Danh sách từ vựng</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý và tổ chức từ vựng theo chủ đề, cấp độ và chương trình học.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            outlined
            icon={<ArrowUpTrayOutlined />}
            className="whitespace-nowrap border-slate-200 text-slate-600 hover:border-brand hover:text-brand"
            onClick={handleComingSoon}
          >
            Nhập từ vựng
          </Button>
          <Button
            icon={<PlusOutlined />}
            className="whitespace-nowrap bg-brand hover:bg-brand/80"
            onClick={handleComingSoon}
          >
            Tạo từ vựng mới
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <VocabularyStats summary={summary} loading={listQuery.isLoading} />
      </div>

      <div className="mb-4">
        <VocabularyFilterBar
          search={searchDraft}
          onSearchChange={setSearchDraft}
          level={filters.level}
          onLevelChange={(v) => setFilters({ level: v, page: 1 })}
          levelOptions={levelOptions}
          topic={filters.topic}
          onTopicChange={(v) => setFilters({ topic: v, page: 1 })}
          topicOptions={topicOptions}
          status={filters.status}
          onStatusChange={(v) => setFilters({ status: v, page: 1 })}
          onResetFilters={handleResetFilters}
        />
      </div>

      <VocabularyTable
        items={items}
        total={isSearching ? items.length : listResult.total}
        page={isSearching ? 1 : listResult.page || filters.page}
        perPage={isSearching ? Math.max(items.length, 1) : listResult.perPage || filters.per_page}
        loading={isSearching ? searchQuery.isLoading : listQuery.isLoading || listQuery.isFetching}
        isError={isSearching ? searchQuery.isError : listQuery.isError}
        onRetry={() => (isSearching ? searchQuery.refetch() : listQuery.refetch())}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Vocabulary;
