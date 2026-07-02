/* Import: library */
import { useTranslation } from "react-i18next";
import moment from "moment";
import { RangePicker } from "tera-dls";

/* Import: packages */
import useIsMobile from "@tera/commons/hooks/useIsMobile";

/* Import: pages */
import FilterSelect from "_common/components/FilterSelect";
import UserSelect from "_common/components/UserSelect";

interface Option {
  value: string;
  label: string;
}

interface EnrollmentFilterProps {
  studentOptions: Option[];
  classOptions: Option[];
  courseOptions: Option[];
  studentId: string;
  classId: string;
  courseId: string;
  sales: string;
  selectedSales: any;
  debt: string;
  dateFrom: string;
  dateTo: string;
  onStudentChange: (value: string) => void;
  onClassChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onSalesChange: (id: string, user?: any) => void;
  onDebtChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
}

const DATE_INPUT_MOBILE =
  "w-full h-9 border border-gray-300 bg-white px-2 text-[13px] rounded-[3px] hover:border-blue-700 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-700 box-border";

/** Bộ lọc nhanh danh sách ghi danh. */
const EnrollmentFilter = ({
  studentOptions,
  classOptions,
  courseOptions,
  studentId,
  classId,
  courseId,
  sales,
  selectedSales,
  debt,
  dateFrom,
  dateTo,
  onStudentChange,
  onClassChange,
  onCourseChange,
  onSalesChange,
  onDebtChange,
  onDateFromChange,
  onDateToChange,
}: EnrollmentFilterProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const debtOptions = [
    { value: "1", label: t("enrollment.has_debt") },
    { value: "0", label: t("enrollment.no_debt") },
  ];

  return (
    <>
      <FilterSelect
        className="flex-1 min-w-[150px]"
        value={studentId}
        placeholder={t("enrollment.all_students")}
        options={studentOptions}
        onChange={onStudentChange}
      />
      <FilterSelect
        className="flex-1 min-w-[140px]"
        value={classId}
        placeholder={t("enrollment.all_classes")}
        options={classOptions}
        onChange={onClassChange}
      />
      <FilterSelect
        className="flex-1 min-w-[140px]"
        value={courseId}
        placeholder={t("enrollment.all_courses")}
        options={courseOptions}
        onChange={onCourseChange}
      />
      <div className="flex-1 min-w-[160px]">
        <UserSelect
          value={sales}
          selectedUser={selectedSales}
          placeholder={t("enrollment.all_sales")}
          allowClear
          onChange={onSalesChange}
        />
      </div>
      <FilterSelect
        className="flex-1 min-w-[130px]"
        value={debt}
        placeholder={t("enrollment.all_debt")}
        options={debtOptions}
        onChange={onDebtChange}
      />
      {/* Ngày ghi danh — date range (desktop RangePicker / mobile native) */}
      {isMobile ? (
        <div className="w-full flex items-center gap-1.5">
          <input
            type="date"
            className={DATE_INPUT_MOBILE}
            value={dateFrom}
            max={dateTo || undefined}
            onChange={(e) => onDateFromChange(e.target.value)}
            title={t("enrollment.enrolled_from")}
          />
          <span className="text-gray-400 shrink-0">→</span>
          <input
            type="date"
            className={DATE_INPUT_MOBILE}
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => onDateToChange(e.target.value)}
            title={t("enrollment.enrolled_to")}
          />
        </div>
      ) : (
        <RangePicker
          className="shrink-0 w-[290px]"
          value={
            dateFrom && dateTo
              ? [moment(dateFrom, "YYYY-MM-DD"), moment(dateTo, "YYYY-MM-DD")]
              : undefined
          }
          format="DD/MM/YYYY"
          placeholder={[t("enrollment.enrolled_from"), t("enrollment.enrolled_to")]}
          allowClear
          onChange={(dates: any) => {
            onDateFromChange(dates?.[0] ? moment(dates[0]).format("YYYY-MM-DD") : "");
            onDateToChange(dates?.[1] ? moment(dates[1]).format("YYYY-MM-DD") : "");
          }}
        />
      )}
    </>
  );
};

export default EnrollmentFilter;
