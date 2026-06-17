/* Import: library */
import { useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { IModalProps } from "@tera/commons/interfaces";
import { useStores } from "@tera/stores/useStores";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { useNavigate } from "react-router-dom";
import { BUSINESS_PAGE_URL } from "@tera/commons/constants/url";

/* Import: pages */
import UserSelect from "_common/components/UserSelect";
import SortSelect from "_common/components/SortSelect";
import BusinessTable from "./containers/BusinessTable";
import BusinessFormModal from "./BusinessFormModal";

const QUICK_SELECT_CLASS =
  "h-9 w-full border border-gray-300 bg-white rounded px-2 text-[13px] xmd:w-auto xmd:min-w-[150px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 cursor-pointer";

const BusinessListPage = observer(() => {
  const { t } = useTranslation();
  const { globalStore } = useStores();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [keyword, setKeyword] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [managerFilter, setManagerFilter] = useState("");
  const [selectedManager, setSelectedManager] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [modalData, setModalData] = useState<IModalProps>({
    open: false,
    type: "create",
    id: undefined,
  });

  const statusOptions = (globalStore.getOptions("business_status") ?? []).filter(
    (opt: any) => opt.value !== "suspended",
  );
  const statusTabs = [
    { key: "", label: t("common.all") },
    ...statusOptions.map((opt: any) => ({ key: opt.value, label: opt.label })),
  ];

  const tableParams = {
    ...params,
    search: keyword || undefined,
    status: activeStatus || undefined,
    manager_id: managerFilter || undefined,
    // inline "Ngày tạo" lọc đúng 1 ngày → gửi created_from = created_to = ngày chọn
    created_from: dateFilter || undefined,
    created_to: dateFilter || undefined,
    sort_by: sortBy || undefined,
    sort_dir: sortBy ? sortDir : undefined,
  };

  const sortOptions = [
    { value: "business_code", label: t("business.code") },
    { value: "name", label: t("business.name") },
    { value: "created_at", label: t("business.created_at") },
    { value: "status", label: t("business.status") },
  ];

  const resetPage = () => setParams((p: any) => ({ ...p, page: 1 }));

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    resetPage();
  };

  return (
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList
        title={t("business.title")}
        buttonAddRender={() => (
          <Button
            onClick={() =>
              isMobile
                ? navigate(BUSINESS_PAGE_URL.create.path)
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

        {/* Search + quick filters row */}
        <div className="relative z-20 grid grid-cols-2 gap-2 mb-3 xmd:flex xmd:flex-nowrap xmd:items-center">
          {/* Search input */}
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
              placeholder={t("business.search_placeholder")}
              className="w-full h-9 border border-gray-300 rounded pl-8 pr-3 text-[13px] bg-white focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500"
            />
          </div>

          {/* Người quản lý */}
          <div className="w-full xmd:w-auto xmd:min-w-[170px]">
            <UserSelect
              value={managerFilter}
              selectedUser={selectedManager}
              placeholder={t("business.all_managers")}
              allowClear
              onChange={(id, user) => {
                setManagerFilter(id);
                setSelectedManager(user ?? null);
                resetPage();
              }}
            />
          </div>

          {/* Ngày tạo */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              resetPage();
            }}
            title={t("business.created_at")}
            className={QUICK_SELECT_CLASS}
            style={{ color: dateFilter ? "#111827" : "#9ca3af" }}
          />

          {/* Sắp xếp */}
          <div className="w-full xmd:w-auto xmd:min-w-[170px]">
            <SortSelect
              options={sortOptions}
              sortBy={sortBy}
              sortDir={sortDir}
              placeholder={t("business.sort_by")}
              defaultDir="asc"
              onChange={(sb, sd) => {
                setSortBy(sb);
                setSortDir(sd);
                resetPage();
              }}
            />
          </div>
        </div>

        <BusinessTable
          params={tableParams}
          setParams={setParams}
          setModalData={setModalData}
        />
      </HeaderViewList>

      {modalData.open && (
        <BusinessFormModal
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

export default BusinessListPage;
