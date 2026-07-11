/* Import: library */
import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { IModalProps } from "@tera/commons/interfaces";
import { LEAD_PAGE_URL } from "@tera/commons/constants/url";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { LeadService, CourseService } from "@tera/modules";

/* Import: pages */
import SearchBar from "_common/components/SearchBar";
import FilterSelect from "_common/components/FilterSelect";
import MultiSelect from "_common/components/MultiSelect";
import UserSelect from "_common/components/UserSelect";
import LeadTable from "./containers/LeadTable";
import LeadFormModal from "./LeadFormModal";

const LeadListPage = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { globalStore } = useStores();

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [activeStatus, setActiveStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState<string[]>([]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [ownerFilter, setOwnerFilter] = useState("");
  const [ownerUser, setOwnerUser] = useState<any>(undefined);

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
      if (type === "update" && id != null) navigate(LEAD_PAGE_URL.update.path(id));
      else if (type === "detail" && id != null) navigate(LEAD_PAGE_URL.detail.path(id));
      else navigate(LEAD_PAGE_URL.create.path);
    }
  }, [isMobile, modalData, navigate]);

  const statusOptions = globalStore.getOptions("lead_status") ?? [];
  const statusTabs = [
    { key: "", label: t("common.all") },
    ...statusOptions.map((o: any) => ({ key: o.value, label: o.label })),
  ];

  // Khóa học quan tâm — options từ catalog
  const { data: courseData } = CourseService.useCourseList({
    params: { page: 1, per_page: 100 },
  });
  const courseOptions = useMemo(
    () =>
      (courseData?.data?.items ?? []).map((c: any) => ({
        value: String(c.id),
        label: c.code ? `${c.code} - ${c.name}` : c.name,
      })),
    [courseData],
  );

  // Nguồn — distinct từ data lead (chưa có metadata/catalog nguồn)
  const { data: leadPeek } = LeadService.useLeadList({
    params: { page: 1, per_page: 100 },
  });
  const sourceOptions = useMemo(() => {
    const set = new Set<string>();
    (leadPeek?.data?.items ?? []).forEach((l: any) => {
      if (l.source) set.add(l.source);
    });
    return Array.from(set).map((s) => ({ value: s, label: s }));
  }, [leadPeek]);

  // Tag — distinct từ data lead (chưa có catalog tag)
  const tagOptions = useMemo(() => {
    const m = new Map<string, string>();
    (leadPeek?.data?.items ?? []).forEach((l: any) => {
      (l.tags ?? []).forEach((tg: any) => {
        const id = String(tg?.id ?? tg);
        if (id) m.set(id, tg?.name ?? tg?.tag_name ?? id);
      });
    });
    return Array.from(m).map(([value, label]) => ({ value, label }));
  }, [leadPeek]);

  const resetPage = () => setParams((p: any) => ({ ...p, page: 1 }));

  const tableParams = {
    ...params,
    search: keyword || undefined,
    status: activeStatus || undefined,
    source: sourceFilter || undefined,
    course_ids: courseFilter.length ? courseFilter.map(Number) : undefined,
    tag_ids: tagFilter.length ? tagFilter.map(Number) : undefined,
    owner_id: ownerFilter || undefined,
    // Mặc định sắp xếp tăng dần theo mã (id) khi mở màn
    sort_by: "id",
    sort_dir: "asc",
  };

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    resetPage();
  };

  return (
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList
        title={t("lead.title")}
        buttonAddRender={() => (
          <Button
            onClick={() =>
              isMobile
                ? navigate(LEAD_PAGE_URL.create.path)
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
        {statusTabs.length > 1 && (
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
        )}

        {/* Search + filters */}
        <div className="relative z-20 flex flex-wrap items-center gap-2 mb-3">
          <SearchBar
            className="w-full xmd:flex-1"
            value={keyword}
            placeholder={t("lead.search_placeholder")}
            onChange={(v) => {
              setKeyword(v);
              resetPage();
            }}
          />
          <div className="w-full grid grid-cols-2 gap-2 xmd:w-auto xmd:flex xmd:flex-wrap xmd:items-center xmd:ml-auto">
          <FilterSelect
            allowClear
            className="w-full xmd:w-[160px]"
            options={sourceOptions}
            value={sourceFilter}
            placeholder={t("lead.source")}
            onChange={(v) => {
              setSourceFilter(v);
              resetPage();
            }}
          />
          <div className="w-full xmd:w-[180px]">
            <MultiSelect
              options={courseOptions}
              value={courseFilter}
              placeholder={t("lead.courses")}
              onChange={(v) => {
                setCourseFilter(v);
                resetPage();
              }}
            />
          </div>
          <div className="w-full xmd:w-[160px]">
            <MultiSelect
              options={tagOptions}
              value={tagFilter}
              placeholder={t("lead.tags")}
              onChange={(v) => {
                setTagFilter(v);
                resetPage();
              }}
            />
          </div>
          <div className="w-full xmd:w-[180px]">
            <UserSelect
              value={ownerFilter}
              selectedUser={ownerUser}
              allowClear
              placeholder={t("lead.owner")}
              onChange={(id, user) => {
                setOwnerFilter(id ? String(id) : "");
                setOwnerUser(user);
                resetPage();
              }}
            />
          </div>
          </div>
        </div>

        <LeadTable
          params={tableParams}
          setParams={setParams}
          setModalData={setModalData}
        />
      </HeaderViewList>

      {modalData.open && (
        <LeadFormModal
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

export default LeadListPage;
