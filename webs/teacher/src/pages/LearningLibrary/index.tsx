import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, ChevronDownOutlined, Dropdown, PlusOutlined, notification } from "tera-dls";

import CompactSelect from "_common/components/CompactSelect";
import SearchInput from "_common/components/SearchInput";
import { PATHS } from "_common/components/Layout/Menu/menus";

import type { LibraryResource } from "./_interface";
import { ADD_MATERIAL_TYPE_ITEMS, LEVEL_OPTIONS, SUBJECT_OPTIONS } from "./constants";
import { LIBRARY_RESOURCES, MOST_USED_ROWS, RECENT_LIBRARY_ITEMS } from "./mock";
import LibraryStats from "./components/LibraryStats";
import ResourceLibraryCard from "./components/ResourceLibraryCard";
import LibrarySidebar from "./components/LibrarySidebar";
import MostUsedTable from "./components/MostUsedTable";

const LearningLibrary = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");

  const resources = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return LIBRARY_RESOURCES.filter((item) => {
      if (activeType !== "all" && item.type !== activeType) return false;
      if (subject && item.category !== subject) return false;
      if (level && item.level.toLowerCase() !== level) return false;
      if (keyword && !item.title.toLowerCase().includes(keyword)) return false;
      return true;
    });
  }, [search, activeType, subject, level]);

  const handleComingSoon = () =>
    notification.warning({ message: "Tính năng đang được phát triển" });

  const handleView = (resource: LibraryResource) =>
    navigate(`${PATHS.learningLibrary}/${resource.id}`);
  const handleDownload = (_resource: LibraryResource) => handleComingSoon();
  const handleViewRecent = (id: string) => navigate(`${PATHS.learningLibrary}/${id}`);

  const addMaterialMenuItems = ADD_MATERIAL_TYPE_ITEMS.map((item) => ({
    key: item.value,
    icon: item.icon,
    label: item.label,
    onClick: () => {
      if (item.value === "video") return navigate(`${PATHS.learningLibrary}/create?type=video`);
      if (item.value === "comic") return navigate(`${PATHS.learningLibrary}/create-comic`);
      if (item.value === "dialogue") return navigate(`${PATHS.learningLibrary}/create-dialogue`);
      if (item.value === "flashcard") return navigate(`${PATHS.learningLibrary}/create-flashcard`);
      if (item.value === "audio") return navigate(`${PATHS.learningLibrary}/create-audio`);
      if (item.value === "ebook") return navigate(`${PATHS.learningLibrary}/create-ebook`);
      return handleComingSoon();
    },
  }));

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Học liệu</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý giáo án, video, worksheet và tài nguyên giảng dạy
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm học liệu..."
            wrapperClassName="w-full sm:w-56"
          />
          <CompactSelect value={subject} options={SUBJECT_OPTIONS} onChange={setSubject} />
          <CompactSelect value={level} options={LEVEL_OPTIONS} onChange={setLevel} />
          <Dropdown trigger="click" menu={{ items: addMaterialMenuItems }}>
            <Button
              icon={<PlusOutlined />}
              className="whitespace-nowrap bg-brand hover:bg-brand/80"
            >
              Thêm học liệu
              <ChevronDownOutlined className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Dropdown>
        </div>
      </div>

      <div className="mb-4">
        <LibraryStats />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        <ResourceLibraryCard
          resources={resources}
          activeType={activeType}
          onTypeChange={setActiveType}
          search={search}
          onSearchChange={setSearch}
          onView={handleView}
          onDownload={handleDownload}
        />

        <LibrarySidebar
          recentItems={RECENT_LIBRARY_ITEMS}
          selectedCategory={subject}
          onSelectCategory={setSubject}
          onViewRecent={handleViewRecent}
        />
      </div>

      <div className="mt-4">
        <MostUsedTable rows={MOST_USED_ROWS} />
      </div>
    </div>
  );
};

export default LearningLibrary;
