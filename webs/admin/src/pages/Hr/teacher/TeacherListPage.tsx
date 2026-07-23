/* Import: library */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { IModalProps } from "@tera/commons/interfaces";
import { TEACHER_PAGE_URL } from "@tera/commons/constants/url";
import useIsMobile from "@tera/commons/hooks/useIsMobile";

/* Import: services */
import { BranchService, TeacherService } from "@tera/modules";

/* Import: pages */
import FilterButton from "@tera/components/dof/FilterButton";
import SearchTeacher from "./containers/SearchTeacher";
import TeacherFilter from "./containers/TeacherFilter";
import TeacherFilterModal from "./containers/TeacherFilterModal";
import TeacherTable from "./containers/TeacherTable";
import TeacherFormModal from "./TeacherFormModal";

const TeacherListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [activeStatus, setActiveStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [managerFilter, setManagerFilter] = useState("");
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [skillsFilter, setSkillsFilter] = useState<string[]>([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Số bộ lọc nâng cao đang bật (hiện badge trên nút "Lọc").
  const activeFilterCount =
    (typeFilter ? 1 : 0) +
    (branchFilter ? 1 : 0) +
    (managerFilter ? 1 : 0) +
    (skillsFilter.length ? 1 : 0);

  const { data: branchData } = BranchService.useBranchList({
    params: { page: 1, per_page: 100, status: "active" },
  });
  const branches: any[] = branchData?.data?.items ?? [];

  // chuyên môn: distinct skill_name từ data giáo viên
  const { data: allTeacherData } = TeacherService.useTeacherList({
    params: { page: 1, per_page: 100 },
  });
  const skillOptions = [
    ...new Set(
      (allTeacherData?.data?.items ?? []).flatMap((tch: any) =>
        (tch.skills ?? []).map((s: any) => s?.skill_name).filter(Boolean),
      ),
    ),
  ].map((s) => ({ value: s as string, label: s as string }));

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
      // Xóa state để refresh/back không tự mở lại modal
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  // Chiều ngược lại: desktop đang mở modal → resize xuống mobile thì đóng modal
  // và chuyển sang trang riêng (create/update/detail) tương ứng.
  useEffect(() => {
    if (isMobile && modalData.open) {
      const { type, id } = modalData;
      setModalData({ open: false, type: "create", id: undefined });
      if (type === "update" && id != null) {
        navigate(TEACHER_PAGE_URL.update.path(id));
      } else if (type === "detail" && id != null) {
        navigate(TEACHER_PAGE_URL.detail.path(id));
      } else {
        navigate(TEACHER_PAGE_URL.create.path);
      }
    }
  }, [isMobile, modalData, navigate]);

  const tableParams = {
    ...params,
    search: keyword || undefined,
    status: activeStatus || undefined,
    teacher_type: typeFilter || undefined,
    branch_id: branchFilter || undefined,
    manager_id: managerFilter || undefined,
    skill: skillsFilter.length ? skillsFilter : undefined,
    // Mặc định sắp xếp tăng dần theo mã giáo viên khi mở màn
    sort_by: "code",
    sort_dir: "asc",
  };

  const resetPage = () => setParams((p: any) => ({ ...p, page: 1 }));

  const statusTabs = [
    { key: "", label: t("common.all") },
    { key: "active", label: t("teacher.status_active") },
    { key: "suspended", label: t("teacher.status_suspended") },
    { key: "resigned", label: t("teacher.status_resigned") },
  ];

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    setParams((prev: any) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList
        title={t("teacher.title")}
        buttonAddRender={() => (
          <Button
            onClick={() =>
              isMobile
                ? navigate(TEACHER_PAGE_URL.create.path)
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
          {/* Mobile: search + nút "Lọc" cùng 1 hàng; desktop: xmd:contents tan ra → search flex-1, nút ẩn */}
          <div className="flex items-center gap-2 xmd:contents">
            <SearchTeacher
              className="flex-1 min-w-0"
              value={keyword}
              onChange={(v) => {
                setKeyword(v);
                resetPage();
              }}
            />

            <FilterButton
              onClick={() => setFilterModalOpen(true)}
              count={activeFilterCount}
            />
          </div>

          {/* Dropdown lọc inline — CHỈ hiện desktop (mobile dùng nút "Lọc") */}
          <div className="hidden xmd:contents">
            <TeacherFilter
              branchOptions={branches.map((branch) => ({
                value: String(branch.id),
                label: branch.name,
              }))}
              skillOptions={skillOptions}
              type={typeFilter}
              branch={branchFilter}
              manager={managerFilter}
              selectedManager={selectedManager}
              skills={skillsFilter}
              onTypeChange={(v) => {
                setTypeFilter(v);
                resetPage();
              }}
              onBranchChange={(v) => {
                setBranchFilter(v);
                resetPage();
              }}
              onManagerChange={(id, user) => {
                setManagerFilter(id);
                setSelectedManager(user ?? null);
                resetPage();
              }}
              onSkillsChange={(vals) => {
                setSkillsFilter(vals);
                resetPage();
              }}
            />
          </div>
        </div>

        <TeacherTable
          params={tableParams}
          setParams={setParams}
          setModalData={setModalData}
        />
      </HeaderViewList>

      {modalData.open && (
        <TeacherFormModal
          open={modalData.open}
          type={modalData.type}
          id={modalData.id}
          onClose={() =>
            setModalData({ open: false, type: "create", id: undefined })
          }
        />
      )}

      <TeacherFilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        baseParams={{
          search: keyword || undefined,
          status: activeStatus || undefined,
        }}
        value={{
          type: typeFilter,
          branch: branchFilter,
          manager: managerFilter,
          selectedManager,
          skills: skillsFilter,
        }}
        onApply={(v) => {
          setTypeFilter(v.type);
          setBranchFilter(v.branch);
          setManagerFilter(v.manager);
          setSelectedManager(v.selectedManager);
          setSkillsFilter(v.skills);
          resetPage();
        }}
        branchOptions={branches.map((branch) => ({
          value: String(branch.id),
          label: branch.name,
        }))}
        skillOptions={skillOptions}
      />
    </div>
  );
};

export default TeacherListPage;
