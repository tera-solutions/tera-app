/* Import: library */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";

/* Import: services */
import { CourseService } from "@tera/modules";

/* Import: pages */
import FilterSelect from "_common/components/FilterSelect";
import LevelTable from "./containers/LevelTable";
import LevelFormModal from "./LevelFormModal";
import { ILevel, LEVEL_STATUS_TABS } from "./_interface";

const LevelListPage = () => {
  const { t } = useTranslation();

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [keyword, setKeyword] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [modal, setModal] = useState<{
    open: boolean;
    type: "create" | "update" | "detail";
    record?: ILevel | null;
  }>({ open: false, type: "create" });

  const resetPage = () => setParams((p: any) => ({ ...p, page: 1 }));

  const { data: courseData } = CourseService.useCourseList({
    params: { page: 1, per_page: 100 },
  });
  const courses: any[] = courseData?.data?.items ?? [];

  const statusTabs = [
    { key: "", label: t("common.all") },
    ...LEVEL_STATUS_TABS.map((s) => ({
      key: s,
      label: t(`level.status_${s}`),
    })),
  ];

  const tableParams = {
    ...params,
    search: keyword || undefined,
    status: activeStatus || undefined,
    course_id: courseFilter || undefined,
  };

  return (
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList
        title={t("level.title")}
        buttonAddRender={() => (
          <Button
            onClick={() => setModal({ open: true, type: "create" })}
            className="rounded-lg xmd:rounded-xsm shrink-0 px-2 py-1.5 xmd:py-1 cursor-pointer"
          >
            <div className="flex items-center gap-1 shrink-0">
              <PlusCircleOutlined className="w-5 h-5" />
              <span>{t("button.create")}</span>
            </div>
          </Button>
        )}
      >
        {/* Status tabs */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-0.5 mt-2 scrollbar-none">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveStatus(tab.key);
                resetPage();
              }}
              className={`px-3 py-1 text-[13px] rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeStatus === tab.key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + filter khóa học */}
        <div className="flex flex-col gap-2 mb-3 xmd:flex-row xmd:items-center">
          <div className="relative w-full xmd:flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                resetPage();
              }}
              placeholder={t("level.search_placeholder")}
              className="w-full h-9 border border-gray-300 rounded pl-8 pr-3 text-[13px] bg-white focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500"
            />
          </div>
          <FilterSelect
            allowClear
            className="w-full xmd:w-auto xmd:shrink-0 xmd:min-w-[180px]"
            value={courseFilter}
            placeholder={t("level.all_courses")}
            options={courses.map((c) => ({
              value: String(c.id),
              label: c.code ? `${c.name} (${c.code})` : c.name,
            }))}
            onChange={(v) => {
              setCourseFilter(v);
              resetPage();
            }}
          />
        </div>

        <LevelTable
          params={tableParams}
          setParams={setParams}
          onView={(record) => setModal({ open: true, type: "detail", record })}
          onEdit={(record) => setModal({ open: true, type: "update", record })}
        />
      </HeaderViewList>

      {modal.open && (
        <LevelFormModal
          open={modal.open}
          type={modal.type}
          record={modal.record}
          onClose={() => setModal({ open: false, type: "create" })}
        />
      )}
    </div>
  );
};

export default LevelListPage;
