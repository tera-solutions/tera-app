/* Import: library */
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { DropdownItem, PaginationProps, notification } from "tera-dls";
import ActionDropdown from "@tera/components/web/TableColumnCustom/ActionDropdown";

/* Import: packages */
import { TableTera } from "@tera/components/dof";

/* Import: services */
import { AttendanceService } from "@tera/modules";

/* Import: pages */
import Pagination from "_common/components/Pagination";
import AttendanceStatus, { ATT_STATUS_KEYS } from "./AttendanceStatus";

// checkin_time là ISO UTC → lấy "HH:mm"
const fmtTime = (v?: string | null) => (v ? String(v).slice(11, 16) : "");
// session_date ISO UTC (nửa đêm giờ VN) → hiển thị theo local để không lệch ngày
const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString("vi-VN") : "";

interface IProps {
  params: any;
  setParams: (updater: any) => void;
  selectedRowKeys: (string | number)[];
  setSelectedRowKeys: (keys: (string | number)[]) => void;
}

const AttendanceTable = ({
  params,
  setParams,
  selectedRowKeys,
  setSelectedRowKeys,
}: IProps) => {
  const { t } = useTranslation();

  const { data, isPending } = AttendanceService.useAttendanceList({ params });
  const { mutate: upsert } = AttendanceService.useUpsertAttendance();

  const HeaderTitle = ({ children }: { children: ReactNode }) => (
    <span style={{ color: "#111827" }}>{children}</span>
  );
  const EMPTY = <span className="text-gray-300">—</span>;

  const pagination = data?.data?.pagination;
  const currentPage = pagination?.current_page || params?.page || 1;
  const totalItems = pagination?.total || 0;
  const perPage = Number(pagination?.per_page || params?.per_page || 20);

  // Tích hợp API Save Attendance — cập nhật trạng thái 1 bản ghi
  const handleSaveStatus = (id: number, status: string) => {
    upsert(
      { id, params: { status } },
      {
        onSuccess: () =>
          notification.success({ message: t("common.update_success") }),
        onError: (error: any) =>
          notification.error({
            message: error?.message || t("common.error_message"),
          }),
      },
    );
  };

  const itemsAction = (record: any): DropdownItem[] =>
    ATT_STATUS_KEYS.map((s) => ({
      key: s,
      label: t("attendance.mark_as", { status: t(`attendance.status_${s}`) }),
      onClick: () => handleSaveStatus(record.id, s),
    }));

  const columns = [
    {
      title: <HeaderTitle>{t("attendance.student")}</HeaderTitle>,
      key: "student",
      width: 240,
      render: (_: any, record: any) => (
        <div className="flex items-center gap-2">
          {record.avatar_url ? (
            <img
              src={record.avatar_url}
              alt=""
              className="w-8 h-8 rounded-full object-cover shrink-0 bg-gray-100"
            />
          ) : (
            <span className="w-8 h-8 rounded-full shrink-0 bg-blue-100 text-blue-600 text-[13px] font-medium flex items-center justify-center">
              {(record.student?.name ?? record.student?.full_name ?? "?")
                .charAt(0)
                .toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <div className="text-gray-800 truncate">
              {record.student?.name ?? record.student?.full_name ?? "—"}
            </div>
            {record.student?.code ? (
              <div className="text-gray-400 text-[12px]">
                {record.student.code}
              </div>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      title: <HeaderTitle>{t("attendance.session")}</HeaderTitle>,
      key: "session",
      width: 200,
      render: (_: any, record: any) =>
        record.session?.name
          ? `${record.session.name}${record.session?.session_no ? ` (#${record.session.session_no})` : ""}`
          : EMPTY,
    },
    {
      title: <HeaderTitle>{t("attendance.session_date")}</HeaderTitle>,
      key: "session_date",
      width: 130,
      align: "center" as const,
      render: (_: any, record: any) =>
        fmtDate(record.session?.session_date) || EMPTY,
    },
    {
      title: <HeaderTitle>{t("attendance.checkin_time")}</HeaderTitle>,
      key: "checkin_time",
      width: 120,
      align: "center" as const,
      render: (_: any, record: any) => fmtTime(record.checkin_time) || EMPTY,
    },
    {
      title: <HeaderTitle>{t("attendance.status")}</HeaderTitle>,
      key: "status",
      width: 140,
      align: "center" as const,
      render: (_: any, record: any) => (
        <AttendanceStatus
          status={record.status}
          statusLabel={record.status_label}
        />
      ),
    },
    {
      title: <HeaderTitle>{t("attendance.note")}</HeaderTitle>,
      key: "note",
      width: 200,
      render: (_: any, record: any) => record.note ?? EMPTY,
    },
    {
      title: <HeaderTitle>{t("button.action")}</HeaderTitle>,
      key: "action",
      width: 80,
      align: "center" as const,
      render: (_: any, record: any) => (
        <ActionDropdown dropdownItems={itemsAction(record)} trigger="click" />
      ),
    },
  ];

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
        rowKey={(record: any) => record.id}
        columns={columns}
        data={tableData}
        scroll={{ x: 1200, y: "calc(100vh - 380px)" }}
        loading={isPending}
        pagination={false}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys: (string | number)[]) => setSelectedRowKeys(keys),
        }}
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

export default AttendanceTable;
