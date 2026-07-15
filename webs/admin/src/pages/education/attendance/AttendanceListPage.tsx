/* Import: library */
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, ArrowDownTrayOutlined, notification } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";

/* Import: services */
import { AttendanceService, ClassSessionService } from "@tera/modules";

/* Import: pages */
import AttendanceFilter from "./containers/AttendanceFilter";
import AttendanceFilterModal from "./containers/AttendanceFilterModal";
import AttendanceTable from "./containers/AttendanceTable";
import BulkAttendance from "./containers/BulkAttendance";

const AttendanceListPage = () => {
  const { t } = useTranslation();

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [keyword, setKeyword] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [classId, setClassId] = useState("");
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [sessionId, setSessionId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    [],
  );

  const resetPage = () => setParams((p: any) => ({ ...p, page: 1 }));

  // Buổi học của lớp đang chọn (route lồng edu/class-room/:classId/session/list)
  // Lớp học KHÔNG cần fetch options ở đây — ClassSelect (SearchSelect) tự search server.
  const { data: sessionData } = ClassSessionService.useClassSessionList(
    { params: { class_id: classId, page: 1, per_page: 100 } as any },
    { enabled: !!classId },
  );
  const sessionOptions = useMemo(
    () =>
      // sort tăng dần theo session_no (backend trả desc mặc định)
      [...(sessionData?.data?.items ?? [])]
        .sort((a: any, b: any) => (a.session_no ?? 0) - (b.session_no ?? 0))
        .map((s: any) => ({
          value: String(s.id),
          label: s.name
            ? `${s.name}${s.session_no ? ` (#${s.session_no})` : ""}`
            : `#${s.session_no ?? s.id}`,
        })),
    [sessionData],
  );

  const filterCount =
    (classId ? 1 : 0) + (sessionId ? 1 : 0) + (dateFrom || dateTo ? 1 : 0);

  const tableParams = {
    ...params,
    search: keyword || undefined,
    status: activeStatus || undefined,
    class_id: classId || undefined,
    session_id: sessionId || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    sort_by: sortBy || undefined,
    sort_dir: sortBy ? sortDir : undefined,
  };

  // Xuất báo cáo CSV — body export chỉ nhận filter (KHÔNG có search, theo Postman)
  const { mutate: onExport, isPending: isExporting } =
    AttendanceService.useAttendanceExport();
  const handleExport = () => {
    onExport(
      {
        params: {
          status: activeStatus || undefined,
          class_id: classId || undefined,
          session_id: sessionId || undefined,
          date_from: dateFrom || undefined,
          date_to: dateTo || undefined,
        },
      },
      {
        onError: (error: any) =>
          notification.error({
            message: error?.message || t("common.error_message"),
          }),
      },
    );
  };

  return (
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList
        title={t("attendance.title")}
        buttonAddRender={() => (
          <Button
            onClick={handleExport}
            loading={isExporting}
            className="rounded-lg xmd:rounded-xsm shrink-0 px-2 py-1.5 xmd:py-1 cursor-pointer"
          >
            <div className="flex items-center gap-1 shrink-0">
              <ArrowDownTrayOutlined className="w-5 h-5" />
              <span>{t("attendance.export")}</span>
            </div>
          </Button>
        )}
      >
        <AttendanceFilter
          keyword={keyword}
          onChangeKeyword={(v) => {
            setKeyword(v);
            resetPage();
          }}
          activeStatus={activeStatus}
          onChangeStatus={(v) => {
            setActiveStatus(v);
            resetPage();
          }}
          sessionOptions={sessionOptions}
          classId={classId}
          selectedClass={selectedClass}
          sessionId={sessionId}
          onClassChange={(v, classRoom) => {
            setClassId(v);
            setSelectedClass(classRoom ?? null);
            setSessionId(""); // buổi học thuộc lớp cũ → xoá
            resetPage();
          }}
          onSessionChange={(v) => {
            setSessionId(v);
            resetPage();
          }}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onDateChange={(from, to) => {
            setDateFrom(from);
            setDateTo(to);
            resetPage();
          }}
          sortBy={sortBy}
          sortDir={sortDir}
          onSortChange={(by, dir) => {
            setSortBy(by);
            setSortDir(dir);
            resetPage();
          }}
          filterCount={filterCount}
          onOpenFilter={() => setFilterModalOpen(true)}
        />

        <BulkAttendance
          selectedRowKeys={selectedRowKeys}
          onDone={(remaining) => setSelectedRowKeys(remaining ?? [])}
        />

        <AttendanceTable
          params={tableParams}
          setParams={setParams}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </HeaderViewList>

      <AttendanceFilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        baseParams={{
          search: keyword || undefined,
          status: activeStatus || undefined,
        }}
        value={{ classId, selectedClass, sessionId, dateFrom, dateTo }}
        onApply={(v) => {
          setClassId(v.classId);
          setSelectedClass(v.selectedClass ?? null);
          setSessionId(v.sessionId);
          setDateFrom(v.dateFrom);
          setDateTo(v.dateTo);
          resetPage();
        }}
      />
    </div>
  );
};

export default AttendanceListPage;
