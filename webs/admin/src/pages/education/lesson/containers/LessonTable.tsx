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
import { LessonService } from "@tera/modules";
import { LESSON_PAGE_URL } from "@tera/commons/constants/url";

/* Import: pages */
import { ILesson } from "pages/education/lesson/_interface";

const LessonTable = ({ params, setParams }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const { data, isPending } = LessonService.useLessonList(params);
  const { mutate: onDelete, isPending: isDeleting } =
    LessonService.useLessonDelete();

  const itemsAction = useCallback((item: ILesson): DropdownItem[] => [
    {
      key: "detail",
      label: t("button.detail"),
      onClick: () => navigate(LESSON_PAGE_URL.detail.path(item.id)),
    },
    {
      key: "edit",
      label: t("button.edit"),
      onClick: () => navigate(LESSON_PAGE_URL.update.path(item.id)),
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
    
    {
      title: t("lesson.code"),
      dataIndex: "code",
      key: "code",
      width: 100,
    },
    {
      title: t("lesson.name"),
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: t("lesson.level"),
      dataIndex: "level",
      key: "level",
      width: 200,
    },
    {
      title: t("lesson.status"),
      dataIndex: "status",
      key: "status",
      width: 200,
    },
    {
      title: "",
      dataIndex: "id",
      render: (value: string, record: ILesson) => (
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

export default LessonTable;
