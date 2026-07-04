/* Import: library */
import { ReactNode, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DropdownItem, Modal, PaginationProps, notification } from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

/* Import: packages */
import { TableTera } from "@tera/components/dof";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { ITableProps } from "@tera/commons/interfaces";
import { LEAD_PAGE_URL } from "@tera/commons/constants/url";
import { useStores } from "@tera/stores/useStores";

/* Import: services */
import { LeadService, UserService } from "@tera/modules";

/* Import: pages */
import Pagination from "_common/components/Pagination";
import { ILead } from "pages/CRM/lead/_interface";

// Trạng thái "tạm ngưng" của lead (suspend endpoint đặt lead về status này)
const SUSPENDED_STATUS = "inactive";

const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString("vi-VN") : "";

const LeadTable = observer(
  ({ params, setParams, setModalData }: ITableProps<ILead>) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const { globalStore } = useStores();

    const { data, isPending } = LeadService.useLeadList({ params });

    // owner trong list chỉ có id (owner.name có thể null) → resolve tên qua danh sách user
    const { data: userData } = UserService.useUserList({
      params: { page: 1, per_page: 100 },
    });
    const userMap = useMemo(() => {
      const m = new Map<number, string>();
      (userData?.data?.items ?? []).forEach((u: any) =>
        m.set(Number(u.id), u.full_name ?? u.name ?? u.username),
      );
      return m;
    }, [userData]);

    const { mutate: onSuspend, isPending: isSuspending } =
      LeadService.useLeadSuspend();
    const { mutate: onRestore, isPending: isRestoring } =
      LeadService.useLeadRestore();

    const [pendingSuspend, setPendingSuspend] = useState<ILead | null>(null);
    const [reason, setReason] = useState("");
    const [note, setNote] = useState("");

    const handleCopy = (code?: string) => {
      if (!code) return;
      navigator.clipboard?.writeText(code);
      notification.success({ message: t("lead.code_copied") });
    };

    const handleRestore = (record: ILead) => {
      onRestore(
        { id: record.id, params: {} },
        {
          onError: (error: any) =>
            notification.error({
              message: error?.message || t("common.error_message"),
            }),
        },
      );
    };

    const handleConfirmSuspend = () => {
      if (!pendingSuspend) return;
      onSuspend(
        { id: pendingSuspend.id, params: { reason, note: note || undefined } },
        {
          onSuccess: () => setPendingSuspend(null),
          onError: (error: any) =>
            notification.error({
              message: error?.message || t("common.error_message"),
            }),
        },
      );
    };

    const itemsAction = (record: ILead): DropdownItem[] => {
      const actions: DropdownItem[] = [
        {
          key: "detail",
          label: t("button.detail"),
          onClick: () =>
            isMobile
              ? navigate(LEAD_PAGE_URL.detail.path(record.id as number))
              : setModalData({ open: true, type: "detail", id: record?.id }),
        },
        {
          key: "edit",
          label: t("button.edit"),
          onClick: () =>
            isMobile
              ? navigate(LEAD_PAGE_URL.update.path(record.id as number))
              : setModalData({ open: true, type: "update", id: record?.id }),
        },
      ];
      if (record.status === SUSPENDED_STATUS) {
        actions.push({
          key: "restore",
          label: t("lead.restore"),
          onClick: () => handleRestore(record),
        });
      } else {
        actions.push({
          key: "suspend",
          label: t("lead.suspend"),
          onClick: () => {
            setReason("");
            setNote("");
            setPendingSuspend(record);
          },
        });
      }
      return actions;
    };

    const HeaderTitle = ({ children }: { children: ReactNode }) => (
      <span style={{ color: "#111827" }}>{children}</span>
    );

    const dash = <span className="text-gray-300">—</span>;

    // Lấy danh sách tên từ mảng lồng (guardians/students/courses) — đọc defensive.
    const nameList = (arr: any[] | undefined, keys: string[]) => {
      const list = arr ?? [];
      if (list.length === 0) return dash;
      const names = list
        .map((it) => {
          for (const k of keys) if (it?.[k]) return it[k];
          if (it?.student) return it.student.name ?? it.student.full_name;
          if (it?.course) return it.course.name;
          return undefined;
        })
        .filter(Boolean);
      return names.length ? (
        <span className="line-clamp-2">{names.join(", ")}</span>
      ) : (
        <span className="text-gray-400">{list.length}</span>
      );
    };

    const CopyCodeIcon = ({ code }: { code?: string }) =>
      code ? (
        <button
          type="button"
          title={t("lead.copy_code")}
          onClick={() => handleCopy(code)}
          className="text-gray-400 hover:text-blue-500 transition-colors shrink-0 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </button>
      ) : null;

    const columns = [
      {
        title: <HeaderTitle>{t("lead.contact_date")}</HeaderTitle>,
        key: "contact_date",
        width: 120,
        align: "center" as const,
        render: (_: any, record: ILead) => {
          const v = (record as any).last_contacted_at ?? record.created_at;
          return v ? fmtDate(v) : dash;
        },
      },
      {
        title: <HeaderTitle>{t("lead.status")}</HeaderTitle>,
        dataIndex: "status",
        key: "status",
        width: 130,
        align: "center" as const,
        render: (status: string) => {
          if (!status) return dash;
          const item = globalStore.getMetaItem("lead_status", status);
          return (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-medium"
              style={{
                color: item?.color ?? "#6b7280",
                backgroundColor: item?.backgroundColor ?? "#f3f4f6",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: item?.color ?? "#6b7280" }}
              />
              {item?.label ?? status}
            </span>
          );
        },
      },
      {
        title: <HeaderTitle>{t("lead.code")}</HeaderTitle>,
        dataIndex: "code",
        key: "code",
        width: 130,
        render: (value: string) =>
          value ? (
            <div className="flex items-center gap-1.5">
              <span>{value}</span>
              <CopyCodeIcon code={value} />
            </div>
          ) : (
            dash
          ),
      },
      {
        title: <HeaderTitle>{t("lead.customer")}</HeaderTitle>,
        dataIndex: "name",
        key: "name",
        width: 170,
        render: (value: string) => value ?? dash,
      },
      {
        title: <HeaderTitle>{t("lead.gender")}</HeaderTitle>,
        dataIndex: "gender",
        key: "gender",
        width: 100,
        render: (value: string) =>
          value ? globalStore.getMetaLabel("gender", value) : dash,
      },
      {
        title: <HeaderTitle>{t("lead.dob")}</HeaderTitle>,
        dataIndex: "dob",
        key: "dob",
        width: 120,
        render: (value: string) => (value ? fmtDate(value) : dash),
      },
      {
        title: <HeaderTitle>{t("lead.email")}</HeaderTitle>,
        dataIndex: "email",
        key: "email",
        width: 180,
        render: (value: string) => value ?? dash,
      },
      {
        title: <HeaderTitle>{t("lead.phone")}</HeaderTitle>,
        dataIndex: "phone",
        key: "phone",
        width: 150,
        render: (value: string) =>
          value ? (
            <a
              href={`tel:${value}`}
              className="inline-flex items-center gap-1.5 text-blue-600 hover:underline"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {value}
            </a>
          ) : (
            dash
          ),
      },
      {
        title: <HeaderTitle>{t("lead.guardians")}</HeaderTitle>,
        key: "guardians",
        width: 170,
        render: (_: any, record: ILead) =>
          nameList(record.guardians, ["full_name", "name"]),
      },
      {
        title: <HeaderTitle>{t("lead.students")}</HeaderTitle>,
        key: "students",
        width: 170,
        render: (_: any, record: ILead) =>
          nameList(record.students, ["name", "full_name"]),
      },
      {
        title: <HeaderTitle>{t("lead.source")}</HeaderTitle>,
        dataIndex: "source",
        key: "source",
        width: 120,
        render: (value: string) => value ?? dash,
      },
      {
        title: <HeaderTitle>{t("lead.tags")}</HeaderTitle>,
        key: "tags",
        width: 160,
        render: (_: any, record: ILead) => {
          const list = record.tags ?? [];
          if (list.length === 0) return dash;
          return (
            <div className="flex flex-wrap gap-1">
              {list.map((tg: any, i: number) => (
                <span
                  key={tg?.id ?? i}
                  className="px-1.5 py-0.5 rounded text-[11px]"
                  style={{
                    color: tg?.color ?? "#4338ca",
                    backgroundColor: tg?.backgroundColor ?? "#e0e7ff",
                  }}
                >
                  {tg?.name ?? tg?.tag_name ?? tg}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        title: <HeaderTitle>{t("lead.courses")}</HeaderTitle>,
        key: "courses",
        width: 180,
        render: (_: any, record: ILead) =>
          nameList(record.courses, ["name", "course_name"]),
      },
      {
        title: <HeaderTitle>{t("lead.owner")}</HeaderTitle>,
        key: "owner",
        width: 180,
        render: (_: any, record: ILead) => {
          const name =
            record.owner?.full_name ??
            record.owner?.name ??
            (record.owner_id != null
              ? userMap.get(Number(record.owner_id))
              : undefined);
          if (!name) return dash;
          return (
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-[11px] font-semibold flex items-center justify-center shrink-0">
                {name.charAt(0).toUpperCase()}
              </span>
              <span className="truncate">{name}</span>
            </div>
          );
        },
      },
      {
        title: <HeaderTitle>{t("button.action")}</HeaderTitle>,
        key: "action",
        width: 80,
        align: "center" as const,
        render: (_: any, record: ILead) => (
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
      <>
        <div style={{ width: "100%", overflowX: "auto", colorScheme: "light" }}>
          <TableTera
            rowKey={(record: ILead) => record.id}
            columns={columns}
            data={tableData}
            scroll={{ x: "max-content", y: "calc(100vh - 340px)" }}
            loading={isPending || isRestoring}
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

        <Modal
          title={t("lead.suspend_title")}
          open={!!pendingSuspend}
          onCancel={() => setPendingSuspend(null)}
          closeIcon={false}
          centered
          width={isMobile ? "92%" : 500}
          className="max-w-[500px]!"
          footer={
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingSuspend(null)}
                className="px-4 py-1.5 text-[13px] border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                {t("button.cancel")}
              </button>
              <button
                type="button"
                onClick={handleConfirmSuspend}
                disabled={!reason.trim() || isSuspending}
                className="px-4 py-1.5 text-[13px] bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSuspending ? t("common.processing") : t("button.save")}
              </button>
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-600 font-medium">
                {t("common.reason")} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t("common.reason_placeholder")}
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 resize-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-600 font-medium">
                {t("lead.note")}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-2 text-[13px] focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500 resize-none"
              />
            </div>
          </div>
        </Modal>
      </>
    );
  },
);

export default LeadTable;
