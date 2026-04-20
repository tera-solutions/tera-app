module.exports = function templateTable({
  Entity,
  ENTITY,
  moduleName,
  fields,
}) {
  function genColumns(fields) {
    return fields
      .map(
        (col) => `
    {
      title: t("${ENTITY}.${col.key}"),
      dataIndex: "${col.key}",
      key: "${col.key}",
      width: ${col.width || 150},
    }`,
      )
      .join(",");
  }
  return `/* Import: library */
import { useTranslation } from "react-i18next";
import { DropdownItem, PaginationProps } from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";


/* Import: packages */
import { TableTera } from "@tera/components/dof";
import useConfirm from "@tera/commons/hooks/useConfirm";
import { ITableProps } from "@tera/commons/interfaces";

/* Import: services */
import { ${Entity}Service } from "@tera/modules";

/* Import: pages */
import { I${Entity} } from "pages/${moduleName}/${ENTITY}/_interface";

const ${Entity}Table = ({
  params,
  setParams,
  setModalData,
}: ITableProps<I${Entity}>) => {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const { data, isPending } =
    ${Entity}Service.use${Entity}List({ params });

  const { mutate: onDelete, isPending: isDeleting } =
    ${Entity}Service.use${Entity}Delete();

  const itemsAction = (item: I${Entity}): DropdownItem[] => {
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
${genColumns(fields)},
    {
      title: "",
      dataIndex: "id",
      render: (_: string, record: I${Entity}) => (
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

export default ${Entity}Table;
`;
};
