/* Import: library */
import { useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { IModalProps } from "@tera/commons/interfaces";
import { CLASS_ROOM_PAGE_URL } from "@tera/commons/constants/url";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { useStores } from "@tera/stores/useStores";

/* Import: pages */
import SearchBar from "_common/components/SearchBar";
import ClassRoomFilter, {
  ClassRoomFilterValue,
} from "./containers/ClassRoomFilter";
import ClassRoomTable from "./containers/ClassRoomTable";
import ClassRoomFormModal from "./ClassRoomFormModal";

const defaultFilters: ClassRoomFilterValue = {
  course: "",
  teacher: "",
  assignee: "",
  selectedAssignee: null,
  weekday: "",
  shift: "",
  startFrom: "",
  startTo: "",
};

const ClassRoomListPage = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { globalStore } = useStores();

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [activeStatus, setActiveStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<ClassRoomFilterValue>(defaultFilters);
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [modalData, setModalData] = useState<IModalProps>({
    open: false,
    type: "create",
    id: undefined,
  });

  const statusOptions = globalStore.getOptions("class_status") ?? [];
  const statusTabs = [
    { key: "", label: t("common.all") },
    ...statusOptions.map((o: any) => ({ key: o.value, label: o.label })),
  ];

  const resetPage = () => setParams((p: any) => ({ ...p, page: 1 }));

  const patchFilters = (patch: Partial<ClassRoomFilterValue>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    resetPage();
  };

  const tableParams = {
    ...params,
    search: keyword || undefined,
    status: activeStatus || undefined,
    course_id: filters.course || undefined,
    teacher_id: filters.teacher || undefined,
    assignee_id: filters.assignee || undefined,
    day_of_week: filters.weekday || undefined,
    shift: filters.shift || undefined,
    start_date_from: filters.startFrom || undefined,
    start_date_to: filters.startTo || undefined,
    sort_by: sortBy || undefined,
    sort_dir: sortBy ? sortDir : undefined,
  };

  return (
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList
        title={t("classroom.title")}
        buttonAddRender={() => (
          <Button
            onClick={() =>
              isMobile
                ? navigate(CLASS_ROOM_PAGE_URL.create.path)
                : setModalData({ open: true, type: "create" })
            }
            className="rounded-lg xmd:rounded-xsm shrink-0 px-2 py-1.5 xmd:py-1"
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
              className={`px-3 py-1 text-[13px] rounded-md font-medium whitespace-nowrap transition-colors ${
                activeStatus === tab.key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + quick filters: full width = chung 1 hàng; hẹp lại thì filter giữ
            nguyên (shrink-0), search co lại; dưới 1280px về layout mobile */}
        <div className="flex flex-col gap-2 mb-3 xmd:flex-row xmd:flex-wrap xmd:items-center">
          <SearchBar
            className="w-full xmd:flex-1 xmd:min-w-[200px]"
            value={keyword}
            placeholder={t("classroom.search_placeholder")}
            onChange={(v) => {
              setKeyword(v);
              resetPage();
            }}
          />

          <ClassRoomFilter
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

        <ClassRoomTable
          params={tableParams}
          setParams={setParams}
          setModalData={setModalData}
        />
      </HeaderViewList>

      {modalData.open && (
        <ClassRoomFormModal
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
});

export default ClassRoomListPage;
