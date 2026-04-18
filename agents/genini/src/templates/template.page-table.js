module.exports = ({ Entity, ENTITY, moduleName, fields }) => {
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
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DropdownItem, PaginationProps } from "tera-dls";

/* Import: packages */
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";
import { TableTera } from "@tera/components/dof";
import useConfirm from "@tera/commons/hooks/useConfirm";

/* Import: services */
import { ${Entity}Service } from "@tera/modules";
import { ${ENTITY.toUpperCase()}_PAGE_URL } from "@tera/commons/constants/url";

/* Import: pages */
import { I${Entity} } from "pages/${moduleName}/${ENTITY}/_interface";

const ${Entity}Table = ({ params, setParams }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const { data, isPending } = ${Entity}Service.use${Entity}List(params);
  const { mutate: onDelete, isPending: isDeleting } =
    ${Entity}Service.use${Entity}Delete();

  const itemsAction = useCallback((item: IStudent): DropdownItem[] => [
    {
      key: "detail",
      label: t("button.detail"),
      onClick: () => navigate(${ENTITY.toUpperCase()}_PAGE_URL.detail.path(item.id)),
    },
    {
      key: "edit",
      label: t("button.edit"),
      onClick: () => navigate(${ENTITY.toUpperCase()}_PAGE_URL.update.path(item.id)),
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
  ], [t, navigate, confirm, onDelete]);

  const fields = [
    ${genColumns(fields)},
    {
      title: "",
      dataIndex: "id",
      render: (value: string, record: I${Entity}) => (
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

export default ${Entity}Table;
`;
};
