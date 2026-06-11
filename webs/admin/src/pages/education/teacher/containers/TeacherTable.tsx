/* Import: library */
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  PaginationProps,
  notification,
  Tooltip,
  EyeOutlined,
  PencilSquareOutlined,
  TrashOutlined,
} from "tera-dls";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { IModalProps } from "@tera/commons/interfaces";
import { TEACHER_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { TeacherService } from "@tera/modules";

/* Import: pages */
import { ITeacher } from "pages/education/teacher/_interface";

interface TeacherTableProps {
  params: any;
  setParams: (v: any) => void;
  setModalData: (v: IModalProps) => void;
}

const TeacherTable = ({
  params,
  setParams,
  setModalData,
}: TeacherTableProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const confirmDialog = useConfirm();

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 960);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 960px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const { data, isPending } = TeacherService.useTeacherList({ params });
  const { mutate: onDelete, isPending: isDeleting } =
    TeacherService.useTeacherDelete();

  const handleDelete = (record: ITeacher) => {
    confirmDialog.warning({
      title: t("common.delete_confirm_title"),
      content: t("common.delete_confirm_question"),
      onOk: () =>
        onDelete(
          { id: record.id },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["teacher", "list"] });
            },
            onError: (error: any) => {
              notification.error({
                message: error?.message || t("common.error_message"),
              });
            },
          },
        ),
    });
  };

  const columns = [
    {
      title: t("teacher.code"),
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: t("teacher.name"),
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, record: ITeacher) => (
        <div className='flex flex-col gap-0.5'>
          <span>{name}</span>
          {record.type && (
            <span className='inline-block w-fit px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-700'>
              {record.type}
            </span>
          )}
        </div>
      ),
    },
    {
      title: t("teacher.status"),
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
    },
    {
      title: t("teacher.salary_per_hour"),
      dataIndex: "salary_per_hour",
      key: "salary_per_hour",
      width: 150,
      align: "center" as const,
      render: (value: any) => {
        const num = parseFloat(value);
        return isNaN(num) ? value : num.toLocaleString("vi-VN");
      },
    },
    {
      title: t("button.action"),
      key: "action",
      width: 120,
      align: "center" as const,
      render: (_: any, record: ITeacher) => (
        <div className='flex items-center justify-center gap-1'>
          <Tooltip title={t("button.detail")}>
            <button
              type='button'
              onClick={() => navigate(TEACHER_PAGE_URL.detail.path(record.id))}
              className='flex h-7 w-7 items-center justify-center rounded text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-600'
            >
              <EyeOutlined className='h-4 w-4' />
            </button>
          </Tooltip>
          <Tooltip title={t("button.edit")}>
            <button
              type='button'
              onClick={() =>
                setModalData({ open: true, type: "update", id: record.id })
              }
              className='flex h-7 w-7 items-center justify-center rounded text-amber-500 transition-colors hover:bg-amber-50 hover:text-amber-600'
            >
              <PencilSquareOutlined className='h-4 w-4' />
            </button>
          </Tooltip>
          <Tooltip title={t("button.delete")}>
            <button
              type='button'
              onClick={() => handleDelete(record)}
              className='flex h-7 w-7 items-center justify-center rounded text-red-500 transition-colors hover:bg-red-50 hover:text-red-600'
            >
              <TrashOutlined className='h-4 w-4' />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const pagination = data?.data?.pagination;
  const currentPage = pagination?.current_page || params?.page || 1;
  const lastPage = pagination?.last_page || 1;
  const totalItems = pagination?.total || 0;
  const perPage = Number(pagination?.per_page || params?.per_page || 20);

  const handleChangePage: PaginationProps["onChange"] = (page, pageSize) => {
    setParams((prev: any) => {
      const prevPerPage = Number(prev?.per_page || 20);
      const isPageSizeChanged = pageSize !== prevPerPage;
      return {
        ...prev,
        page: isPageSizeChanged ? 1 : page,
        per_page: pageSize,
      };
    });
  };

  const tableData = data?.data?.items ?? [];

  const mobileKeys = ["code", "name", "salary_per_hour", "action"];
  const visibleColumns = isMobile
    ? columns.filter((col) => mobileKeys.includes(col.key as string))
    : columns;

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <TableTera
        rowKey='code'
        columns={visibleColumns}
        data={tableData}
        loading={isPending || isDeleting}
        pagination={{
          onChange: handleChangePage,
          total: totalItems,
          current: currentPage,
          pageSize: perPage,
        }}
      />

      {/* Mobile pagination — hidden on desktop */}
      {totalItems > 0 && (
        <div className='xmd:hidden flex items-center justify-between px-4 py-3 border-t border-gray-200'>
          <button
            type='button'
            onClick={() =>
              currentPage > 1 &&
              setParams((prev: any) => ({ ...prev, page: currentPage - 1 }))
            }
            disabled={currentPage <= 1}
            className='flex items-center gap-1 px-3 py-1.5 text-sm rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-50'
          >
            ← Trước
          </button>
          <span className='text-sm text-gray-600'>
            Trang {currentPage} / {lastPage}
          </span>
          <button
            type='button'
            onClick={() =>
              currentPage < lastPage &&
              setParams((prev: any) => ({ ...prev, page: currentPage + 1 }))
            }
            disabled={currentPage >= lastPage}
            className='flex items-center gap-1 px-3 py-1.5 text-sm rounded border border-gray-300 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed active:bg-gray-50'
          >
            Tiếp →
          </button>
        </div>
      )}
    </div>
  );
};

export default TeacherTable;
