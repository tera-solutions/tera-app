import { useMemo, useState } from "react";
import {
  Button,
  notification,
  PlusOutlined,
  BuildingOffice2Outlined,
  CheckBadgeOutlined,
  HomeModernOutlined,
  SignalOutlined,
  UserGroupOutlined,
  WrenchScrewdriverOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import DonutStatsCard from "_common/components/DonutStatsCard";
import SearchInput from "_common/components/SearchInput";
import SortControl from "_common/components/SortControl";
import StatisticCard from "_common/components/StatisticCard";
import StatusTabs from "_common/components/StatusTabs";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useMeta } from "_common/hooks/useMeta";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { RoomService } from "@tera/modules/education";

import type { RoomSortBy, RoomSortDir, RoomStatus } from "./_interface";
import { ROOM_STATUS_META, ROOM_SUMMARY_SEGMENTS, SORT_OPTIONS } from "./constants";
import { toRoomSummary, toRooms } from "./_utils";
import RoomTable from "./components/RoomTable";
import RoomFilterSidebar, { type RoomFilterDraft } from "./components/RoomFilterSidebar";
import RoomFormModal from "./components/RoomFormModal";
import useConfirm from "_common/hooks/useConfirm";
import type { Room as RoomRow } from "./_interface";

const Room = () => {
  const confirm = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RoomRow | null>(null);
  const { mutate: deleteRoom } = RoomService.useRoomDelete();

  const openCreateRoom = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEditRoom = (room: RoomRow) => {
    setEditing(room);
    setModalOpen(true);
  };
  const handleDeleteRoom = (room: RoomRow) =>
    confirm.warning({
      title: "Xóa phòng học",
      content: `Xóa phòng "${room.name}"?`,
      onOk: () =>
        deleteRoom(
          { id: room.id },
          {
            onSuccess: () => notification.success({ message: "Đã xóa phòng" }),
            onError: (e: any) =>
              notification.error({ message: e?.data?.msg ?? "Không thể xóa (phòng đang được dùng)" }),
          },
        ),
    });
  const { getTabs } = useMeta();

  const [filters, setFilters] = useUrlFilters(
    {
      search: { type: "string", default: "" },
      status: { type: "string", default: "" as RoomStatus | "" },
      type: { type: "string", default: "", param: "room_type" },
      floor: { type: "string", default: "" },
      sort_by: { type: "string", default: "name" as RoomSortBy },
      sort_dir: { type: "string", default: "asc" as RoomSortDir },
      page: { type: "number", default: 1 },
      pageSize: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );
  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );
  const filterValues: RoomFilterDraft = {
    type: filters.type,
    floor: filters.floor,
  };

  const listQuery = RoomService.useRoomList({
    params: {
      page: filters.page,
      per_page: filters.pageSize,
      search: filters.search || undefined,
      sort_by: filters.sort_by,
      sort_dir: filters.sort_dir,
      filters: {
        status: filters.status || undefined,
        room_type: filters.type || undefined,
        floor: filters.floor || undefined,
      },
    },
  });
  const { isLoading, isFetching, isError, refetch } = listQuery;
  const pagination = listQuery.data?.data?.pagination;
  const rooms = useMemo(() => toRooms(listQuery.data?.data?.items), [listQuery.data]);
  const total = pagination?.total ?? rooms.length;
  const perPage = pagination?.per_page ?? filters.pageSize;

  const summaryQuery = RoomService.useRoomSummary();
  const summary = useMemo(() => toRoomSummary(summaryQuery.data?.data), [summaryQuery.data]);

  const floorOptions = useMemo(() => {
    const floors = Array.from(new Set(rooms.map((r) => r.floor).filter(Boolean)));
    return floors.map((floor) => ({ value: floor, label: floor }));
  }, [rooms]);

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) {
      setFilters({ pageSize: nextSize, page: 1 });
    } else {
      setFilters({ page: nextPage });
    }
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "",
      type: "",
      floor: "",
      sort_by: "name",
      sort_dir: "asc",
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });
  };

  const handleTabChange = (key: string) =>
    setFilters({ status: (key === "all" ? "" : key) as RoomStatus | "", page: 1 });

  const handleSort = (sortBy: RoomSortBy) => {
    if (filters.sort_by === sortBy) {
      setFilters({ sort_dir: filters.sort_dir === "asc" ? "desc" : "asc" });
    } else {
      setFilters({ sort_by: sortBy, sort_dir: "asc" });
    }
  };

  const toggleSortDir = () =>
    setFilters({ sort_dir: filters.sort_dir === "asc" ? "desc" : "asc" });

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Danh sách phòng học</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý và theo dõi tình trạng sử dụng phòng
          </p>
        </div>
        <Button icon={<PlusOutlined />} onClick={openCreateRoom} className="bg-brand hover:bg-brand/80">
          Thêm phòng
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        <StatisticCard
          icon={<HomeModernOutlined />}
          value={summary.total}
          label="Tổng số phòng"
          iconClassName="bg-sky-50 text-brand"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<CheckBadgeOutlined />}
          value={summary.in_use}
          label="Đang sử dụng"
          iconClassName="bg-emerald-50 text-emerald-500"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<BuildingOffice2Outlined />}
          value={summary.empty}
          label="Phòng trống"
          iconClassName="bg-sky-50 text-sky-500"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<WrenchScrewdriverOutlined />}
          value={summary.maintenance}
          label="Bảo trì"
          iconClassName="bg-amber-50 text-amber-500"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<UserGroupOutlined />}
          value={summary.total_students}
          label="Học viên"
          iconClassName="bg-violet-50 text-violet-500"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<SignalOutlined />}
          value={summary.online_rooms}
          label="Phòng online"
          iconClassName="bg-cyan-50 text-cyan-500"
          loading={summaryQuery.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        <Card>
          <StatusTabs
            className="mb-3"
            tabs={getTabs(ROOM_STATUS_META)}
            activeKey={filters.status || "all"}
            onChange={handleTabChange}
          />

          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Tìm kiếm phòng học, mã phòng..."
              wrapperClassName="flex-1"
            />
            <SortControl
              sortBy={filters.sort_by}
              sortDir={filters.sort_dir}
              options={SORT_OPTIONS}
              onSortByChange={(value) => handleSort(value as RoomSortBy)}
              onToggleDir={toggleSortDir}
            />
          </div>

          <RoomTable
            rooms={rooms}
            from={total === 0 ? 0 : (filters.page - 1) * perPage + 1}
            isLoading={isLoading || isFetching}
            isError={isError}
            onRetry={() => refetch()}
            onEdit={openEditRoom}
            onDelete={handleDeleteRoom}
          />

          <TablePagination
            total={total}
            page={filters.page}
            perPage={perPage}
            unit="phòng học"
            onChange={handleChangePage}
          />
        </Card>

        <div className="hidden flex-col gap-4 xl:flex">
          <RoomFilterSidebar
            draft={filterValues}
            floorOptions={floorOptions}
            onChange={(patch) => setFilters({ ...patch, page: 1 })}
            onReset={resetFilters}
          />

          <DonutStatsCard
            title="Thống kê"
            centerValue={String(summary.total)}
            centerCaption="Tổng số phòng"
            loading={summaryQuery.isLoading}
            legend={ROOM_SUMMARY_SEGMENTS.map(({ key, label, color, value }) => ({
              key,
              label,
              color,
              value: value(summary),
            }))}
          />
        </div>
      </div>

      <RoomFormModal open={modalOpen} room={editing} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Room;
