/* Import: library */
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";

/* Import: packages */
import { useStores } from "@tera/stores/useStores";

/* Import: pages */
import { ATT_STATUS_KEYS } from "./AttendanceStatus";

interface IProps {
  keyword: string;
  onChangeKeyword: (value: string) => void;
  activeStatus: string;
  onChangeStatus: (value: string) => void;
}

/**
 * Bộ lọc điểm danh: tab trạng thái (từ metadata attendance_status, fallback 4 trạng thái
 * cứng) + ô tìm kiếm theo mã/tên học viên.
 */
const AttendanceFilter = observer(
  ({ keyword, onChangeKeyword, activeStatus, onChangeStatus }: IProps) => {
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

        {/* Search */}
        <div className="flex flex-col gap-2 mb-3 xmd:flex-row xmd:items-center">
          <div className="relative w-full xmd:flex-1">
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
        </div>
      </>
    );
  },
);

export default AttendanceFilter;
