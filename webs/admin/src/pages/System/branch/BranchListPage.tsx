/* Import: library */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { IModalProps } from "@tera/commons/interfaces";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { BRANCH_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { BranchService, BusinessService } from "@tera/modules";

/* Import: pages */
import UserSelect from "_common/components/UserSelect";
import SortSelect from "_common/components/SortSelect";
import BranchTable from "./containers/BranchTable";
import BranchFormModal from "./BranchFormModal";

const QUICK_SELECT_CLASS =
  "h-9 w-full border border-gray-300 bg-white rounded px-2 text-[13px] xmd:w-auto xmd:min-w-[150px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 cursor-pointer";

const BranchListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [activeStatus, setActiveStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [businessFilter, setBusinessFilter] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [managerFilter, setManagerFilter] = useState("");
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [modalData, setModalData] = useState<IModalProps>({
    open: false,
    type: "create",
    id: undefined,
  });

  const { data: businessData } = BusinessService.useBusinessList({
    params: { page: 1, per_page: 100, status: "active" },
  });
  const businesses: any[] = businessData?.data?.items ?? [];

  // tỉnh/thành + người quản lý: derive distinct từ data branch (không có API master riêng)
  const { data: allBranchData } = BranchService.useBranchList({
    params: { page: 1, per_page: 100 },
  });
  const allBranches: any[] = allBranchData?.data?.items ?? [];
  const provinces: string[] = [
    ...new Set(allBranches.map((b) => b.province).filter(Boolean)),
  ] as string[];

  const tableParams = {
    ...params,
    search: keyword || undefined,
    status: activeStatus || undefined,
    business_id: businessFilter || undefined,
    province: provinceFilter || undefined,
    manager_id: managerFilter || undefined,
    sort_by: sortBy || undefined,
    sort_dir: sortBy ? sortDir : undefined,
  };

  const sortOptions = [
    { value: "code", label: t("branch.code") },
    { value: "name", label: t("branch.name") },
    { value: "created_at", label: t("branch.created_at") },
    { value: "status", label: t("branch.status") },
  ];

  const resetPage = () => setParams((p: any) => ({ ...p, page: 1 }));

  const statusTabs = [
    { key: "", label: t("common.all") },
    { key: "active", label: t("branch.status_active") },
    { key: "inactive", label: t("branch.status_inactive") },
  ];

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    setParams((prev: any) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList
        title={t("branch.title")}
        buttonAddRender={() => (
          <Button
            onClick={() =>
              isMobile
                ? navigate(BRANCH_PAGE_URL.create.path)
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

        {/* Search + filter row */}
        <div className="relative z-20 grid grid-cols-2 gap-2 mb-3 xmd:flex xmd:flex-nowrap xmd:items-center">
          <div className="relative col-span-2 min-w-0 xmd:flex-1">
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
              placeholder={t("branch.search_placeholder")}
              className="w-full h-9 border border-gray-300 rounded pl-8 pr-3 text-[13px] bg-white focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500"
            />
          </div>

          {/* Doanh nghiệp */}
          <select
            value={businessFilter}
            onChange={(e) => {
              setBusinessFilter(e.target.value);
              resetPage();
            }}
            className={QUICK_SELECT_CLASS}
            style={{ color: businessFilter ? "#111827" : "#9ca3af" }}
          >
            <option value="" style={{ color: "#111827" }}>
              {t("branch.all_business")}
            </option>
            {businesses.map((b) => (
              <option key={b.id} value={String(b.id)} style={{ color: "#111827" }}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Tỉnh/Thành */}
          <select
            value={provinceFilter}
            onChange={(e) => {
              setProvinceFilter(e.target.value);
              resetPage();
            }}
            className={QUICK_SELECT_CLASS}
            style={{ color: provinceFilter ? "#111827" : "#9ca3af" }}
          >
            <option value="" style={{ color: "#111827" }}>
              {t("branch.all_provinces")}
            </option>
            {provinces.map((p) => (
              <option key={p} value={p} style={{ color: "#111827" }}>
                {p}
              </option>
            ))}
          </select>

          {/* Người quản lý */}
          <div className="w-full xmd:w-auto xmd:min-w-[180px]">
            <UserSelect
              value={managerFilter}
              selectedUser={selectedManager}
              placeholder={t("branch.all_managers")}
              allowClear
              onChange={(id, user) => {
                setManagerFilter(id);
                setSelectedManager(user ?? null);
                resetPage();
              }}
            />
          </div>

          {/* Sắp xếp */}
          <div className="w-full xmd:w-auto xmd:min-w-[170px]">
            <SortSelect
              options={sortOptions}
              sortBy={sortBy}
              sortDir={sortDir}
              placeholder={t("branch.sort_by")}
              defaultDir="asc"
              onChange={(sb, sd) => {
                setSortBy(sb);
                setSortDir(sd);
                resetPage();
              }}
            />
          </div>
        </div>

        <BranchTable
          params={tableParams}
          setParams={setParams}
          setModalData={setModalData}
        />
      </HeaderViewList>

      {modalData.open && (
        <BranchFormModal
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

export default BranchListPage;
