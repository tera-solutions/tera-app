module.exports = function templateListPage({ Entity, entity }) {
  const ENTITY = entity.toLowerCase();

  return `/* Import: library */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, PlusCircleOutlined } from "tera-dls";

/* Import: packages */
import HeaderSearch from "@tera/components/web/HeaderViewList/HeaderSearch";
import HeaderViewList from "@tera/components/web/HeaderViewList";
import { PAGE_KEY } from "@tera/commons/constants/permission";
import { IModalProps, ListParams } from "@tera/commons/interfaces";

/* Import: services */
import { ${Entity}Service } from "@tera/modules";

/* Import: pages */
import { I${Entity} } from "pages/${entity}/_interface";
import ${Entity}Table from "./containers/${Entity}Table";
import ${Entity}Filter from "./containers/${Entity}Filter";
import ${Entity}FormModal from "./${Entity}FormModal";

const ${Entity}ListPage = () => {
  const { t } = useTranslation();

  const [params, setParams] = useState<ListParams<I${Entity}>>({
    page: 1,
    per_page: 20,
  });

  const [isFilter, setIsFilter] = useState(false);

  const [modalData, setModalData] = useState<IModalProps>({
    open: false,
    type: "create",
    id: undefined,
  });

  const { mutate: onExport } =
    ${Entity}Service.use${Entity}Export();

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

  const handleExport = (type: string) => {
    onExport({ params: { ...params, type } });
  };

  return (
    <div className="p-2.5">
      <HeaderViewList
        title={t("${ENTITY}.title")}
        onClickFilter={() => setIsFilter(true)}
        buttonCreatingKey={PAGE_KEY.${ENTITY.toUpperCase()}_CREATE_VIEW}
        buttonAddRender={() => (
          <Button
            onClick={() =>
              setModalData({ open: true, type: "create" })
            }
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
        <${Entity}Table
          params={params}
          setParams={setParams}
          setModalData={setModalData}
        />
      </HeaderViewList>

      {isFilter && (
        <${Entity}Filter
          open={isFilter}
          onClose={() => setIsFilter(false)}
          onFilter={handleFilter}
          initialValue={params}
        />
      )}

      {modalData.open && (
        <${Entity}FormModal
          open={modalData.open}
          type={modalData.type}
          id={modalData.id}
          onClose={() =>
            setModalData({
              open: false,
              type: "create",
              id: undefined,
            })
          }
        />
      )}
    </div>
  );
};

export default ${Entity}ListPage;
`;
};