import { useMemo, useState } from "react";
import { Button, notification, PlusOutlined } from "tera-dls";

import Card from "_common/components/Card";
import SearchInput from "_common/components/SearchInput";
import SortControl from "_common/components/SortControl";
import StatusTabs from "_common/components/StatusTabs";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import useConfirm from "_common/hooks/useConfirm";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useMeta } from "_common/hooks/useMeta";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { TeacherService } from "@tera/modules/hr";

import type { Teacher, TeacherSortBy, TeacherSortDir } from "./_interface";
import { SORT_OPTIONS, TEACHER_STATUS_META } from "./constants";
import { toTeachers } from "./_utils";
import TeacherTable from "./components/TeacherTable";
import TeacherFormModal from "./components/TeacherFormModal";
import SuspendTeacherModal from "./components/SuspendTeacherModal";
import AdjustWalletModal from "./components/AdjustWalletModal";
import PayTeacherPayrollModal from "./components/PayTeacherPayrollModal";

const TeacherPage = () => {
  const confirm = useConfirm();
  const { getTabs } = useMeta();

  const [editing, setEditing] = useState<Teacher | null>(null);
  const [creating, setCreating] = useState(false);
  const [suspending, setSuspending] = useState<Teacher | null>(null);
  const [adjustingWallet, setAdjustingWallet] = useState<Teacher | null>(null);
  const [viewingPayroll, setViewingPayroll] = useState<Teacher | null>(null);

  const [filters, setFilters] = useUrlFilters(
    {
      search: { type: "string", default: "" },
      status: { type: "string", default: "" },
      sort_by: { type: "string", default: "full_name" as TeacherSortBy },
      sort_dir: { type: "string", default: "asc" as TeacherSortDir },
      page: { type: "number", default: 1 },
      per_page: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );
  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );

  const listParams = {
    search: filters.search || undefined,
    status: filters.status || undefined,
    sort_by: filters.sort_by,
    sort_dir: filters.sort_dir,
    page: filters.page,
    per_page: filters.per_page,
  };
  const listQuery = TeacherService.useTeacherList({ params: listParams });
  const { isLoading, isFetching, isError, refetch } = listQuery;
  const items = useMemo(() => toTeachers(listQuery.data?.data?.items), [listQuery.data]);
  const pagination = listQuery.data?.data?.pagination;
  const total = pagination?.total ?? items.length;
  const perPage = pagination?.per_page ?? filters.per_page;

  const { mutate: suspendTeacher, isPending: isSuspending } = TeacherService.useTeacherSuspend();
  const { mutate: restoreTeacher } = TeacherService.useTeacherRestore();

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) setFilters({ per_page: nextSize, page: 1 });
    else setFilters({ page: nextPage });
  };

  const handleTabChange = (key: string) => setFilters({ status: key === "all" ? "" : key, page: 1 });
  const toggleSortDir = () => setFilters({ sort_dir: filters.sort_dir === "asc" ? "desc" : "asc" });

  const handleSuspend = (reason: string) => {
    if (!suspending) return;
    suspendTeacher(
      { id: suspending.id, params: { reason } },
      {
        onSuccess: () => {
          notification.success({ message: "Đã tạm ngưng giáo viên" });
          setSuspending(null);
        },
        onError: (e: any) =>
          notification.error({ message: e?.data?.msg ?? "Không thể tạm ngưng giáo viên" }),
      },
    );
  };

  const handleRestore = (teacher: Teacher) => {
    confirm.warning({
      title: "Khôi phục giáo viên",
      content: (
        <p>
          Khôi phục giáo viên <b>{teacher.fullName}</b> về trạng thái đang làm việc?
        </p>
      ),
      onOk: () =>
        restoreTeacher(
          { id: teacher.id, params: {} },
          {
            onSuccess: () => notification.success({ message: "Đã khôi phục giáo viên" }),
            onError: (e: any) =>
              notification.error({ message: e?.data?.msg ?? "Không thể khôi phục giáo viên" }),
          },
        ),
    });
  };

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Giáo viên</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý hồ sơ, lương và trạng thái làm việc của giáo viên trong trung tâm
          </p>
        </div>
        <Button
          icon={<PlusOutlined />}
          onClick={() => setCreating(true)}
          className="whitespace-nowrap bg-brand hover:bg-brand/80"
        >
          Tạo giáo viên
        </Button>
      </div>

      <Card>
        <StatusTabs
          className="mb-3"
          tabs={getTabs(TEACHER_STATUS_META)}
          activeKey={filters.status || "all"}
          onChange={handleTabChange}
        />

        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Tìm theo tên, mã, email, SĐT..."
            wrapperClassName="flex-1"
          />
          <SortControl
            sortBy={filters.sort_by}
            sortDir={filters.sort_dir}
            options={SORT_OPTIONS}
            onSortByChange={(value) => setFilters({ sort_by: value as TeacherSortBy, page: 1 })}
            onToggleDir={toggleSortDir}
          />
        </div>

        <TeacherTable
          items={items}
          loading={isLoading}
          fetching={isFetching}
          isError={isError}
          onRetry={() => refetch()}
          onView={(teacher) => setEditing(teacher)}
          onEdit={(teacher) => setEditing(teacher)}
          onSuspend={(teacher) => setSuspending(teacher)}
          onRestore={handleRestore}
          onAdjustWallet={(teacher) => setAdjustingWallet(teacher)}
          onPayroll={(teacher) => setViewingPayroll(teacher)}
        />

        <TablePagination
          total={total}
          page={filters.page}
          perPage={perPage}
          unit="giáo viên"
          onChange={handleChangePage}
        />
      </Card>

      <TeacherFormModal open={creating || !!editing} teacher={editing} onClose={() => {
        setCreating(false);
        setEditing(null);
      }} />

      <SuspendTeacherModal
        open={!!suspending}
        isPending={isSuspending}
        onSubmit={handleSuspend}
        onClose={() => setSuspending(null)}
      />

      <AdjustWalletModal teacher={adjustingWallet} onClose={() => setAdjustingWallet(null)} />

      <PayTeacherPayrollModal teacher={viewingPayroll} onClose={() => setViewingPayroll(null)} />
    </div>
  );
};

export default TeacherPage;
