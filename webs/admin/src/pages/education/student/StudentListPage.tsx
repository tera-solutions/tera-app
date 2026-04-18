import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, PlusCircleOutlined } from "tera-dls";

import { StudentService } from "@tera/modules";

import HeaderSearch from "@tera/components/web/HeaderViewList/HeaderSearch";
import HeaderViewList from "@tera/components/web/HeaderViewList";

import { PAGE_KEY } from "@tera/commons/constants/permission";
import { STUDENT_PAGE_URL } from "@tera/commons/constants/url";

import StudentTable from "./containers/StudentTable";
import StudentFilter from "./containers/StudentFilter";

const StudentListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [params, setParams] = useState<any>({});
  const [isFilter, setIsFilter] = useState<boolean>(false);
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
            onClick={() => navigate(STUDENT_PAGE_URL.create.path)}
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
        <StudentTable params={params} setParams={setParams} />
      </HeaderViewList>
      {isFilter && (
        <StudentFilter
          open={isFilter}
          onClose={() => setIsFilter(false)}
          onFilter={handleFilter}
          initialValue={params}
        />
      )}
    </div>
  );
};

export default StudentListPage;
