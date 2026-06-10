/* Import: library */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderSearch from "@tera/components/web/HeaderViewList/HeaderSearch";
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { BUTTON_KEY } from "@tera/commons/constants/permission";
import { TEACHER_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { TeacherService } from "@tera/modules";

/* Import: pages */
import TeacherTable from "./containers/TeacherTable";
import TeacherFilter from "./containers/TeacherFilter";

const TeacherListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
    pageSize: 20,
  });

  const [isFilter, setIsFilter] = useState(false);

  const { mutate: onExport } = TeacherService.useTeacherExport();

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t("teacher.title")}</h1>
          <p className="text-gray-500 text-sm mt-1">{t("teacher.list")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="default"
            onClick={() => setIsFilter(true)}
          >
            🔍 {t("button.filter")}
          </Button>
          <Button
            type="success"
            onClick={() => navigate(TEACHER_PAGE_URL.create.path)}
          >
            <PlusCircleOutlined />
            {t("button.create")}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        <TeacherTable params={params} setParams={setParams} />
      </div>

      {/* Filter Modal */}
      {isFilter && (
        <TeacherFilter
          open={isFilter}
          onClose={() => setIsFilter(false)}
          onFilter={(v) => setParams(p => ({ ...p, ...v, page: 1 }))}
          initialValue={params}
        />
      )}
    </div>
  );
};

export default TeacherListPage;
