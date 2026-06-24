/* Import: library */
import { ReactNode } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { DropdownItem, PaginationProps, notification } from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import useConfirm from "@tera/commons/hooks/useConfirm";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { ITableProps } from "@tera/commons/interfaces";
import { PARENT_STUDENT_PAGE_URL } from "@tera/commons/constants/url";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { ParentStudentService } from "@tera/modules";

/* Import: pages */
import { IParentStudentLink } from "pages/CRM/parent-student/_interface";

const ParentStudentTable = observer(
  ({ params, setParams, setModalData }: ITableProps<IParentStudentLink>) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const confirm = useConfirm();
    const queryClient = useQueryClient();
    const isMobile = useIsMobile();
    const { globalStore } = useStores();

    const { data, isPending } = ParentStudentService.useParentStudentList({
      params,
    });
    const { mutate: onDelete, isPending: isDeleting } =
      ParentStudentService.useParentStudentDelete();

    const itemsAction = (record: IParentStudentLink): DropdownItem[] => [
      {
        key: "detail",
        label: t("button.detail"),
        onClick: () =>
          isMobile
            ? navigate(PARENT_STUDENT_PAGE_URL.detail.path(record.id as number))
            : setModalData({ open: true, type: "detail", id: record?.id }),
      },
      {
        key: "edit",
        label: t("button.edit"),
        onClick: () =>
          isMobile
            ? navigate(PARENT_STUDENT_PAGE_URL.update.path(record.id as number))
            : setModalData({ open: true, type: "update", id: record?.id }),
      },
      {
        key: "delete",
        label: <span className="text-red-500">{t("button.delete")}</span>,
        onClick: () => {
          confirm.warning({
            title: t("common.delete_confirm_title"),
            content: t("common.delete_confirm_question"),
            onOk: () =>
              onDelete(
                { id: record?.id },
                {
                  onSuccess: () =>
                    queryClient.invalidateQueries({
                      queryKey: ["parent-student", "list"],
                    }),
                  onError: (error: any) =>
                    notification.error({
                      message: error?.message || t("common.error_message"),
                    }),
                },
              ),
          });
        },
      },
    ];

    const HeaderTitle = ({ children }: { children: ReactNode }) => (
      <span style={{ color: "#111827" }}>{children}</span>
    );

    const EMPTY = <span className="text-gray-300">—</span>;

    const renderBool = (value?: boolean | number) =>
      value ? (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-medium text-green-700 bg-green-50">
          {t("parent_student.yes")}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-medium text-gray-500 bg-gray-100">
          {t("parent_student.no")}
        </span>
      );

    const renderStatusBadge = (group: string, status?: string) => {
      if (!status) return EMPTY;
      const item = globalStore.getMetaItem(group, status);
      return (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium"
          style={{
            color: item?.color,
            backgroundColor: item?.backgroundColor,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: item?.color }}
          />
          {item?.label ?? status}
        </span>
      );
    };

    const columns = [
      {
        title: <HeaderTitle>{t("parent_student.parent_code")}</HeaderTitle>,
        key: "parent_code",
        width: 130,
        render: (_: any, record: IParentStudentLink) =>
          record.parent?.code ?? record.parent_code ?? EMPTY,
      },
      {
        title: <HeaderTitle>{t("parent_student.parent_name")}</HeaderTitle>,
        key: "parent",
        width: 200,
        render: (_: any, record: IParentStudentLink) =>
          record.parent?.name ?? EMPTY,
      },
      {
        title: <HeaderTitle>{t("parent_student.student_code")}</HeaderTitle>,
        key: "student_code",
        width: 130,
        render: (_: any, record: IParentStudentLink) =>
          record.student?.code ?? record.student_code ?? EMPTY,
      },
      {
        title: <HeaderTitle>{t("parent_student.student_name")}</HeaderTitle>,
        key: "student",
        width: 200,
        render: (_: any, record: IParentStudentLink) =>
          record.student?.name ?? EMPTY,
      },
      {
        title: <HeaderTitle>{t("parent_student.relation")}</HeaderTitle>,
        dataIndex: "relation",
        key: "relation",
        width: 130,
        render: (value: string) =>
          value
            ? globalStore.getMetaLabel("guardian_relation", value) || value
            : EMPTY,
      },
      {
        title: (
          <HeaderTitle>{t("parent_student.is_primary_contact")}</HeaderTitle>
        ),
        dataIndex: "is_primary_contact",
        key: "is_primary_contact",
        width: 130,
        align: "center" as const,
        render: (value: boolean | number) => renderBool(value),
      },
      {
        title: (
          <HeaderTitle>{t("parent_student.is_billing_contact")}</HeaderTitle>
        ),
        dataIndex: "is_billing_contact",
        key: "is_billing_contact",
        width: 140,
        align: "center" as const,
        render: (value: boolean | number) => renderBool(value),
      },
      {
        title: <HeaderTitle>{t("parent_student.parent_status")}</HeaderTitle>,
        key: "parent_status",
        width: 140,
        align: "center" as const,
        render: (_: any, record: IParentStudentLink) =>
          renderStatusBadge(
            "parent_status",
            record.parent_status ?? record.parent?.status,
          ),
      },
      {
        title: <HeaderTitle>{t("parent_student.student_status")}</HeaderTitle>,
        key: "student_status",
        width: 140,
        align: "center" as const,
        render: (_: any, record: IParentStudentLink) =>
          renderStatusBadge(
            "student_status",
            record.student_status ?? record.student?.status,
          ),
      },
      {
        title: <HeaderTitle>{t("parent_student.created_at")}</HeaderTitle>,
        dataIndex: "created_at",
        key: "created_at",
        width: 130,
        align: "center" as const,
        render: (value: string) =>
          value ? new Date(value).toLocaleDateString("vi-VN") : EMPTY,
      },
      {
        title: <HeaderTitle>{t("button.action")}</HeaderTitle>,
        key: "action",
        width: 80,
        align: "center" as const,
        render: (_: any, record: IParentStudentLink) => (
          <ActionDropdown dropdownItems={itemsAction(record)} trigger="click" />
        ),
      },
    ];

    const pagination = data?.data?.pagination;
    const currentPage = pagination?.current_page || params?.page || 1;
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

    return (
      <div style={{ width: "100%", overflowX: "auto", colorScheme: "light" }}>
        <TableTera
          rowKey={(record: IParentStudentLink) => record.id}
          columns={columns}
          data={tableData}
          scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
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
  },
);

export default ParentStudentTable;
