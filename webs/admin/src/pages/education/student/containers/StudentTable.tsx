/* Import: library */
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DropdownItem, PaginationProps } from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import { STUDENT_PAGE_URL } from "@tera/commons/constants/url";
import useConfirm from "@tera/commons/hooks/useConfirm";

/* Import: services */
import { StudentService } from "@tera/modules";

/* Import: pages */
import { IStudent } from "pages/education/student/_interface";

const StudentTable = ({ params, setParams }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const { data, isPending } = StudentService.useStudentList(params);
  const { mutate: onDelete, isPending: isDeleting } =
    StudentService.useStudentDelete();

  const itemsAction = (item: IStudent): DropdownItem[] => {
    return [
      {
        key: "button.detail",
        label: t("button.detail"),
        onClick: () => navigate(STUDENT_PAGE_URL.detail.path(item?.id)),
      },
      {
        key: "button.edit",
        label: t("button.edit"),
        onClick: () => navigate(STUDENT_PAGE_URL.update.path(item?.id)),
      },
      {
        key: "button.delete",
        label: <span className="text-red-500">{t("button.delete")}</span>,
        onClick: () => {
          confirm.warning({
            title: t("common.delete_confirm_title"),
            content: (
              <>
                <p>{t("common.delete_confirm_question")}</p>
              </>
            ),
            onOk: () => {
              onDelete({ id: item?.id });
            },
          });
        },
      },
    ];
  };

  const columns = [
    {
      title: t("student.code"),
      dataIndex: "code",
      key: "code",
      width: 100,
    },
    {
      title: t("student.name"),
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: t("student.level"),
      dataIndex: "level",
      key: "level",
      width: 200,
    },
    {
      title: t("student.status"),
      dataIndex: "status",
      key: "status",
      width: 200,
    },
    {
      title: "",
      dataIndex: "id",
      render: (value: string, record: IStudent) => (
        <ActionDropdown dropdownItems={itemsAction(record)} trigger="click" />
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

  return (
    <TableTera
      rowKey={(record: any) => record.id}
      columns={columns}
      data={data?.data?.data || []}
      loading={isPending || isDeleting}
      pagination={{
        onChange: handleChangePage,
        total: data?.data?.total,
        current: data?.data?.current_page,
        pageSize: Number(data?.data?.per_page),
        to: data?.data?.to,
        from: data?.data?.from,
      }}
    />
  );
};

export default StudentTable;
