/* Import: library */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderViewList from "@tera/components/web/HeaderViewList";
import HeaderSearch from "@tera/components/web/HeaderViewList/HeaderSearch";
import { IModalProps } from "@tera/commons/interfaces";
import { TEACHER_PAGE_URL } from "@tera/commons/constants/url";

/* Import: pages */
import TeacherTable from "./containers/TeacherTable";
import TeacherFilter from "./containers/TeacherFilter";
import TeacherFormModal from "./TeacherFormModal";

const TeacherListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 960);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 960px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const [params, setParams] = useState({
    page: 1,
    per_page: 20,
  });

  const [isFilter, setIsFilter] = useState(false);

  const [modalData, setModalData] = useState<IModalProps>({
    open: false,
    type: "create",
    id: undefined,
  });

  const handleSearch = (value) => {
    setParams((prev) => ({ ...prev, keyword: value?.keyword, page: 1 }));
  };

  const handleFilter = (value) => {
    setParams((prev) => ({ ...prev, ...value, page: 1 }));
  };

  return (
    <div className="p-2.5 max-xmd:pb-[60px]">
      <HeaderViewList
        title={t("teacher.title")}
        onClickFilter={() => setIsFilter(true)}
        buttonAddRender={() => (
          <Button
            onClick={() =>
              isMobile
                ? navigate(TEACHER_PAGE_URL.create.path)
                : setModalData({ open: true, type: "create" })
            }
            className="rounded-lg xmd:rounded-xsm shrink-0 px-2 py-1.5 xmd:py-1"
          >
            <div className="flex items-center gap-1 shrink-0">
              <PlusCircleOutlined className="w-5 h-5" />
              <span>{t("button.create")}</span>
            </div>
          </Button>
        )}
        actionLeftRender={<HeaderSearch onSearch={handleSearch} />}
      >
        <TeacherTable
          params={params}
          setParams={setParams}
          setModalData={setModalData}
        />
      </HeaderViewList>

      {isFilter && (
        <TeacherFilter
          open={isFilter}
          onClose={() => setIsFilter(false)}
          onFilter={handleFilter}
          initialValue={params}
        />
      )}

      {modalData.open && (
        <TeacherFormModal
          open={modalData.open}
          type={modalData.type}
          id={modalData.id}
          onClose={() => setModalData({ open: false, type: "create", id: undefined })}
        />
      )}
    </div>
  );
};

export default TeacherListPage;
