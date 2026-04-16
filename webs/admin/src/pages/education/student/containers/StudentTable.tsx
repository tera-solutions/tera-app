import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DropdownItem, PaginationProps } from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

import { StudentService } from "@tera/modules";
import { TableTera } from "@tera/components/dof";
import { STUDENT_PAGE_URL } from "@tera/commons/constants/url";

const StudentTable = ({ params, setParams }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data, isPending } = StudentService.useStudentList(params);
  const { mutate: onDelete, isPending: isDeleting } =
    StudentService.useStudentDelete();

  const itemsAction = (item): DropdownItem[] => {
    return [
      {
        key: 1,
        label: t("button.view"),
        onClick: () => navigate(STUDENT_PAGE_URL.view.path(item?.id)),
      },
      {
        key: 2,
        label: t("button.edit"),
        onClick: () => navigate(STUDENT_PAGE_URL.update.path(item?.id)),
      },
      {
        key: 3,
        label: <span className="text-red-500">{t("button.delete")}</span>,
        onClick: () => onDelete({ id: item?.id }),
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
      dataIndex: "action",
      render: (record: any) => (
        <ActionDropdown dropdownItems={itemsAction(record)} trigger="click" />
      ),
    },
  ];

  const handleChangePage: PaginationProps["onChange"] = (page, pageSize) => {
    const isDiffPageSize = params?.limit && pageSize !== Number(params?.limit);
    setParams({
      ...params,
      page: isDiffPageSize ? 1 : page,
      limit: pageSize,
    });
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
