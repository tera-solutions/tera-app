/* Import: library */
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { DropdownItem, PaginationProps, notification } from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import useConfirm from "@tera/commons/hooks/useConfirm";

/* Import: services */
import { LevelService } from "@tera/modules";

/* Import: pages */
import Pagination from "_common/components/Pagination";
import { ILevel, LEVEL_STATUS_COLOR } from "../_interface";

interface IProps {
  params: any;
  setParams: (updater: any) => void;
  onView: (record: ILevel) => void;
  onEdit: (record: ILevel) => void;
}

const LevelTable = ({ params, setParams, onView, onEdit }: IProps) => {
  const { t } = useTranslation();
  const confirm = useConfirm();

  const { data, isPending } = LevelService.useLevelList({ params });
  const { mutate: suspend } = LevelService.useLevelSuspend();
  const { mutate: restore } = LevelService.useLevelRestore();

  const HeaderTitle = ({ children }: { children: ReactNode }) => (
    <span style={{ color: "#111827" }}>{children}</span>
  );
  const EMPTY = <span className="text-gray-300">—</span>;

  const statusLabel = (s: string) =>
    t(`level.status_${s}`, { defaultValue: s });

  const runAction = (fn: (p: { id: number }) => void, id: number) =>
    fn(
      { id },
      {
        onSuccess: () =>
          notification.success({ message: t("common.update_success") }),
        onError: (e: any) =>
          notification.error({
            message: e?.message || t("common.error_message"),
          }),
      } as any,
    );

  const itemsAction = (record: ILevel): DropdownItem[] => {
    const items: DropdownItem[] = [
      { key: "detail", label: t("button.detail"), onClick: () => onView(record) },
      { key: "edit", label: t("button.edit"), onClick: () => onEdit(record) },
    ];
    if (record.status === "active") {
      items.push({
        key: "suspend",
        label: t("button.suspend"),
        onClick: () =>
          confirm.warning({
            title: t("button.suspend"),
            content: t("level.confirm_suspend"),
            onOk: () => runAction(suspend, record.id),
          }),
      });
    } else {
      items.push({
        key: "restore",
        label: t("button.restore"),
        onClick: () =>
          confirm.warning({
            title: t("button.restore"),
            content: t("level.confirm_restore"),
            onOk: () => runAction(restore, record.id),
          }),
      });
    }
    return items;
  };

  const columns = [
    {
      title: <HeaderTitle>{t("level.code")}</HeaderTitle>,
      dataIndex: "level_code",
      key: "level_code",
      width: 120,
    },
    {
      title: <HeaderTitle>{t("level.name")}</HeaderTitle>,
      dataIndex: "level_name",
      key: "level_name",
      width: 180,
    },
    {
      title: <HeaderTitle>{t("level.course")}</HeaderTitle>,
      key: "course",
      width: 180,
      render: (_: any, r: ILevel) => r.course?.name ?? EMPTY,
    },
    {
      title: <HeaderTitle>{t("level.cefr")}</HeaderTitle>,
      dataIndex: "cefr_level",
      key: "cefr_level",
      width: 90,
      align: "center" as const,
      render: (v: string) => v || EMPTY,
    },
    {
      title: <HeaderTitle>{t("level.order")}</HeaderTitle>,
      dataIndex: "level_order",
      key: "level_order",
      width: 90,
      align: "center" as const,
      render: (v: number) => (v != null ? v : EMPTY),
    },
    {
      title: <HeaderTitle>{t("level.status")}</HeaderTitle>,
      key: "status",
      width: 130,
      align: "center" as const,
      render: (_: any, r: ILevel) => {
        const cfg = LEVEL_STATUS_COLOR[r.status];
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium"
            style={{
              color: cfg?.color ?? "#6b7280",
              backgroundColor: cfg?.backgroundColor ?? "#f3f4f6",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: cfg?.color ?? "#6b7280" }}
            />
            {statusLabel(r.status)}
          </span>
        );
      },
    },
    {
      title: <HeaderTitle>{t("button.action")}</HeaderTitle>,
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: any, record: ILevel) => (
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
        rowKey={(record: ILevel) => record.id}
        columns={columns}
        data={tableData}
        scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
        loading={isPending}
        pagination={false}
      />
      <Pagination
        total={totalItems}
        current={currentPage}
        pageSize={perPage}
        onChange={handleChangePage}
        pageSizeOptions={[20, 50, 100]}
      />
    </div>
  );
};

export default LevelTable;
