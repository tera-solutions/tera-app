/* Import: library */
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";
import FilterButton from "@tera/components/dof/FilterButton";
import { IModalProps } from "@tera/commons/interfaces";
import { ROOM_PAGE_URL } from "@tera/commons/constants/url";
import useIsMobile from "@tera/commons/hooks/useIsMobile";

/* Import: services */
import { BranchService } from "@tera/modules";

/* Import: pages */
import SearchBar from "_common/components/SearchBar";
import RoomFilter from "./containers/RoomFilter";
import RoomFilterModal from "./containers/RoomFilterModal";
import RoomTable from "./containers/RoomTable";
import RoomFormModal from "./RoomFormModal";
import { ROOM_TYPES } from "./_interface";

const RoomListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [activeStatus, setActiveStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [branchId, setBranchId] = useState("");
  const [roomType, setRoomType] = useState("");
  const [sortBy, setSortBy] = useState("room_code");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const activeFilterCount = (branchId ? 1 : 0) + (roomType ? 1 : 0);

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
        navigate(ROOM_PAGE_URL.update.path(id));
      else if (type === "detail" && id != null)
        navigate(ROOM_PAGE_URL.detail.path(id));
      else navigate(ROOM_PAGE_URL.create.path);
    }
  }, [isMobile, modalData, navigate]);

  const resetPage = () => setParams((p: any) => ({ ...p, page: 1 }));

  const { data: branchData } = BranchService.useBranchList({
    params: { page: 1, per_page: 100 },
  });
  const branchOptions = useMemo(
    () =>
      (branchData?.data?.items ?? []).map((b: any) => ({
        value: String(b.id),
        label: b.name,
      })),
    [branchData],
  );

  const typeOptions = ROOM_TYPES.map((type) => ({
    value: type,
    label: t(`room.type_${type}`),
  }));

  const tableParams = {
    ...params,
    search: keyword || undefined,
    status: activeStatus || undefined,
    branch_id: branchId || undefined,
    room_type: roomType || undefined,
    sort_by: sortBy || undefined,
    sort_dir: sortBy ? sortDir : undefined,
  };

  const statusTabs = [
    { key: "", label: t("common.all") },
    { key: "active", label: t("room.status_active") },
    { key: "inactive", label: t("room.status_inactive") },
    { key: "maintenance", label: t("room.status_maintenance") },
  ];

  return (
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList
        title={t("room.title")}
        buttonAddRender={() => (
          <Button
            onClick={() =>
              isMobile
                ? navigate(ROOM_PAGE_URL.create.path)
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
          <div className="flex items-center gap-2 xmd:contents">
            <SearchBar
              className="flex-1 min-w-0 xmd:min-w-[140px]"
              value={keyword}
              placeholder={t("room.search_placeholder")}
              onChange={(v) => {
                setKeyword(v);
                resetPage();
              }}
            />
            <FilterButton
              onClick={() => setFilterModalOpen(true)}
              count={activeFilterCount}
            />

            <RoomFilter
              branchOptions={branchOptions}
              typeOptions={typeOptions}
              branch={branchId}
              type={roomType}
              sortBy={sortBy}
              sortDir={sortDir}
              onBranchChange={(v) => {
                setBranchId(v);
                resetPage();
              }}
              onTypeChange={(v) => {
                setRoomType(v);
                resetPage();
              }}
              onSortChange={(by, dir) => {
                setSortBy(by);
                setSortDir(dir);
                resetPage();
              }}
            />
          </div>
        </div>

        <RoomTable
          params={tableParams}
          setParams={setParams}
          setModalData={setModalData}
        />
      </HeaderViewList>

      {modalData.open && (
        <RoomFormModal
          open={modalData.open}
          type={modalData.type}
          id={modalData.id}
          onClose={() =>
            setModalData({ open: false, type: "create", id: undefined })
          }
        />
      )}

      <RoomFilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        branchOptions={branchOptions}
        typeOptions={typeOptions}
        baseParams={{
          search: keyword || undefined,
          status: activeStatus || undefined,
        }}
        value={{ branchId, roomType }}
        onApply={(v) => {
          setBranchId(v.branchId);
          setRoomType(v.roomType);
          resetPage();
        }}
      />
    </div>
  );
};

export default RoomListPage;
