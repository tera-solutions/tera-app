/* Import: library */
import { useTranslation } from "react-i18next";
import { DropdownItem, PaginationProps } from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";


/* Import: packages */
import { TableTera } from "@tera/components/dof";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { ITableProps } from "@tera/commons/interfaces";

/* Import: services */
import { CourseService } from "@tera/modules";

/* Import: pages */
import { ICourse } from "pages/education/course/_interface";

const CourseTable = ({
  params,
  setParams,
  setModalData,
}: ITableProps<ICourse>) => {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const { data, isPending } =
    CourseService.useCourseList({ params });

  const { mutate: onDelete, isPending: isDeleting } =
    CourseService.useCourseDelete();

  const itemsAction = (item: ICourse): DropdownItem[] => {
    return [
      {
        key: "button.detail",
        label: t("button.detail"),
        onClick: () =>
          setModalData({ open: true, type: "detail", id: item?.id }),
      },
      {
        key: "button.edit",
        label: t("button.edit"),
        onClick: () =>
          setModalData({ open: true, type: "update", id: item?.id }),
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
      title: t("course.code"),
      dataIndex: "code",
      key: "code",
      width: 200,
    },
    {
      title: t("course.name"),
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: t("course.level_id"),
      dataIndex: "level_id",
      key: "level_id",
      width: 200,
    },
    {
      title: t("course.program_id"),
      dataIndex: "program_id",
      key: "program_id",
      width: 200,
    },
    {
      title: t("course.duration"),
      dataIndex: "duration",
      key: "duration",
      width: 100,
    },
    {
      title: t("course.price"),
      dataIndex: "price",
      key: "price",
      width: 200,
    },
    {
      title: "",
      dataIndex: "id",
      render: (_: string, record: ICourse) => (
        <ActionDropdown
          dropdownItems={itemsAction(record)}
          trigger="click"
        />
      ),
    },
  ];

  const handleChangePage: PaginationProps["onChange"] = (
    page,
    pageSize,
  ) => {
    const isDiffPageSize =
      params?.page && pageSize !== Number(params?.page);

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

export default CourseTable;
