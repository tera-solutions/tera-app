/* Import: library */
import { useTranslation } from "react-i18next";

/* Import: services */
import { StudentService, ClassRoomService, CourseService } from "@tera/modules";

/* Import: pages */
import DateRangeFilter from "_common/components/DateRangeFilter";
import FilterSelect from "_common/components/FilterSelect";
import SearchSelect from "_common/components/SearchSelect";
import UserSelect, { TEACHER_ROLE_ID } from "_common/components/UserSelect";

interface EnrollmentFilterProps {
  studentId: string;
  selectedStudent: any;
  classId: string;
  selectedClass: any;
  courseId: string;
  selectedCourse: any;
  sales: string;
  selectedSales: any;
  debt: string;
  dateFrom: string;
  dateTo: string;
  onStudentChange: (id: string, item?: any) => void;
  onClassChange: (id: string, item?: any) => void;
  onCourseChange: (id: string, item?: any) => void;
  onSalesChange: (id: string, user?: any) => void;
  onDebtChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
}

const withCode = (item: any) =>
  item?.code ? `${item.code} - ${item.name}` : (item?.name ?? `#${item?.id}`);

/** Bộ lọc nhanh danh sách ghi danh. */
const EnrollmentFilter = ({
  studentId,
  selectedStudent,
  classId,
  selectedClass,
  courseId,
  selectedCourse,
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

  const debtOptions = [
    { value: "1", label: t("enrollment.has_debt") },
    { value: "0", label: t("enrollment.no_debt") },
  ];

  return (
    <>
      {/* Học viên/Lớp/Khóa/Sale/Công nợ — CHỈ hiện desktop (mobile đưa vào modal "Lọc") */}
      <div className="hidden xmd:contents">
        <div className="flex-1 min-w-[140px] xmd:flex-none xmd:min-w-0 xmd:w-[128px]">
          <SearchSelect
            allowClear
            value={studentId}
            selectedItem={selectedStudent}
            placeholder={t("enrollment.all_students")}
            useList={StudentService.useStudentList}
            getLabel={withCode}
            onChange={onStudentChange}
          />
        </div>
        <div className="flex-1 min-w-[130px] xmd:flex-none xmd:min-w-0 xmd:w-[132px]">
          <SearchSelect
            allowClear
            value={classId}
            selectedItem={selectedClass}
            placeholder={t("enrollment.all_classes")}
            useList={ClassRoomService.useClassRoomList}
            getLabel={withCode}
            onChange={onClassChange}
          />
        </div>
        <div className="flex-1 min-w-[130px] xmd:flex-none xmd:min-w-0 xmd:w-[132px]">
          <SearchSelect
            allowClear
            value={courseId}
            selectedItem={selectedCourse}
            placeholder={t("enrollment.all_courses")}
            useList={CourseService.useCourseList}
            getLabel={withCode}
            onChange={onCourseChange}
          />
        </div>
        <div className="flex-1 min-w-[150px] xmd:flex-none xmd:min-w-0 xmd:w-[152px]">
          <UserSelect
            value={sales}
            selectedUser={selectedSales}
            placeholder={t("enrollment.all_sales")}
            allowClear
            extraParams={{ role_id: TEACHER_ROLE_ID }}
            onChange={onSalesChange}
          />
        </div>
        <FilterSelect
          allowClear
          className="flex-1 min-w-[120px] xmd:flex-none xmd:min-w-0 xmd:w-[104px]"
          value={debt}
          placeholder={t("enrollment.all_debt")}
          options={debtOptions}
          onChange={onDebtChange}
        />
      </div>
      {/* Ngày ghi danh — date range — CHỈ desktop; mobile đưa vào modal "Lọc" */}
      <div className="hidden xmd:contents">
        <DateRangeFilter
          className="w-full xmd:w-[200px] xmd:shrink-0"
          from={dateFrom}
          to={dateTo}
          placeholder={[t("common.from"), t("common.to")]}
          onChange={(from, to) => {
            onDateFromChange(from);
            onDateToChange(to);
          }}
        />
      </div>
    </>
  );
};

export default EnrollmentFilter;
