/* Import: library */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { IModalProps } from "@tera/commons/interfaces";
import { TEACHER_PAGE_URL } from "@tera/commons/constants/url";
import useIsMobile from "@tera/commons/hooks/useIsMobile";

/* Import: services */
import { BranchService, TeacherService } from "@tera/modules";

/* Import: pages */
import UserSelect from "_common/components/UserSelect";
import MultiSelect from "_common/components/MultiSelect";
import FilterSelect from "_common/components/FilterSelect";
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

  const tableParams = {
    ...params,
    search: keyword || undefined,
    status: activeStatus || undefined,
    teacher_type: typeFilter || undefined,
    branch_id: branchFilter || undefined,
    manager_id: managerFilter || undefined,
    skills: skillsFilter.length ? skillsFilter : undefined,
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
    <div className='p-2.5 max-xmd:pb-[60px]'>
      <HeaderViewList
        title={t("teacher.title")}
        buttonAddRender={() => (
          <Button
            onClick={() =>
              isMobile
                ? navigate(TEACHER_PAGE_URL.create.path)
                : setModalData({ open: true, type: "create" })
            }
            className='rounded-lg xmd:rounded-xsm shrink-0 px-2 py-1.5 xmd:py-1'
          >
            <div className='flex items-center gap-1 shrink-0'>
              <PlusCircleOutlined className='w-5 h-5' />
              <span>{t("button.create")}</span>
            </div>
          </Button>
        )}
      >
        {/* Status tabs */}
        <div className='flex gap-1.5 mb-3 overflow-x-auto pb-0.5 mt-2 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent'>
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type='button'
              onClick={() => handleStatusChange(tab.key)}
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

        {/* Search + quick filters row */}
        <div className='grid grid-cols-2 gap-2 mb-3 xmd:flex xmd:flex-nowrap xmd:items-center'>
          {/* Search input */}
          <div className='relative col-span-2 min-w-0 xmd:flex-1'>
            <span className='absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </span>
            <input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setParams((p: any) => ({ ...p, page: 1 }));
              }}
              placeholder={t("teacher.search_placeholder")}
              className='w-full h-9 border border-gray-300 rounded pl-8 pr-3 text-[13px] bg-white focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500'
            />
          </div>

          {/* Loại GV dropdown */}
          <FilterSelect
            className='w-full xmd:w-auto xmd:min-w-[130px]'
            value={typeFilter}
            placeholder={t("teacher.all_types")}
            options={[
              { value: "part_time", label: t("teacher.type_part_time") },
              { value: "full_time", label: t("teacher.type_full_time") },
              { value: "assistant", label: t("teacher.type_assistant") },
              { value: "freelancer", label: t("teacher.type_freelancer") },
            ]}
            onChange={(v) => {
              setTypeFilter(v);
              setParams((p: any) => ({ ...p, page: 1 }));
            }}
          />

          {/* Chi nhánh dropdown */}
          <FilterSelect
            className='w-full xmd:w-auto xmd:min-w-[150px]'
            value={branchFilter}
            placeholder={t("common.all_branches")}
            options={branches.map((branch) => ({
              value: String(branch.id),
              label: branch.name,
            }))}
            onChange={(v) => {
              setBranchFilter(v);
              resetPage();
            }}
          />

          {/* Người quản lý */}
          <div className='w-full xmd:w-auto xmd:min-w-[170px] col-span-2 xmd:col-span-1'>
            <UserSelect
              value={managerFilter}
              selectedUser={selectedManager}
              placeholder={t("teacher.all_managers")}
              allowClear
              onChange={(id, user) => {
                setManagerFilter(id);
                setSelectedManager(user ?? null);
                resetPage();
              }}
            />
          </div>

          {/* Chuyên môn (multi-select) */}
          <div className='w-full xmd:w-auto xmd:min-w-[160px] col-span-2 xmd:col-span-1'>
            <MultiSelect
              options={skillOptions}
              value={skillsFilter}
              placeholder={t("teacher.all_skills")}
              onChange={(vals) => {
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
    </div>
  );
};

export default TeacherListPage;
