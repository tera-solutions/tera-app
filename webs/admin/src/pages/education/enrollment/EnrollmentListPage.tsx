/* Import: library */
import { useState } from "react";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { IModalProps } from "@tera/commons/interfaces";
import { useStores } from "@tera/stores/useStores";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { ENROLLMENT_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { StudentService, ClassRoomService, CourseService } from "@tera/modules";

/* Import: pages */
import SearchBar from "_common/components/SearchBar";
import EnrollmentFilter from "./containers/EnrollmentFilter";
import EnrollmentTable from "./containers/EnrollmentTable";
import EnrollmentFormModal from "./EnrollmentFormModal";

const EnrollmentListPage = observer(() => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { globalStore } = useStores();

  const [params, setParams] = useState<any>({ page: 1, per_page: 20 });
  const [activeStatus, setActiveStatus] = useState("");
  const [keyword, setKeyword] = useState("");
  const [studentFilter, setStudentFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [salesFilter, setSalesFilter] = useState("");
  const [selectedSales, setSelectedSales] = useState<any>(null);
  const [debtFilter, setDebtFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [modalData, setModalData] = useState<IModalProps>({
    open: false,
    type: "create",
    id: undefined,
  });

  const { data: studentData } = StudentService.useStudentList({
    params: { page: 1, per_page: 100 },
  });
  const studentsList: any[] = studentData?.data?.items ?? [];

  const { data: classData } = ClassRoomService.useClassRoomList({
    params: { page: 1, per_page: 100 },
  });
  const classes: any[] = classData?.data?.items ?? [];

  const { data: courseData } = CourseService.useCourseList({
    params: { page: 1, per_page: 100 },
  });
  const courses: any[] = courseData?.data?.items ?? [];

  const statusOptions = globalStore.getOptions("enrollment_status") ?? [];
  const statusTabs = [
    { key: "", label: t("common.all") },
    ...statusOptions.map((o: any) => ({ key: o.value, label: o.label })),
  ];

  const tableParams = {
    ...params,
    search: keyword || undefined,
    status: activeStatus || undefined,
    student_id: studentFilter || undefined,
    class_id: classFilter || undefined,
    course_id: courseFilter || undefined,
    sales_id: salesFilter || undefined,
    has_debt: debtFilter || undefined,
    enrolled_from: dateFrom || undefined,
    enrolled_to: dateTo || undefined,
  };

  const resetPage = () => setParams((p: any) => ({ ...p, page: 1 }));

  const handleStatusChange = (status: string) => {
    setActiveStatus(status);
    resetPage();
  };

  return (
    <div className='p-2.5 max-xmd:pb-[60px]'>
      <HeaderViewList
        title={t("enrollment.title")}
        buttonAddRender={() => (
          <Button
            onClick={() =>
              isMobile
                ? navigate(ENROLLMENT_PAGE_URL.create.path)
                : setModalData({ open: true, type: "create" })
            }
            className='rounded-lg xmd:rounded-xsm shrink-0 px-2 py-1.5 xmd:py-1 cursor-pointer'
          >
            <div className='flex items-center gap-1 shrink-0'>
              <PlusCircleOutlined className='w-5 h-5' />
              <span>{t("enrollment.enroll")}</span>
            </div>
          </Button>
        )}
      >
        {/* Status tabs */}
        <div className='flex gap-1.5 mb-3 overflow-x-auto pb-0.5 mt-2 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent'>
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type='button'
              onClick={() => handleStatusChange(tab.key)}
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

        {/* Search + filter row */}
        <div className='relative z-20 flex flex-wrap items-center gap-2 mb-3'>
          <SearchBar
            className='w-full xmd:w-[240px] xmd:shrink-0'
            value={keyword}
            placeholder={t("enrollment.search_placeholder")}
            onChange={(v) => {
              setKeyword(v);
              resetPage();
            }}
          />

          <EnrollmentFilter
            studentOptions={studentsList.map((s) => ({
              value: String(s.id),
              label: s.code ? `${s.code} - ${s.name}` : s.name,
            }))}
            classOptions={classes.map((c) => ({
              value: String(c.id),
              label: c.code ? `${c.code} - ${c.name}` : c.name,
            }))}
            courseOptions={courses.map((c) => ({
              value: String(c.id),
              label: c.code ? `${c.code} - ${c.name}` : c.name,
            }))}
            studentId={studentFilter}
            classId={classFilter}
            courseId={courseFilter}
            sales={salesFilter}
            selectedSales={selectedSales}
            debt={debtFilter}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onStudentChange={(v) => {
              setStudentFilter(v);
              resetPage();
            }}
            onClassChange={(v) => {
              setClassFilter(v);
              resetPage();
            }}
            onCourseChange={(v) => {
              setCourseFilter(v);
              resetPage();
            }}
            onSalesChange={(id, user) => {
              setSalesFilter(id);
              setSelectedSales(user ?? null);
              resetPage();
            }}
            onDebtChange={(v) => {
              setDebtFilter(v);
              resetPage();
            }}
            onDateFromChange={(v) => {
              setDateFrom(v);
              resetPage();
            }}
            onDateToChange={(v) => {
              setDateTo(v);
              resetPage();
            }}
          />
        </div>

        <EnrollmentTable
          params={tableParams}
          setParams={setParams}
          setModalData={setModalData}
        />
      </HeaderViewList>

      {modalData.open && (
        <EnrollmentFormModal
          open={modalData.open}
          type={modalData.type}
          id={modalData.id}
          onClose={() =>
            setModalData({ open: false, type: "create", id: undefined })
          }
        />
      )}
    </div>
  );
});

export default EnrollmentListPage;
