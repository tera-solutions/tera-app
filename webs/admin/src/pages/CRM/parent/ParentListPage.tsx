/* Import: library */
import { useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { IModalProps } from "@tera/commons/interfaces";
import { PARENT_PAGE_URL } from "@tera/commons/constants/url";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { BranchService } from "@tera/modules";

/* Import: pages */
import SortSelect from "_common/components/SortSelect";
import FilterSelect from "_common/components/FilterSelect";
import ParentTable from "./containers/ParentTable";
import ParentFormModal from "./ParentFormModal";

const ParentListPage = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { globalStore } = useStores();

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [activeStatus, setActiveStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [relationFilter, setRelationFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const [modalData, setModalData] = useState<IModalProps>({
    open: false,
    type: "create",
    id: undefined,
  });

  const { data: branchData } = BranchService.useBranchList({
    params: { page: 1, per_page: 100 },
  });
  const branches: any[] = branchData?.data?.items ?? [];

  const statusOptions = globalStore.getOptions("parent_status") ?? [];
  const relationOptions = globalStore.getOptions("guardian_relation") ?? [];

  const statusTabs = [
    { key: "", label: t("common.all") },
    ...statusOptions.map((o: any) => ({ key: o.value, label: o.label })),
  ];

  const tableParams = {
    ...params,
    search: keyword || undefined,
    status: activeStatus || undefined,
    relation: relationFilter || undefined,
    branch_id: branchFilter || undefined,
    sort_by: sortBy || undefined,
    sort_dir: sortBy ? sortDir : undefined,
  };

  const sortOptions = [
    { value: "code", label: t("parent.code") },
    { value: "name", label: t("parent.name") },
    { value: "created_at", label: t("parent.created_at") },
  ];

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    setParams((prev: any) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList
        title={t("parent.title")}
        buttonAddRender={() => (
          <Button
            onClick={() =>
              isMobile
                ? navigate(PARENT_PAGE_URL.create.path)
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
        <div className="grid grid-cols-2 gap-2 mb-3 xmd:flex xmd:flex-nowrap xmd:items-center">
          <div className="col-span-2 flex gap-2 items-center xmd:contents">
            <div className="relative flex-1 min-w-0 xmd:flex-1 xmd:order-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  setParams((p: any) => ({ ...p, page: 1 }));
                }}
                placeholder={t("parent.search_placeholder")}
                className="w-full h-9 border border-gray-300 rounded pl-8 pr-3 text-[13px] bg-white focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500"
              />
            </div>
            <div className="shrink-0 xmd:order-4">
              <SortSelect
                options={sortOptions}
                sortBy={sortBy}
                sortDir={sortDir}
                placeholder={t("parent.sort_by")}
                defaultDir="asc"
                onChange={(sb, sd) => {
                  setSortBy(sb);
                  setSortDir(sd);
                  setParams((p: any) => ({ ...p, page: 1 }));
                }}
              />
            </div>
          </div>

          {/* Quan hệ dropdown */}
          <FilterSelect
            className="w-full xmd:w-auto xmd:min-w-[120px] xmd:order-2"
            value={relationFilter}
            placeholder={t("parent.all_relations")}
            options={relationOptions.map((opt: any) => ({
              value: opt.value,
              label: opt.label,
            }))}
            onChange={(v) => {
              setRelationFilter(v);
              setParams((p: any) => ({ ...p, page: 1 }));
            }}
          />

          {/* Chi nhánh dropdown */}
          <FilterSelect
            className="w-full xmd:w-auto xmd:min-w-[150px] xmd:order-3"
            value={branchFilter}
            placeholder={t("common.all_branches")}
            options={branches.map((branch) => ({
              value: String(branch.id),
              label: branch.name,
            }))}
            onChange={(v) => {
              setBranchFilter(v);
              setParams((p: any) => ({ ...p, page: 1 }));
            }}
          />
        </div>

        <ParentTable
          params={tableParams}
          setParams={setParams}
          setModalData={setModalData}
        />
      </HeaderViewList>

      {modalData.open && (
        <ParentFormModal
          open={modalData.open}
          type={modalData.type}
          id={modalData?.id}
          onClose={() =>
            setModalData({ open: false, type: "create", id: undefined })
          }
        />
      )}
    </div>
  );
});

export default ParentListPage;
