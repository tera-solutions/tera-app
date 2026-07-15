/* Import: library */
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { useStores } from "@tera/stores/useStores";
import FilterButton from "@tera/components/dof/FilterButton";

/* Import: pages */
import ClassSelect from "_common/components/ClassSelect";
import DateRangeFilter from "_common/components/DateRangeFilter";
import FilterSelect from "_common/components/FilterSelect";
import SortSelect from "_common/components/SortSelect";
import { ATT_STATUS_KEYS } from "./AttendanceStatus";

interface Option {
  value: string;
  label: string;
}

interface IProps {
  keyword: string;
  onChangeKeyword: (value: string) => void;
  activeStatus: string;
  onChangeStatus: (value: string) => void;
  sessionOptions: Option[];
  classId: string;
  selectedClass: any;
  sessionId: string;
  onClassChange: (value: string, classRoom?: any) => void;
  onSessionChange: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateChange: (from: string, to: string) => void;
  sortBy: string;
  sortDir: "asc" | "desc";
  onSortChange: (sortBy: string, sortDir: "asc" | "desc") => void;
  filterCount: number;
  onOpenFilter: () => void;
}

/**
 * Bộ lọc điểm danh: tab trạng thái (từ metadata attendance_status, fallback 4 trạng thái
 * cứng) + ô tìm kiếm theo mã/tên học viên + nút "Lọc" (mobile, mở modal) + khoảng
 * Ngày học (date_from/date_to — CHỈ desktop, mobile vào modal) + Sắp xếp (luôn hiện).
 */
const AttendanceFilter = observer(
  ({
    keyword,
    onChangeKeyword,
    activeStatus,
    onChangeStatus,
    sessionOptions,
    classId,
    selectedClass,
    sessionId,
    onClassChange,
    onSessionChange,
    dateFrom,
    dateTo,
    onDateChange,
    sortBy,
    sortDir,
    onSortChange,
    filterCount,
    onOpenFilter,
  }: IProps) => {
    const { t } = useTranslation();
    const { globalStore } = useStores();

    const metaOptions = globalStore.getOptions("attendance_status") ?? [];
    const statusOptions =
      metaOptions.length > 0
        ? metaOptions.map((o: any) => ({ key: o.value, label: o.label }))
        : ATT_STATUS_KEYS.map((s) => ({
            key: s,
            label: t(`attendance.status_${s}`),
          }));

    const statusTabs = [{ key: "", label: t("common.all") }, ...statusOptions];

    // sort_by backend hỗ trợ: status | checkin_time | created_at
    const sortOptions = [
      { value: "status", label: t("attendance.status") },
      { value: "checkin_time", label: t("attendance.checkin_time") },
      { value: "created_at", label: t("attendance.created_at") },
    ];

    return (
      <>
        {/* Status tabs */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-0.5 mt-2 scrollbar-none">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChangeStatus(tab.key)}
              className={`px-3 py-1 text-[13px] rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeStatus === tab.key
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + Lọc + Ngày học (desktop) + Sắp xếp */}
        <div className="flex flex-col gap-2 mb-3 xmd:flex-row xmd:items-center">
          <div className="flex items-center gap-2 xmd:contents">
            <div className="relative flex-1 min-w-0 xmd:flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                value={keyword}
                onChange={(e) => onChangeKeyword(e.target.value)}
                placeholder={t("attendance.search_placeholder")}
                className="w-full h-9 border border-gray-300 rounded pl-8 pr-3 text-[13px] bg-white focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-500"
              />
            </div>

            <FilterButton onClick={onOpenFilter} count={filterCount} />

            {/* Lớp + Buổi học + Ngày học — CHỈ desktop (mobile đưa vào modal "Lọc") */}
            <div className="hidden xmd:contents">
              {/* Lớp học — có ô tìm kiếm server (SearchSelect, giống UserSelect) */}
              <div className="flex-1 min-w-[150px] xmd:flex-none xmd:w-[200px]">
                <ClassSelect
                  allowClear
                  value={classId}
                  selectedClass={selectedClass}
                  placeholder={t("attendance.all_classes")}
                  onChange={onClassChange}
                />
              </div>
              {/* Buổi học phụ thuộc lớp — route lồng edu/class-room/:classId/session/list */}
              <FilterSelect
                allowClear
                className="flex-1 min-w-[130px] xmd:flex-none xmd:w-auto xmd:min-w-[140px]"
                value={sessionId}
                placeholder={
                  classId
                    ? t("attendance.all_sessions")
                    : t("attendance.select_class_first")
                }
                options={sessionOptions}
                onChange={onSessionChange}
                disabled={!classId}
              />
              <DateRangeFilter
                className="flex-1 xmd:flex-none xmd:w-[200px]"
                from={dateFrom}
                to={dateTo}
                placeholder={[t("common.from"), t("common.to")]}
                onChange={onDateChange}
              />
            </div>

            <div className="shrink-0">
              <SortSelect
                options={sortOptions}
                sortBy={sortBy}
                sortDir={sortDir}
                defaultDir="desc"
                placeholder={t("attendance.sort_by")}
                onChange={onSortChange}
              />
            </div>
          </div>
        </div>
      </>
    );
  },
);

export default AttendanceFilter;
