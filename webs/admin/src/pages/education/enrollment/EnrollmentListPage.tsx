/* Import: library */
import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { IModalProps } from "@tera/commons/interfaces";
import { useStores } from "@tera/stores/useStores";
import useIsMobile from "@tera/commons/hooks/useIsMobile";
import { ENROLLMENT_PAGE_URL } from "@tera/commons/constants/url";

/* Import: pages */
import SearchBar from "_common/components/SearchBar";
import FilterButton from "@tera/components/dof/FilterButton";
import EnrollmentFilter from "./containers/EnrollmentFilter";
import EnrollmentFilterModal from "./containers/EnrollmentFilterModal";
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
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [classFilter, setClassFilter] = useState("");
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [courseFilter, setCourseFilter] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [salesFilter, setSalesFilter] = useState("");
  const [selectedSales, setSelectedSales] = useState<any>(null);
  const [debtFilter, setDebtFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const activeFilterCount =
    (studentFilter ? 1 : 0) +
    (classFilter ? 1 : 0) +
    (courseFilter ? 1 : 0) +
    (salesFilter ? 1 : 0) +
    (debtFilter ? 1 : 0) +
    (dateFrom || dateTo ? 1 : 0);

  const [modalData, setModalData] = useState<IModalProps>({
    open: false,
    type: "create",
    id: undefined,
  });

  // Trang create/update/detail (mobile) redirect về đây khi resize sang desktop,
  // kèm state.openModal = { type, id } để mở tiếp đúng modal.
  const location = useLocation();
  useEffect(() => {
    const m = (location.state as any)?.openModal;
    if (m?.type) {
      setModalData({ open: true, type: m.type, id: m.id });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  // Chiều ngược: desktop đang mở modal → resize xuống mobile thì đóng modal
  // và chuyển sang trang riêng (create/update/detail) tương ứng.
  useEffect(() => {
    if (isMobile && modalData.open) {
      const { type, id } = modalData;
      setModalData({ open: false, type: "create", id: undefined });
      if (type === "update" && id != null)
        navigate(ENROLLMENT_PAGE_URL.update.path(id));
      else if (type === "detail" && id != null)
        navigate(ENROLLMENT_PAGE_URL.detail.path(id));
      else navigate(ENROLLMENT_PAGE_URL.create.path);
    }
  }, [isMobile, modalData, navigate]);

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
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList
        title={t("enrollment.title")}
        buttonAddRender={() => (
          <Button
            onClick={() =>
              isMobile
                ? navigate(ENROLLMENT_PAGE_URL.create.path)
                : setModalData({ open: true, type: "create" })
            }
            className="rounded-lg xmd:rounded-xsm shrink-0 px-2 py-1.5 xmd:py-1 cursor-pointer"
          >
            <div className="flex items-center gap-1 shrink-0">
              <PlusCircleOutlined className="w-5 h-5" />
              <span>{t("enrollment.enroll")}</span>
            </div>
          </Button>
        )}
      >
        {/* Status tabs */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-0.5 mt-2 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-transparent">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
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
        <div className="relative z-20 flex flex-wrap items-center gap-2 mb-3">
          {/* Search nuốt phần dư của hàng → luôn dài nhất; các select co lại cho vừa 1 hàng */}
          <div className="flex items-center gap-2 w-full xmd:contents">
            <SearchBar
              className="flex-1 min-w-0 xmd:min-w-[130px]"
              value={keyword}
              placeholder={t("enrollment.search_placeholder")}
              onChange={(v) => {
                setKeyword(v);
                resetPage();
              }}
            />
            <FilterButton
              onClick={() => setFilterModalOpen(true)}
              count={activeFilterCount}
            />
          </div>

          <EnrollmentFilter
            studentId={studentFilter}
            selectedStudent={selectedStudent}
            classId={classFilter}
            selectedClass={selectedClass}
            courseId={courseFilter}
            selectedCourse={selectedCourse}
            sales={salesFilter}
            selectedSales={selectedSales}
            debt={debtFilter}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onStudentChange={(id, item) => {
              setStudentFilter(id);
              setSelectedStudent(item ?? null);
              resetPage();
            }}
            onClassChange={(id, item) => {
              setClassFilter(id);
              setSelectedClass(item ?? null);
              resetPage();
            }}
            onCourseChange={(id, item) => {
              setCourseFilter(id);
              setSelectedCourse(item ?? null);
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

      <EnrollmentFilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        baseParams={{
          search: keyword || undefined,
          status: activeStatus || undefined,
        }}
        value={{
          student: studentFilter,
          selectedStudent,
          classRoom: classFilter,
          selectedClass,
          course: courseFilter,
          selectedCourse,
          sales: salesFilter,
          selectedSales,
          debt: debtFilter,
          dateFrom,
          dateTo,
        }}
        onApply={(v) => {
          setStudentFilter(v.student);
          setSelectedStudent(v.selectedStudent);
          setClassFilter(v.classRoom);
          setSelectedClass(v.selectedClass);
          setCourseFilter(v.course);
          setSelectedCourse(v.selectedCourse);
          setSalesFilter(v.sales);
          setSelectedSales(v.selectedSales);
          setDebtFilter(v.debt);
          setDateFrom(v.dateFrom);
          setDateTo(v.dateTo);
          resetPage();
        }}
      />
    </div>
  );
});

export default EnrollmentListPage;
