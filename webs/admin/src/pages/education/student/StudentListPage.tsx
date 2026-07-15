/* Import: library */
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { IModalProps } from "@tera/commons/interfaces";
import { STUDENT_PAGE_URL } from "@tera/commons/constants/url";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { BranchService, LevelService } from "@tera/modules";

/* Import: pages */
import SearchBar from "_common/components/SearchBar";
import FilterButton from "@tera/components/dof/FilterButton";
import StudentFilter from "./containers/StudentFilter";
import StudentFilterModal from "./containers/StudentFilterModal";
import StudentTable from "./containers/StudentTable";
import StudentFormModal from "./StudentFormModal";

const StudentListPage = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { globalStore } = useStores();

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [activeStatus, setActiveStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [sortBy, setSortBy] = useState("code");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const activeFilterCount = (levelFilter ? 1 : 0) + (branchFilter ? 1 : 0);

  const [modalData, setModalData] = useState<IModalProps>({
    open: false,
    type: "create",
    id: undefined,
  });

  // Trang create/update/detail (mobile) redirect về đây khi resize sang desktop,
  // kèm state.openModal = { type, id } để mở tiếp đúng modal.
  const location = useLocation();
  useEffect(() => {
    const m = (location.state as any)?.openModal;
    if (m?.type) {
      setModalData({ open: true, type: m.type, id: m.id });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  // Chiều ngược: desktop đang mở modal → resize xuống mobile thì đóng modal
  // và chuyển sang trang riêng (create/update/detail) tương ứng.
  useEffect(() => {
    if (isMobile && modalData.open) {
      const { type, id } = modalData;
      setModalData({ open: false, type: "create", id: undefined });
      if (type === "update" && id != null)
        navigate(STUDENT_PAGE_URL.update.path(id));
      else if (type === "detail" && id != null)
        navigate(STUDENT_PAGE_URL.detail.path(id));
      else navigate(STUDENT_PAGE_URL.create.path);
    }
  }, [isMobile, modalData, navigate]);

  const { data: branchData } = BranchService.useBranchList({
    params: { page: 1, per_page: 100 },
  });
  const branches: any[] = branchData?.data?.items ?? [];

  const { data: levelData } = LevelService.useLevelList({
    params: { page: 1, per_page: 100 },
  });
  const levels: any[] = levelData?.data?.items ?? [];

  const statusOptions = globalStore.getOptions("student_status") ?? [];
  const statusTabs = [
    { key: "", label: t("common.all") },
    ...statusOptions.map((o: any) => ({ key: o.value, label: o.label })),
  ];

  const tableParams = {
    ...params,
    search: keyword || undefined,
    status: activeStatus || undefined,
    level_id: levelFilter || undefined,
    branch_id: branchFilter || undefined,
    sort_by: sortBy || undefined,
    sort_dir: sortBy ? sortDir : undefined,
  };

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    setParams((prev: any) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList
        title={t("student.title")}
        buttonAddRender={() => (
          <Button
            onClick={() =>
              isMobile
                ? navigate(STUDENT_PAGE_URL.create.path)
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
              onClick={() => handleStatusChange(tab.key)}
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
          {/* Mobile: search + nút "Lọc" cùng hàng; desktop: xmd:contents tan ra */}
          <div className="flex items-center gap-2 xmd:contents">
            <SearchBar
              className="flex-1 min-w-0"
              value={keyword}
              placeholder={t("student.search_placeholder")}
              onChange={(v) => {
                setKeyword(v);
                setParams((p: any) => ({ ...p, page: 1 }));
              }}
            />
            <FilterButton
              onClick={() => setFilterModalOpen(true)}
              count={activeFilterCount}
            />

            <StudentFilter
              levelOptions={levels.map((lv) => ({
                value: String(lv.id),
                label: lv.level_code
                  ? `${lv.level_name} (${lv.level_code})`
                  : lv.level_name,
              }))}
              branchOptions={branches.map((b) => ({
                value: String(b.id),
                label: b.name,
              }))}
              level={levelFilter}
              branch={branchFilter}
              sortBy={sortBy}
              sortDir={sortDir}
              onLevelChange={(v) => {
                setLevelFilter(v);
                setParams((p: any) => ({ ...p, page: 1 }));
              }}
              onBranchChange={(v) => {
                setBranchFilter(v);
                setParams((p: any) => ({ ...p, page: 1 }));
              }}
              onSortChange={(sb, sd) => {
                setSortBy(sb);
                setSortDir(sd);
                setParams((p: any) => ({ ...p, page: 1 }));
              }}
            />
          </div>
        </div>

        <StudentTable
          params={tableParams}
          setParams={setParams}
          setModalData={setModalData}
        />
      </HeaderViewList>

      {modalData.open && (
        <StudentFormModal
          open={modalData.open}
          type={modalData.type}
          id={modalData?.id}
          onClose={() =>
            setModalData({ open: false, type: "create", id: undefined })
          }
        />
      )}

      <StudentFilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        baseParams={{
          search: keyword || undefined,
          status: activeStatus || undefined,
        }}
        value={{ level: levelFilter, branch: branchFilter }}
        onApply={(v) => {
          setLevelFilter(v.level);
          setBranchFilter(v.branch);
          setParams((p: any) => ({ ...p, page: 1 }));
        }}
        levelOptions={levels.map((lv) => ({
          value: String(lv.id),
          label: lv.level_code
            ? `${lv.level_name} (${lv.level_code})`
            : lv.level_name,
        }))}
        branchOptions={branches.map((b) => ({
          value: String(b.id),
          label: b.name,
        }))}
      />
    </div>
  );
});

export default StudentListPage;
