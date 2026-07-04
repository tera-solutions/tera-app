/* Import: library */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { IModalProps } from "@tera/commons/interfaces";
import { COURSE_PAGE_URL } from "@tera/commons/constants/url";
import useIsMobile from "@tera/commons/hooks/useIsMobile";

/* Import: pages */
import SearchBar from "_common/components/SearchBar";
import CourseFilter, {
  CourseFilterValue,
} from "./containers/CourseFilter";
import CourseTable from "./containers/CourseTable";
import CourseFormModal from "./CourseFormModal";

const defaultFilters: CourseFilterValue = {
  durationMin: "",
  durationMax: "",
  priceMin: "",
  priceMax: "",
  createdBy: "",
  selectedCreatedBy: null,
  createdFrom: "",
  createdTo: "",
};

const CourseListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [activeStatus, setActiveStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<CourseFilterValue>(defaultFilters);
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [modalData, setModalData] = useState<IModalProps>({
    open: false,
    type: "create",
    id: undefined,
  });

  const resetPage = () => setParams((p: any) => ({ ...p, page: 1 }));

  const patchFilters = (patch: Partial<CourseFilterValue>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    resetPage();
  };

  const tableParams = {
    ...params,
    search: keyword || undefined,
    is_active: activeStatus || undefined,
    duration_min: filters.durationMin || undefined,
    duration_max: filters.durationMax || undefined,
    price_min: filters.priceMin || undefined,
    price_max: filters.priceMax || undefined,
    created_by: filters.createdBy || undefined,
    created_from: filters.createdFrom || undefined,
    created_to: filters.createdTo || undefined,
    sort_by: sortBy || undefined,
    sort_dir: sortBy ? sortDir : undefined,
  };

  const statusTabs = [
    { key: "", label: t("common.all") },
    { key: "1", label: t("course.status_active") },
    { key: "0", label: t("course.status_inactive") },
  ];

  return (
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList
        title={t("course.title")}
        buttonAddRender={() => (
          <Button
            onClick={() =>
              isMobile
                ? navigate(COURSE_PAGE_URL.create.path)
                : setModalData({ open: true, type: "create" })
            }
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
          <SearchBar
            className="xmd:flex-1"
            value={keyword}
            placeholder={t("course.search_placeholder")}
            onChange={(v) => {
              setKeyword(v);
              resetPage();
            }}
          />

          <CourseFilter
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

        <CourseTable
          params={tableParams}
          setParams={setParams}
          setModalData={setModalData}
        />
      </HeaderViewList>

      {modalData.open && (
        <CourseFormModal
          open={modalData.open}
          type={modalData.type}
          id={modalData.id}
          onClose={() =>
            setModalData({ open: false, type: "create", id: undefined })
          }
        />
      )}
    </div>
  );
};

export default CourseListPage;
