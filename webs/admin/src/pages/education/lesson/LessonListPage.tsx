/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { IModalProps } from "@tera/commons/interfaces";
import { LESSON_PAGE_URL } from "@tera/commons/constants/url";
import useIsMobile from "@tera/commons/hooks/useIsMobile";

/* Import: pages */
import SearchBar from "_common/components/SearchBar";
import FilterButton from "@tera/components/dof/FilterButton";
import { LESSON_STATUSES } from "pages/education/lesson/_interface";
import LessonFilter, { LessonFilterValue } from "./containers/LessonFilter";
import LessonFilterModal from "./containers/LessonFilterModal";
import LessonTable from "./containers/LessonTable";
import LessonFormModal from "./LessonFormModal";

const defaultFilters: LessonFilterValue = {
  branch: "",
  classRoom: "",
  teacher: "",
  room: "",
  dateFrom: "",
  dateTo: "",
};

const LessonListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [activeStatus, setActiveStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<LessonFilterValue>(defaultFilters);
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const activeFilterCount =
    (filters.branch ? 1 : 0) +
    (filters.classRoom ? 1 : 0) +
    (filters.teacher ? 1 : 0) +
    (filters.room ? 1 : 0) +
    (filters.dateFrom || filters.dateTo ? 1 : 0);

  const [modalData, setModalData] = useState<IModalProps>({
    open: false,
    type: "create",
    id: undefined,
  });

  // Trang update/detail (mobile) redirect về đây khi resize sang desktop.
  const location = useLocation();
  useEffect(() => {
    const m = (location.state as any)?.openModal;
    if (m?.type) {
      setModalData({ open: true, type: m.type, id: m.id });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  // Chiều ngược: desktop đang mở modal update/detail → resize xuống mobile.
  useEffect(() => {
    if (isMobile && modalData.open) {
      const { type, id } = modalData;
      setModalData({ open: false, type: "create", id: undefined });
      if (type === "update" && id != null)
        navigate(LESSON_PAGE_URL.update.path(String(id)));
      else if (type === "detail" && id != null)
        navigate(LESSON_PAGE_URL.detail.path(String(id)));
    }
  }, [isMobile, modalData, navigate]);

  const resetPage = () => setParams((p: any) => ({ ...p, page: 1 }));

  const patchFilters = (patch: Partial<LessonFilterValue>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    resetPage();
  };

  const tableParams = {
    ...params,
    search: keyword || undefined,
    status: activeStatus || undefined,
    branch_id: filters.branch || undefined,
    class_room_id: filters.classRoom || undefined,
    teacher_id: filters.teacher || undefined,
    room_id: filters.room || undefined,
    date_from: filters.dateFrom || undefined,
    date_to: filters.dateTo || undefined,
    sort_by: sortBy || undefined,
    sort_dir: sortBy ? sortDir : undefined,
  };

  const statusTabs = [
    { key: "", label: t("common.all") },
    ...LESSON_STATUSES.map((s) => ({
      key: s,
      label: t(`lesson.status_${s}`),
    })),
  ];

  return (
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList title={t("lesson.title")}>
        {/* Status tabs */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-0.5 mt-2 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
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

        {/* Search + quick filters row */}
        <div className="flex flex-col gap-2 mb-3 xmd:flex-row xmd:items-center">
          <div className="flex items-center gap-2 xmd:contents">
            <SearchBar
              className="flex-1 min-w-0"
              value={keyword}
              placeholder={t("lesson.search_placeholder")}
              onChange={(v) => {
                setKeyword(v);
                resetPage();
              }}
            />
            <FilterButton
              onClick={() => setFilterModalOpen(true)}
              count={activeFilterCount}
            />

            <LessonFilter
              value={filters}
              onChange={patchFilters}
              sortBy={sortBy}
              sortDir={sortDir}
              onSortChange={(by, dir) => {
                setSortBy(by);
                setSortDir(dir);
                resetPage();
              }}
            />
          </div>
        </div>

        <LessonTable
          params={tableParams}
          setParams={setParams}
          setModalData={setModalData}
        />
      </HeaderViewList>

      {modalData.open && (
        <LessonFormModal
          open={modalData.open}
          type={modalData.type}
          id={modalData.id}
          onClose={() =>
            setModalData({ open: false, type: "create", id: undefined })
          }
        />
      )}

      <LessonFilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        baseParams={{
          search: keyword || undefined,
          status: activeStatus || undefined,
        }}
        value={{
          branch: filters.branch,
          classRoom: filters.classRoom,
          teacher: filters.teacher,
          room: filters.room,
          dateFrom: filters.dateFrom,
          dateTo: filters.dateTo,
        }}
        onApply={(v) => patchFilters(v)}
      />
    </div>
  );
};

export default LessonListPage;
