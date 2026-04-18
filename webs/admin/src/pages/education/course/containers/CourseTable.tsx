/* Import: library */
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DropdownItem, PaginationProps } from "tera-dls";

/* Import: packages */
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";
import { TableTera } from "@tera/components/dof";
import useConfirm from "@tera/commons/hooks/useConfirm";

/* Import: services */
import { CourseService } from "@tera/modules";
import { COURSE_PAGE_URL } from "@tera/commons/constants/url";

/* Import: pages */
import { ICourse } from "pages/education/course/_interface";

const CourseTable = ({ params, setParams }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const { data, isPending } = CourseService.useCourseList(params);
  const { mutate: onDelete, isPending: isDeleting } =
    CourseService.useCourseDelete();

  const itemsAction = useCallback(
    (item: ICourse): DropdownItem[] => [
      {
        key: "detail",
        label: t("button.detail"),
        onClick: () => navigate(COURSE_PAGE_URL.detail.path(item.id)),
      },
      {
        key: "edit",
        label: t("button.edit"),
        onClick: () => navigate(COURSE_PAGE_URL.update.path(item.id)),
      },
      {
        key: "delete",
        label: <span className="text-red-500">{t("button.delete")}</span>,
        onClick: () => {
          confirm.warning({
            title: t("common.delete_confirm_title"),
            content: t("common.delete_confirm_question"),
            onOk: () => onDelete({ id: item.id }),
          });
        },
      },
    ],
    [t, navigate, confirm, onDelete],
  );

  const fields = [
    {
      title: t("course.code"),
      dataIndex: "code",
      key: "code",
      width: 100,
    },
    {
      title: t("course.name"),
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: t("course.level"),
      dataIndex: "level",
      key: "level",
      width: 200,
    },
    {
      title: t("course.status"),
      dataIndex: "status",
      key: "status",
      width: 200,
    },
    {
      title: "",
      dataIndex: "id",
      render: (value: string, record: ICourse) => (
        <ActionDropdown dropdownItems={itemsAction(record)} />
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
      rowKey="id"
      fields={fields}
      data={data?.data?.data || []}
      loading={isPending || isDeleting}
      pagination={{
        onChange: handleChangePage,
        total: data?.data?.total,
        current: data?.data?.current_page,
        pageSize: Number(data?.data?.per_page),
      }}
    />
  );
};

export default CourseTable;
