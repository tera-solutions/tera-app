import { useMemo, useState } from "react";
import { Button, notification, PlusOutlined } from "tera-dls";

import Card from "_common/components/Card";
import SearchInput from "_common/components/SearchInput";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import useConfirm from "_common/hooks/useConfirm";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { CourseService } from "@tera/modules/education";

import CourseFormModal, { type CourseRow } from "./CourseFormModal";

const formatVnd = (v: number | string) => `${Number(v ?? 0).toLocaleString("vi-VN")} ₫`;

const Courses = () => {
  const confirm = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CourseRow | null>(null);

  const [filters, setFilters] = useUrlFilters(
    {
      search: { type: "string", default: "" },
      page: { type: "number", default: 1 },
      per_page: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );

  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );

  const query = CourseService.useCourseList({
    params: { search: filters.search || undefined, page: filters.page, per_page: filters.per_page },
  });
  const rows = useMemo<CourseRow[]>(() => query.data?.data?.items ?? [], [query.data]);
  const total = query.data?.data?.pagination?.total ?? 0;

  const { mutate: deleteCourse } = CourseService.useCourseDelete();

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (course: CourseRow) => {
    setEditing(course);
    setModalOpen(true);
  };
  const handleDelete = (course: CourseRow) =>
    confirm.warning({
      title: "Xóa khóa học",
      content: `Xóa khóa học "${course.name}"?`,
      onOk: () =>
        deleteCourse(
          { id: course.id },
          {
            onSuccess: () => notification.success({ message: "Đã xóa khóa học" }),
            onError: (e: any) =>
              notification.error({ message: e?.data?.msg ?? "Không thể xóa (có thể đang có lớp)" }),
          },
        ),
    });

  const columns: TableColumn<CourseRow>[] = [
    {
      key: "name",
      title: "Khóa học",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-400">{row.code}</p>
        </div>
      ),
    },
    {
      key: "duration",
      title: "Thời lượng",
      render: (row) => <span className="text-sm text-slate-600">{row.duration_minutes} phút</span>,
    },
    {
      key: "price",
      title: "Học phí/buổi",
      render: (row) => <span className="text-sm text-slate-700">{formatVnd(row.price_per_lesson)}</span>,
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            row.is_active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
          }`}
        >
          {row.is_active ? "Đang mở" : "Đóng"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "",
      headerClassName: "px-4 py-3 text-right",
      cellClassName: "px-4 py-3 text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="text-xs font-medium text-brand hover:underline"
          >
            Sửa
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="text-xs font-medium text-rose-500 hover:underline"
          >
            Xóa
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Khóa học</h1>
          <p className="mt-0.5 text-sm text-slate-400">Quản lý danh mục khóa học của trung tâm.</p>
        </div>
        <Button icon={<PlusOutlined />} onClick={openCreate} className="bg-brand hover:bg-brand/80">
          Thêm khóa học
        </Button>
      </div>

      <Card>
        <SearchInput
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="Tìm khóa học..."
          wrapperClassName="flex-1 mb-3"
        />
        <Table
          columns={columns}
          data={rows}
          rowKey={(row) => row.id}
          isLoading={query.isLoading || query.isFetching}
          isError={query.isError}
          onRetry={() => query.refetch()}
          emptyText="Chưa có khóa học nào"
          minWidthClassName="min-w-[640px]"
        />
        <TablePagination
          total={total}
          page={filters.page}
          perPage={filters.per_page}
          unit="khóa học"
          onChange={(page, perPage) =>
            perPage !== filters.per_page
              ? setFilters({ per_page: perPage, page: 1 })
              : setFilters({ page })
          }
        />
      </Card>

      <CourseFormModal open={modalOpen} course={editing} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Courses;
