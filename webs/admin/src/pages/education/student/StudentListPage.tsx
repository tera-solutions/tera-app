/* Import: library */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderSearch from "@tera/components/web/HeaderViewList/HeaderSearch";
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { PAGE_KEY } from "@tera/commons/constants/permission";
import { STUDENT_PAGE_URL } from "@tera/commons/constants/url";
import { IModalProps, ListParams } from "@tera/commons/interfaces";

/* Import: services */
import { StudentService } from "@tera/modules";

/* Import: pages */
import { IStudent } from "pages/education/student/_interface";
import StudentTable from "./containers/StudentTable";
import StudentFilter from "./containers/StudentFilter";
import StudentFormModal from "./StudentFormModal";

const StudentListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [params, setParams] = useState<ListParams<IStudent>>({
    page: 1,
    per_page: 20,
  });
  const [isFilter, setIsFilter] = useState<boolean>(false);
  const [modalData, setModalData] = useState<IModalProps>({
    open: false,
    type: "create",
    id: undefined,
  });
  const { mutate: onExport } = StudentService.useStudentExport();

  const handleSearch = (value) => {
    setParams((prev) => ({
      ...prev,
      keyword: value?.keyword,
      page: 1,
    }));
  };

  const handleFilter = (value) => {
    setParams((prev) => ({
      ...prev,
      ...value,
      page: 1,
    }));
  };

  const handleOpenFilter = () => {
    setIsFilter(true);
  };

  const handleExport = (type: string) => {
    onExport({ params: { ...params, type } });
  };

  return (
    <div className="p-2.5">
      <HeaderViewList
        title={t("student.title")}
        onClickFilter={handleOpenFilter}
        buttonCreatingKey={PAGE_KEY.STUDENT_CREATE_VIEW}
        buttonAddRender={() => (
          <Button
            onClick={() => setModalData({ open: true, type: "create" })}
            className="rounded-xsm shrink-0 px-2 py-1"
          >
            <div className="flex items-center gap-1 shrink-0">
              <PlusCircleOutlined className="w-5 h-5" />
              <span>{t("button.create")}</span>
            </div>
          </Button>
        )}
        dropdownItems={[
          {
            key: 1,
            label: t("button.export_excel"),
            onClick: () => handleExport("excel"),
          },
        ]}
        actionLeftRender={<HeaderSearch onSearch={handleSearch} />}
      >
        <StudentTable
          params={params}
          setParams={setParams}
          setModalData={setModalData}
        />
      </HeaderViewList>
      {isFilter && (
        <StudentFilter
          open={isFilter}
          onClose={() => setIsFilter(false)}
          onFilter={handleFilter}
          initialValue={params}
        />
      )}
      {modalData.open && (
        <StudentFormModal
          open={modalData.open}
          type={modalData.type}
          id={modalData?.id}
          onClose={() =>
            setModalData({ open: false, type: "create", id: undefined })
          }
        />
      )}
    </div>
  );
};

export default StudentListPage;
