/* Import: library */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderSearch from "@tera/components/web/HeaderViewList/HeaderSearch";
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { BUTTON_KEY } from "@tera/commons/constants/permission";
import { COURSE_PAGE_URL } from "@tera/commons/constants/url";

/* Import: services */
import { CourseService } from "@tera/modules";

/* Import: pages */
import CourseTable from "./containers/CourseTable";
import CourseFilter from "./containers/CourseFilter";

const CourseListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [params, setParams] = useState({
    page: 1,
    pageSize: 20,
  });

  const [isFilter, setIsFilter] = useState(false);

  const { mutate: onExport } = CourseService.useCourseExport();

  return (
    <div className="p-2.5">
      <HeaderViewList
        title={t("course.title")}
        onClickFilter={() => setIsFilter(true)}
        buttonCreatingKey={BUTTON_KEY.COURSE_CREATE}
        buttonAddRender={() => (
          <Button onClick={() => navigate(COURSE_PAGE_URL.create.path)}>
            <PlusCircleOutlined />
            {t("button.create")}
          </Button>
        )}
        dropdownItems={[
          {
            key: "export",
            label: t("button.export_excel"),
            onClick: () => onExport({ params }),
          },
        ]}
        actionLeftRender={
          <HeaderSearch
            onSearch={(v) =>
              setParams((p) => ({ ...p, keyword: v?.keyword, page: 1 }))
            }
          />
        }
      >
        <CourseTable params={params} setParams={setParams} />
      </HeaderViewList>

      {isFilter && (
        <CourseFilter
          open={isFilter}
          onClose={() => setIsFilter(false)}
          onFilter={(v) => setParams((p) => ({ ...p, ...v, page: 1 }))}
          initialValue={params}
        />
      )}
    </div>
  );
};

export default CourseListPage;
