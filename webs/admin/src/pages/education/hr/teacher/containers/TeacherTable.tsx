/* Import: library */
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
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
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { IModalProps } from "@tera/commons/interfaces";
import { TEACHER_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { TeacherService } from "@tera/modules";

/* Import: pages */
import { ITeacher } from "pages/education/hr/teacher/_interface";

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

  const typeLabels: Record<string, string> = {
    part_time: t("teacher.type_part_time"),
    full_time: t("teacher.type_full_time"),
    assistant: t("teacher.type_assistant"),
    freelance: t("teacher.type_freelance"),
  };

  const statusLabels: Record<string, string> = {
    active: t("teacher.status_active"),
    suspended: t("teacher.status_suspended"),
    resigned: t("teacher.status_resigned"),
  };
  const queryClient = useQueryClient();
  const confirmDialog = useConfirm();

  const isMobile = useIsMobile();

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

  const HeaderTitle = ({ children }: { children: ReactNode }) => (
    <span style={{ color: "#111827" }}>{children}</span>
  );

  const columns = [
    {
      title: <HeaderTitle>{t("teacher.code")}</HeaderTitle>,
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: <HeaderTitle>{t("teacher.name")}</HeaderTitle>,
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name: string, record: ITeacher) => (
        <div className='flex flex-col gap-0.5'>
          <span>{name}</span>
          {record.type && (
            <span className='inline-block w-fit px-1.5 py-0.5 text-xs rounded bg-blue-100 text-blue-700'>
              {typeLabels[record.type] ?? record.type}
            </span>
          )}
        </div>
      ),
    },
    {
      title: <HeaderTitle>{t("teacher.status")}</HeaderTitle>,
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status: string) => statusLabels[status] ?? status,
    },
    {
      title: <HeaderTitle>{t("teacher.salary_per_hour")}</HeaderTitle>,
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
      title: <HeaderTitle>{t("button.action")}</HeaderTitle>,
      key: "action",
      width: 100,
      align: "center" as const,
      render: (_: any, record: ITeacher) => (
        <div className='flex items-center justify-center gap-1'>
          <Tooltip title={t("button.detail")}>
            <button
              type='button'
              onClick={() =>
                isMobile
                  ? navigate(TEACHER_PAGE_URL.detail.path(record.id))
                  : setModalData({ open: true, type: "detail", id: record.id })
              }
              className='flex h-7 w-7 items-center justify-center rounded text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-600'
            >
              <EyeOutlined className='h-4 w-4' />
            </button>
          </Tooltip>
          <Tooltip title={t("button.edit")}>
            <button
              type='button'
              onClick={() =>
                isMobile
                  ? navigate(TEACHER_PAGE_URL.update.path(record.id))
                  : setModalData({ open: true, type: "update", id: record.id })
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

  const mobileKeys = ["code", "name", "status", "salary_per_hour", "action"];
  const visibleColumns = isMobile
    ? columns.filter((col) => mobileKeys.includes(col.key as string))
    : columns;

  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        colorScheme: "light",
      }}
    >
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
          pageSizeOptions: [20, 50, 100],
        }}
      />
    </div>
  );
};

export default TeacherTable;
