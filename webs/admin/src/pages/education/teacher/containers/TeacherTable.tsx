/* Import: library */
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  PaginationProps,
  Tooltip,
  EyeOutlined,
  PencilSquareOutlined,
  TrashOutlined,
} from "tera-dls";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import useConfirm from "@tera/commons/hooks/useConfirm";

/* Import: services */
import { TeacherService } from "@tera/modules";
import { TEACHER_PAGE_URL } from "@tera/commons/constants/url";

/* Import: pages */
import { ITeacher } from "pages/education/teacher/_interface";

const TeacherTable = ({ params, setParams }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const confirmDialog = useConfirm();

  const { data, isPending } = TeacherService.useTeacherList({ params });
  const { mutate: onDelete, isPending: isDeleting } =
    TeacherService.useTeacherDelete();

  const cellStyle = { verticalAlign: "middle" as const };

  const fields = [
    {
      title: t("teacher.code"),
      dataIndex: "code",
      key: "code",
      width: 120,
      align: "left" as const,
      onCell: () => ({ style: cellStyle }),
      onHeaderCell: () => ({ style: cellStyle }),
    },
    {
      title: t("teacher.name"),
      dataIndex: "name",
      key: "name",
      width: 200,
      align: "left" as const,
      onCell: () => ({ style: cellStyle }),
      onHeaderCell: () => ({ style: cellStyle }),
    },
    {
      title: t("teacher.type"),
      dataIndex: "type",
      key: "type",
      width: 120,
      align: "left" as const,
      onCell: () => ({ style: cellStyle }),
      onHeaderCell: () => ({ style: cellStyle }),
    },
    {
      title: t("teacher.status"),
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "left" as const,
      onCell: () => ({ style: cellStyle }),
      onHeaderCell: () => ({ style: cellStyle }),
    },
    {
      title: t("teacher.salary_per_hour"),
      dataIndex: "salary_per_hour",
      key: "salary_per_hour",
      width: 150,
      align: "right" as const,
      onCell: () => ({ style: cellStyle }),
      onHeaderCell: () => ({ style: cellStyle }),
      render: (value: any) => {
        const num = parseFloat(value);
        return isNaN(num) ? value : num.toLocaleString("vi-VN");
      },
    },
    {
      title: t("button.action"),
      key: "action",
      width: 130,
      align: "center" as const,
      onCell: () => ({ style: { ...cellStyle, textAlign: "center" as const } }),
      onHeaderCell: () => ({ style: { ...cellStyle, textAlign: "center" as const } }),
      render: (_: any, record: ITeacher) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
          <Tooltip title={t("button.detail")}>
            <button
              type="button"
              onClick={() => navigate(TEACHER_PAGE_URL.detail.path(record.id))}
              className="flex h-7 w-7 items-center justify-center rounded text-blue-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
            >
              <EyeOutlined className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip title={t("button.edit")}>
            <button
              type="button"
              onClick={() => navigate(TEACHER_PAGE_URL.update.path(record.id))}
              className="flex h-7 w-7 items-center justify-center rounded text-amber-500 transition-colors hover:bg-amber-50 hover:text-amber-600"
            >
              <PencilSquareOutlined className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip title={t("button.delete")}>
            <button
              type="button"
              onClick={() => {
                confirmDialog.warning({
                  title: t("common.delete_confirm_title"),
                  content: t("common.delete_confirm_question"),
                  onOk: () => onDelete({ id: record.id }),
                });
              }}
              className="flex h-7 w-7 items-center justify-center rounded text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <TrashOutlined className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleChangePage: PaginationProps["onChange"] = (page, pageSize) => {
    const isDiffPageSize =
      params?.pageSize && pageSize !== Number(params?.pageSize);

    setParams((prev) => ({
      ...prev,
      page: isDiffPageSize ? 1 : page,
      pageSize,
    }));
  };

  // Handle multiple data formats
  const tableData = Array.isArray(data?.data?.data)
    ? data?.data?.data
    : Array.isArray(data?.data)
      ? data?.data
      : Array.isArray(data)
        ? data
        : [];

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <TableTera
        rowKey='code'
        columns={fields}
        data={tableData}
        loading={isPending || isDeleting}
        pagination={{
          onChange: handleChangePage,
          total: data?.data?.total || data?.total || 0,
          current:
            data?.data?.current_page || data?.current_page || params?.page || 1,
          pageSize: Number(
            data?.data?.per_page || data?.per_page || params?.pageSize || 20,
          ),
        }}
      />
    </div>
  );
};

export default TeacherTable;
