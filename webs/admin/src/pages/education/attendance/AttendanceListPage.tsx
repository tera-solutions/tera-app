/* Import: library */
import { useState } from "react";
import { useTranslation } from "react-i18next";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";

/* Import: pages */
import AttendanceFilter from "./containers/AttendanceFilter";
import AttendanceTable from "./containers/AttendanceTable";
import BulkAttendance from "./containers/BulkAttendance";

const AttendanceListPage = () => {
  const { t } = useTranslation();

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [keyword, setKeyword] = useState("");
  const [activeStatus, setActiveStatus] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>(
    [],
  );

  const resetPage = () => setParams((p: any) => ({ ...p, page: 1 }));

  const tableParams = {
    ...params,
    search: keyword || undefined,
    status: activeStatus || undefined,
  };

  return (
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList title={t("attendance.title")}>
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
        />

        <BulkAttendance
          selectedRowKeys={selectedRowKeys}
          onDone={() => setSelectedRowKeys([])}
        />

        <AttendanceTable
          params={tableParams}
          setParams={setParams}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </HeaderViewList>
    </div>
  );
};

export default AttendanceListPage;
