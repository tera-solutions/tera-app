/* Import: library */
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { IModalProps } from "@tera/commons/interfaces";
import { useStores } from "@tera/stores/useStores";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { useLocation, useNavigate } from "react-router-dom";
import { BUSINESS_PAGE_URL } from "@tera/commons/constants/url";

/* Import: pages */
import SearchBar from "_common/components/SearchBar";
import BusinessFilter from "./containers/BusinessFilter";
import BusinessTable from "./containers/BusinessTable";
import BusinessFormModal from "./BusinessFormModal";

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
  const [sortBy, setSortBy] = useState("business_code");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

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
      if (type === "update" && id != null) navigate(BUSINESS_PAGE_URL.update.path(id));
      else if (type === "detail" && id != null) navigate(BUSINESS_PAGE_URL.detail.path(id));
      else navigate(BUSINESS_PAGE_URL.create.path);
    }
  }, [isMobile, modalData, navigate]);

  const statusOptions = (
    globalStore.getOptions("business_status") ?? []
  ).filter((opt: any) => opt.value !== "suspended");
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

  const resetPage = () => setParams((p: any) => ({ ...p, page: 1 }));

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    resetPage();
  };

  return (
    <div className='p-2.5 max-xmd:pb-[60px]'>
      <HeaderViewList
        title={t("business.title")}
        buttonAddRender={() => (
          <Button
            onClick={() =>
              isMobile
                ? navigate(BUSINESS_PAGE_URL.create.path)
                : setModalData({ open: true, type: "create" })
            }
            className='rounded-lg xmd:rounded-xsm shrink-0 px-2 py-1.5 xmd:py-1 cursor-pointer'
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
        <div className='relative z-20 flex flex-col gap-2 mb-3 xmd:flex-row xmd:items-center'>
          <SearchBar
            className='xmd:flex-1'
            value={keyword}
            placeholder={t("business.search_placeholder")}
            onChange={(v) => {
              setKeyword(v);
              resetPage();
            }}
          />

          <BusinessFilter
            manager={managerFilter}
            selectedManager={selectedManager}
            date={dateFilter}
            sortBy={sortBy}
            sortDir={sortDir}
            onManagerChange={(id, user) => {
              setManagerFilter(id);
              setSelectedManager(user ?? null);
              resetPage();
            }}
            onDateChange={(v) => {
              setDateFilter(v);
              resetPage();
            }}
            onSortChange={(sb, sd) => {
              setSortBy(sb);
              setSortDir(sd);
              resetPage();
            }}
          />
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
